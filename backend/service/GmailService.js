require('dotenv').config();
const EmailService = require('./EmailService');

class GmailService extends EmailService {
    auth = null;
    constructor(auth) {
        super();
        this.auth = auth;
    }

    authUrl() {
        return "Gmail Auth URL";
    };

    async syncInbox() {
        console.log("Syncing Gmail Inbox");
    }

    async refreshToken() {
        console.log("Re-generate the token");
    }



}

module.exports = GmailService;
