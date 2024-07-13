# Email Manager

A simple Node.js-based project that supports multiple email clients. With this application, you can sign up, connect multiple email accounts, and manage or sync them seamlessly.

## Features

- Sign up and log in
- Connect and manage multiple email accounts
- Sync emails across different clients
- Unified inbox for all connected email accounts

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v12.x or later)
- [npm](https://www.npmjs.com/)

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/email-manager.git
    cd email-manager
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    PORT=3000
    DATABASE_URL=your_database_url
    SESSION_SECRET=your_session_secret
    ```

2. Set up OAuth credentials for the email clients you want to support (e.g., Gmail, Outlook). Add these credentials to your `.env` file:

    ```plaintext
    GMAIL_CLIENT_ID=your_gmail_client_id
    GMAIL_CLIENT_SECRET=your_gmail_client_secret
    OUTLOOK_CLIENT_ID=your_outlook_client_id
    OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
    ```

### Running the Application

1. Start the server:

    ```bash
    npm start
    ```

2. Open your browser and go to `http://localhost:3000` to see the application in action.

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

