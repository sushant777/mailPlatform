class EmailService {
    constructor() {
        this.oauth2 = null;
    }

    authUrl() {
        throw new Error('authUrl method must be implemented by subclasses');
    }

    syncInbox() {
        throw new Error('syncInbox method must be implemented by subclasses');
    }

    refreshToken() {
        throw new Error('syncInbox method must be implemented by subclasses');
    }


}

module.exports = EmailService;

