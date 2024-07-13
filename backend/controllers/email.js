require("dotenv").config();
const User = require("../models/User");
const OutlookService = require("../service/OutlookService");
const UserAuth = require("../models/UserAuth");
const UserEmail = require("../models/UserEmail");

exports.inbox = async (req, res) => {
  const user = await new User().findByUsername(res.username);
  const mails = await new UserEmail().findByUserId(user.id);

  return res.json(mails);
};

// currently focus on only outlook
exports.send = async (req, res) => {
  const user = await new User().findByUsername(res.username);

  if (req.body.emailClient == "outlook") {
    const auth = await new UserAuth().findByEmailClientAndUserId(
      "outlook",
      user.id
    );
    if (auth) {
      let outlookService = new OutlookService(auth);

      const mail = {
        subject: req.body.subject,
        toRecipients: [
          {
            emailAddress: {
              address: req.body.to,
            },
          },
        ],
        body: {
          content: req.body.body,
          contentType: "text", // html
        },
      };

      let response = await outlookService.sendEmail(mail);
      return res.json(response);
    }
  }

  return res.json(req.body);
};

exports.webhookOutLook = async (req, res) => {
  const validationToken = req.query.validationToken;

  if (validationToken) {
    // Respond to the validation request
    res.send(validationToken);
  } else {
    try {
      const notification = req.body.value[0];
      const auth = await new UserAuth().findByEmailClientAndUserId(
        "outlook",
        notification.clientState
      );
      if (!auth || auth == false) {
        return res.sendStatus(202);
      }
      const outlookService = new OutlookService(auth);
      const userEmail = new UserEmail();

      switch (notification.changeType) {
        case "created":
          console.log("Email Created");
          const mail = await outlookService.singleMail(
            notification.resourceData.id
          );
          await userEmail.save({
            from:
              mail.from.emailAddress.name +
              " : " +
              mail.from.emailAddress.address,
            subject: mail.subject,
            body: mail.bodyPreview,
            on: mail.sentDateTime,
            emailClient: "outlook",
            mailId: mail.id,
            isRead: mail.isRead,
            userId: notification.clientState,
          });
          break;

        case "updated":
          console.log("Email Updated");

          const mailForUpdate = await userEmail.findByMailId(
            notification.resourceData.id
          );
          if (mailForUpdate) {
            const mail = await outlookService.singleMail(
              notification.resourceData.id
            );

            await userEmail.update(mailForUpdate.id, {
              isRead: mail.isRead,
            });
          }
          break;

        case "deleted":
          console.log("Email Deleted..");

          const mailForDelete = await userEmail.findByMailId(
            notification.resourceData.id
          );

          if (mailForDelete) {
            await userEmail.delete(mailForDelete.id);
          }
          break;

        default:
          break;
      }

      res.sendStatus(202);
    } catch (error) {
      console.log(error);
      res.sendStatus(200);
    }
  }
};
