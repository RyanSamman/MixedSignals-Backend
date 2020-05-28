# Contents
- [Steps to begin Development](#Steps-to-begin-developing)
- [Starting the Express Server](#Starting-the-Express-Server)
- [Linting](#Linting)

# Steps to begin developing

## Install the required `node_modules`

`npm install`

## Configure the Enviroment Variables

- Copy the file `.env.example`:
- Rename the copy to `.env`
- Fill out the required varibles

```
API_KEY="<API-KEY>"

MONGO_URI="mongodb+srv://<USERNAME>:<PASSWORD>@mixedsignals-s6wpf.mongodb.net/test?retryWrites=true&w=majority"

```

Replace `<API-KEY>` with your [AlphaVantage API Key](https://www.alphavantage.co/support/#api-key)
, `<USERNAME>` and `<PASSWORD>`
with your MongoDB user information.

# Starting the Express Server

Use the command `npm run server` to start the server

⚠ With `nodemon`, it will cause the server to automatically restart upon saving or crash 

# Linting

Display warnings and Errors:
```npm run lint```

Display errors only
```npm run linterrors```

Automatically fix all errors and warnings
```npm run lintfix```

## Linting Configuration:
- Tabs instead of spaces; **Make sure to change this in your code editor**
- Single quotation marks `'` Instead of `"` for Strings
- Semicolons
- `CRLF` line endings

## Why this configuration?
- You can change how tabs are represented in your code editor to display as 2 spaces or 4 spaces
- Git automatically changes Unix's `LF` line endings to `CRLF`

[Back to the top](#Contents)