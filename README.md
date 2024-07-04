# Password Manager Discord Bot

This is a Discord bot that can generate, save, and retrieve passwords. The bot uses a local JSON file to store passwords securely and provides various slash commands to interact with the stored data.

## Features

- **Generate Passwords**: Generate random passwords using an external API.
- **Save Passwords**: Save passwords with associated site, email, and tag information.
- **View Passwords**: View all saved passwords.
- **Tag Search**: Retrieve passwords based on a specific tag.

## Prerequisites

- Node.js (version 16.6.0 or higher)
- npm (Node Package Manager)
- A Discord bot token

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/CatfishGG/password_manager.git
cd password_manager
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create `passwords.json` File

Create a `passwords.json` file in the root of your project directory and initialize it with an empty array:

```json
[

]
```

### 4. Update Configuration in `index.mjs`

Ensure the following constants are correctly set in your `index.mjs` file:

```javascript
const TOKEN = 'your-bot-token-here';
const CLIENT_ID = 'your-client-id-here';
const GUILD_ID = 'your-guild-id-here';
const PASSWORDS_FILE = './passwords.json';
const API_URL = 'khudki password gen api banadi thi timepass me isliye normal password gen ki jagah api use karli (feel free to change the API to a password gen made directly into this bot)';
```

### 5. Run the Bot

Start the bot by running the following command:

```sh
npm start
```

## Commands

### `/generatepassword`
Generates a random password using an external API.

**Options:**
- `length` (optional): The length of the password (default: 12).

### `/savepassword`
Saves a password with associated site, email, and tag information.

**Options:**
- `site`: The site URL.
- `email`: The email address.
- `password`: The password.
- `tag`: A tag to categorize the password.

### `/viewpasswords`
Displays all saved passwords.

### `/tag`
Fetches passwords based on a specific tag.

**Options:**
- `tag`: The tag to search for.

## Example Usage

### Generate a Password

```
/generatepassword length:16
```

### Save a Password

```
/savepassword site:https://example.com email:example@gmail.com password:examplepassword tag:personal
```

### View All Passwords

```
/viewpasswords
```

### Retrieve Password by Tag

```
/tag tag:personal
```
