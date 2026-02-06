# Hours Calculator App

A full-stack application to track working hours, built with React (Frontend) and Node.js/Express (Backend).

## Prerequisites

- Node.js installed
- MongoDB installed and running locally

## Getting Started

### 1. Setup Backend (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

### 2. Setup Frontend (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser (usually `http://localhost:5173`).

## Usage

1. Register a new account.
2. Login.
3. Click "START WORK" to begin a session.
4. Click "STOP WORK" to end it.
5. View your work history in the table below.

## Deployment (GitHub Pages)

To deploy the frontend to GitHub Pages:

1. Ensure your backend is HOSTED somewhere (e.g., Render, Heroku) because GitHub Pages is static only.
2. Update the API URL in `client/src/context/AuthContext.jsx` and `client/src/pages/Dashboard.jsx` to point to your live backend URL.
3. In `client/package.json`, update the `homepage` field if necessary.
4. Run:
   ```bash
   npm run deploy
   ```
