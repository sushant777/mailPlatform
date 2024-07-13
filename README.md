# Email Manager

A simple Node.js-based project that supports multiple email clients. With this application, you can sign up, connect multiple email accounts, and manage or sync them seamlessly.

## Features

- Sign up and log in
- Connect and manage multiple email accounts
- Sync emails across different clients
- Unified inbox for all connected email accounts

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v16.x or later)
- [npm](https://www.npmjs.com/)

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone [https://github.com/yourusername/email-manager.git](https://github.com/sushant777/mailPlatform.git)
    cd email-manager
    ```

2. Install the dependencies:

    ```bash
    docker-compose up --build
    ```

### Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    #ELASTICSEARCH_NODE=http://localhost:9200
    ELASTICSEARCH_NODE=http://elasticsearch:9200
    PORT=3005
    JWT_SECRET=your_jwt_secret
    ```

2. Set up OAuth credentials for the email clients you want to support (e.g., Gmail, Outlook). Add these credentials to your `.env` file:

    ```plaintext
    OUTLOOK_CLIENT_ID=key
    OUTLOOK_CLIENT_SECRET_ID=key
    OUTLOOK_CLIENT_SECRET=key
    OUTLOOK_TENANT_ID=key
    OUTLOOK_REDIRECT_URI=http://localhost:8080/outlookCallBack.html
    ```

### Running the Application

1. Start the server:

    ```bash
    docker-compose up --build
    ```

2. Open your browser and go to `http://localhost:8080` to see the application in action.

## Usage

- **Sign Up**: Create a new account.
- **Log In**: Access your existing account.
- **Connect Email Accounts**: Add multiple email accounts (e.g., Gmail, Outlook) to your profile.
- **Manage Emails**: View and manage emails from all connected accounts in one place.
- **Sync Emails**: Automatically sync emails across all connected email clients.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [OAuth2](https://oauth.net/2/)
- [Gmail API](https://developers.google.com/gmail/api)
- [Microsoft Graph API](https://developer.microsoft.com/en-us/graph/)

