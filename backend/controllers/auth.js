require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const OutlookService = require("../service/OutlookService");
const UserAuth = require("../models/UserAuth");
const GmailService = require("../service/GmailService");

exports.signup = async (req, res) => {
  const user = new User();

  if (req.body.hasOwnProperty("username")) {
    let usernameExistAlready = await user.findByUsername(req.body.username);
    if (usernameExistAlready) {
      return res.status(400).json({ message: "Username already exist" });
    }
  }

  if (req.body.hasOwnProperty("emailClient")) {
    if (req.body.emailClient == "outlook") {
      let url = OutlookService.authUrl();
      res.json({
        message: "User registered, Proceed for authentication",
        url: url,
      });
    }

    if (req.body.emailClient == "gmail") {
      let gmail = new GmailService(null);
      let url = gmail.authUrl();
      res.json({
        message: "User registered, Proceed for authentication",
        url: url,
      });
    }
  } else {
    return res.status(400).json({ message: "Email client not found" });
  }
};

exports.login = async (req, res) => {
  let outLookSubscriptionId = null;
  const { username, password } = req.body;
  const user = await new User().findByUsername(username);
  if (user && (await bcrypt.compare(password, user.password))) {
    // Initial Subscription for auto mail update in DB.
    const auths = await new UserAuth().findByUserId(user.id);
    for (let i = 0; i < auths.length; i++) {
      const auth = auths[i];
      if (auth.emailClient == "outlook") {
        // subscribe to outlook event
        const outlookService = new OutlookService(auth);
        const subscription = await outlookService.subscribeInbox({
          changeType: "created,updated,deleted",
          notificationUrl:
            "https://76a7-2405-201-5009-31e1-3113-1e2a-8354-875.ngrok-free.app/email/webhookOutLook",
          resource: "/me/mailfolders('inbox')/messages",
          expirationDateTime: new Date(
            Date.now() + 3600 * 1000 * 24
          ).toISOString(), // 24 hours from now
          clientState: user.id, // Id of relative user
        });

        outLookSubscriptionId = subscription.id;
      }
    }

    const token = jwt.sign(
      {
        username: username,
        userId: user.id,
        outLookSubscriptionId: outLookSubscriptionId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );

    return res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.verifyCodeOutLook = async (req, res) => {
  try {
    const { code, username, password, emailClient } = req.body;
    const options = {
      code: code,
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
      grant_type: "authorization_code",
    };

    const accessToken = await OutlookService.getToken(options);

    const user = new User();
    let insertedUserId = await user.save({
      username: username,
      password: password,
    });

    const userAuth = new UserAuth();
    const auth = {
      userId: insertedUserId,
      refresh_token: accessToken.token.refresh_token,
      access_token: accessToken.token.access_token,
      emailClient: emailClient,
    };

    let insertedUserAuthId = await userAuth.save(auth);

    // Initial fetch user inbox, sync outlook mails
    let outlookService = new OutlookService(auth);
    await outlookService.syncInbox();

    res.json({
      token: accessToken.token,
      insertedUserId: insertedUserId,
      insertedUserAuthId: insertedUserAuthId,
    });
  } catch (error) {
    console.error("Access Token Error", error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
};

exports.logout = async (req, res) => {
  const user = await new User().findByUsername(res.username);
  const auths = await new UserAuth().findByUserId(user.id);

  // Detach the subscription after logout.
  auths.forEach(async (auth) => {
    if (auth.emailClient == "outlook") {
      const outlookService = new OutlookService(auth);
      await outlookService.deleteSubscriptionsByClientState(res.userId);
      await outlookService.deleteSubscription(
        res.outLookSubscriptionId
      );
    }
  });

  return res.json({ message: "Logout successful." });
};
