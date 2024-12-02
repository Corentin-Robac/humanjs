# Express Backend with Static Frontend

This project provides a simple Express.js backend with a static frontend. It includes a reusable menu component on two pages and an example API endpoint.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A GitHub account.

## Steps

### 1. Clone the repository

```bash
git clone https://github.com/Corentin-Robac/my-express-backend.git
```

### 2. Install dependencies
Navigate to the backend folder and install Node.js dependencies:

```bash
cd my-express-backend/backend
npm run install-dependencies
```

### 3. Configure GitHub credentials
Edit the .env file with your GitHub credentials:

```bash
PORT=3000
GITHUB_USERNAME=your-github-username
GITHUB_REPO=your-repo-name
```

### 3.5. Add .env file to .gitignore

```bash
.env
```

### 4. Set up your Git repository
To remove the current Git origin and link your own GitHub repository using the information in the .env file, run the following:

```bash
npm run setup-repo
```

### 4.5. Push to Git repo
Create your repo on Github with same credentials from .env file then run:

```bash
cd ..
git push -u origin main
```
Take care than head branch is "main" instead of "master"

### 5. Start the server

```bash
npm run start-server
```

### 6. Access the application
You can now access the application at:

http://localhost:3000

