require("dotenv").config();
const { AuthorizationCode } = require("simple-oauth2");
const EmailService = require("./EmailService");
require("isomorphic-fetch");
const { Client } = require("@microsoft/microsoft-graph-client");
const UserAuth = require("../models/UserAuth");
const UserEmail = require("../models/UserEmail");

const oauth2 = new AuthorizationCode({
  client: {
    id: process.env.OUTLOOK_CLIENT_ID,
    secret: process.env.OUTLOOK_CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    authorizePath: "/common/oauth2/v2.0/authorize",
    tokenPath: "/common/oauth2/v2.0/token",
  },
});

class OutlookService extends EmailService {
  auth = null;
  client = null;
  constructor(auth) {
    super();
    this.auth = auth;
    this.setUpClient();
  }

  setUpClient() {
    this.client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => this.auth.access_token,
      },
    });
  }

  static authUrl() {
    return oauth2.authorizeURL({
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
      scope: [
        "User.Read",
        "User.Read.All",
        "openid",
        "profile",
        "offline_access",
        "Mail.Read",
        "Mail.Send",
      ],
    });
  }

  static getToken(options) {
    return oauth2.getToken(options);
  }

  async initGraphClient(accessToken) {
    const client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => accessToken,
      },
    });

    return client;
  }

  async makeRequestWithRetry(request) {
    const MAX_RETRIES = 5;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        console.log("attempt # ", attempt);
        const response = await request();
        return response;
      } catch (error) {
        console.log("error.code = ", error.code);
        if (error.code && error.code == "InvalidAuthenticationToken") {
          console.log(
            "auth token not valid / expired , Token Being Re-freash, Re-trying..."
          );
          // Token has been expired, re-issue now
          await this.refreshToken();
        } else if (error.code && error.code == "TooManyRequests") {
          // Too many requests, add up delay
          const retryAfter = error.response.headers["Retry-After"];
          if (retryAfter) {
            const delay = retryAfter * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        } else {
          console.log("UnKnown Error ...");
          throw error;
        }
      }
      attempt++;
    }

    throw new Error("Max retries exceeded");
  }

  async getUserDetails() {
    try {
      return this.makeRequestWithRetry(async () => {
        return this.client.api("/me").get();
      });
    } catch (error) {
      throw error;
    }
  }

  async getInbox() {
    try {
      return this.makeRequestWithRetry(async () => {
        return this.client.api("/me/mailFolders/inbox/messages").get();
      });
    } catch (error) {
      throw error;
    }
  }

  async singleMail(messageId) {
    try {
      return this.makeRequestWithRetry(async () => {
        return this.client.api(`/me/messages/${messageId}`).get();
      });
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(mail) {
    try {
      return this.makeRequestWithRetry(async () => {
        return this.client.api("/me/sendMail").post({ message: mail });
      });
    } catch (error) {
      throw error;
    }
  }

  async subscribeInbox(input) {
    try {
      return this.makeRequestWithRetry(async () => {
        return this.client.api("/subscriptions").post(input);
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteSubscription(subscriptionId) {
    try {
      return this.makeRequestWithRetry(async () => {
        return this.client.api(`/subscriptions/${subscriptionId}`).delete();
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteSubscriptionsByClientState(clientState) {
    try {
      // List all subscriptions
      const subscriptions = await this.client.api("/subscriptions").get();
      const subscriptionsToDelete = subscriptions.value.filter(
        (sub) => sub.clientState === clientState
      );

      console.log(
        `Found ${subscriptionsToDelete.length} subscriptions with clientState '${clientState}'`
      );

      for (const sub of subscriptionsToDelete) {
        try {
          // Delete the subscription
          await this.client.api(`/subscriptions/${sub.id}`).delete();
          console.log(`Deleted subscription with id: ${sub.id}`);
        } catch (error) {
          console.error(
            `Error deleting subscription with id ${sub.id}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Error retrieving subscriptions:", error);
    }
  }

  async refreshToken() {
    // Token has been expired, re-issue now
    const newAccess = await oauth2.getToken({
      refresh_token: this.auth.refresh_token,
      grant_type: "refresh_token",
    });

    await new UserAuth().update(this.auth.id, {
      access_token: newAccess.token.access_token,
      emailClient: "outlook",
      refresh_token: newAccess.token.refresh_token,
      userId: this.auth.userId,
    });

    this.auth.access_token = newAccess.token.access_token;
    this.setUpClient();
  }

  async syncInbox() {
    let mails = [];
    try {
      mails = await this.getInbox();
    } catch (error) {
      throw error;
    }

    mails = mails.value.map((mail) => {
      return {
        from:
          mail.from.emailAddress.name + " : " + mail.from.emailAddress.address,
        subject: mail.subject,
        body: mail.bodyPreview,
        on: mail.sentDateTime,
        emailClient: "outlook",
        mailId: mail.id,
        isRead: mail.isRead,
        userId: this.auth.userId,
      };
    });

    let userEmail = new UserEmail();

    return Promise.all(
      mails.map(async (mail) => {
        let dbMail = await userEmail.findByMailIdAndUserId(
          mail.mailId,
          this.auth.userId
        );
        if (dbMail == false) {
          mail.id = await userEmail.save(mail);
        }
        return mail;
      })
    );
  }
}

module.exports = OutlookService;
