# Kite.Inc

Kite.Inc is a full-stack social network for an inclusive kitesurfing community. It combines a React single-page application with an Express API, PostgreSQL persistence, Socket.IO chat, password-reset email delivery, and S3-backed profile image uploads.

A high priority of this Single Page Application is conditional rendering, security concerns such as password hashing, protection against SQL injection, CSRF and XSS attacks, password reset by email, and differentiated error handling in the registration, login, and reset-password flows.

<img src="/public/socialnetwork.gif" alt="gif to display how social network works">

## What the application does

The app supports the full user flow from anonymous visitor to logged-in community member:

- Register with first name, last name, email address, password, and password confirmation
- Log in and keep an authenticated session with cookie-based sessions and CSRF protection
- View and edit a personal profile, including biography text and a profile image
- Search for people by first or last name
- Browse the latest registered users
- Open other users' profiles
- Send, accept, cancel, and remove friend requests
- View friends and pending friendship requests
- See friends-of-friends on another user's profile
- Join the realtime public chat and receive the latest chat history over websockets
- Reset a password by email with a time-limited verification code
- Log out and return to the welcome flow

## Tech stack

### Frontend

- React 18
- React Router 5
- Redux with redux-promise
- Axios
- Webpack 5
- Babel 7

### Backend

- Node.js 24
- Express 4
- Socket.IO 4
- PostgreSQL via `spiced-pg`
- Cookie-based sessions with `cookie-session`
- CSRF protection with `csurf`
- File uploads with `multer`

### AWS integrations

- Amazon S3 for uploaded profile images
- Amazon SES for password-reset emails
- AWS SDK for JavaScript v3 (`@aws-sdk/client-s3` and `@aws-sdk/client-ses`)

## Recent modernization changes

This repository has been refreshed to run on a current Node toolchain:

- Upgraded the project to target **Node.js 24**
- Updated the npm dependency set and lockfile
- Migrated the frontend bootstrap to **React 18** with `createRoot`
- Added an explicit `socket.io-client` dependency
- Updated `http-proxy-middleware` usage to the current API
- Removed legacy `@babel/polyfill` usage from the build and test setup
- Updated Jest setup to run with `jest-environment-jsdom`
- Migrated the AWS integration from the deprecated `aws-sdk` v2 package to **AWS SDK v3**
- Fixed older test fixtures and imports so the repository works again on the modern stack
- Kept the existing app architecture and routes intact while making it build and run on the newer platform

## Requirements

- Node.js **24.x**
- npm **11+**
- PostgreSQL
- An AWS account and configured credentials if you want profile uploads and password reset emails to work end-to-end

## Environment and local configuration

The app reads secrets from environment variables in production. For local development it also supports a root-level `secrets.js` file that exports the same values.

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. If omitted, the app falls back to `postgres:postgres:postgres@localhost:5432/socialnetwork` as defined in `db.js`. |
| `AWS_KEY` | AWS access key for S3 and SES |
| `AWS_SECRET` | AWS secret access key for S3 and SES |
| `PORT` | Optional Express port. Defaults to `8080` |
| `NODE_ENV` | Optional runtime mode. Development defaults to proxying `bundle.js`; production serves the generated bundle directly |

### Optional local `secrets.js`

Create `secrets.js` in the repository root if you prefer local file-based secrets during development:

```js
module.exports = {
    AWS_KEY: "your-access-key",
    AWS_SECRET: "your-secret-key",
};
```

You can create these credentials as an IAM access key pair in AWS. In practice, they come from either:

- your shell environment
- a deployment platform's configured environment variables
- a local, untracked `secrets.js` file

The app uses the same key pair for both S3 and SES.

## Database setup

Create a PostgreSQL database named `socialnetwork`, or provide a `DATABASE_URL` for a different database.

Then apply the schema files in this order:

1. `sql\users.sql`
2. `sql\chat.sql`

Example on Windows with `psql` available:

```powershell
psql -d socialnetwork -f sql\users.sql
psql -d socialnetwork -f sql\chat.sql
```

`sql\users.sql` creates:

- `users`
- `reset_codes`
- `friendships`

It also seeds example user data.

`sql\chat.sql` creates:

- `chat`

## Installation

Install dependencies from the repository root:

```powershell
npm install
```

## Running the project

### 1. Build the client bundle

```powershell
npm run build
```

This writes `bundle.js` in the project root for production-style serving.

### 2. Start the server

```powershell
npm start
```

The app runs on:

- `http://localhost:8080`

### Development behavior

When `NODE_ENV` is not set to `production`, the server expects `bundle.js` requests to be served through the webpack dev middleware target at `http://localhost:8081`.

If you want the simplest local run without a separate dev bundle server, you can:

1. run `npm run build`
2. start the app with `NODE_ENV=production`

Example in PowerShell:

```powershell
$env:NODE_ENV="production"
npm start
```

## Running locally step by step

These are the most reliable local steps on Windows.

### 1. Install the prerequisites

Make sure you have:

1. Node.js 24.x
2. npm 11 or newer
3. PostgreSQL installed and running
4. Optional: `psql` on your PATH for easier database setup

### 2. Clone the repository

```powershell
git clone https://github.com/andy-9/socialnetwork.git
cd socialnetwork
```

### 3. Install npm dependencies

```powershell
npm install
```

### 4. Create the PostgreSQL database

If you use the local default from `db.js`, create a database named `socialnetwork`.

Example:

```powershell
psql -U postgres -c "CREATE DATABASE socialnetwork;"
```

If your PostgreSQL setup uses a different user, password, host, or port, set `DATABASE_URL` instead of relying on the fallback connection string.

### 5. Load the schema

Run:

```powershell
psql -d socialnetwork -f sql\users.sql
psql -d socialnetwork -f sql\chat.sql
```

This creates the tables and inserts seed users.

### 6. Configure AWS only if you need uploads and reset emails

If you want profile uploads and password reset emails to work, create `secrets.js` in the repo root:

```js
module.exports = {
    AWS_KEY: "your-access-key",
    AWS_SECRET: "your-secret-key",
};
```

If you do not configure AWS, the app can still start, but image uploads and reset emails will not work correctly end-to-end.

### 7. Build the frontend bundle

```powershell
npm run build
```

### 8. Start the backend in production mode for the simplest local run

```powershell
$env:NODE_ENV="production"
npm start
```

Then open:

```text
http://localhost:8080
```

### 9. Optional: run with a separate development bundle server

The server code treats non-production mode differently and proxies `/bundle.js` to `http://localhost:8081`.

That means if you run:

```powershell
npm start
```

without `NODE_ENV=production`, you also need something serving the webpack bundle on port `8081`. This repository does not currently expose a dedicated npm script for that workflow, so the simplest supported local path is:

1. build the bundle with `npm run build`
2. run the app with `NODE_ENV=production`

### 10. Run tests

```powershell
npm test
```

## Testing

Run the Jest test suite with:

```powershell
npm test
```

## Project structure

| Path | Responsibility |
| --- | --- |
| `index.js` | Express server, API routes, session setup, CSRF protection, and Socket.IO wiring |
| `src\` | React application, Redux logic, and UI components |
| `db.js` | PostgreSQL queries |
| `s3.js` | S3 upload middleware |
| `ses.js` | SES email sender |
| `sql\` | Database schema and seed SQL |
| `public\` | Static assets |
| `build.js` | Webpack build and middleware configuration |

## Notes

- Profile uploads write temporarily to `uploads\` before being sent to S3
- Password reset depends on a verified SES sender and valid AWS credentials
- The S3 URL currently assumes the `spicedling` bucket URL defined in `config.json`
- S3 is configured for `us-east-1`, while SES is configured for `eu-west-1`, because AWS services and verified resources can live in different regions
