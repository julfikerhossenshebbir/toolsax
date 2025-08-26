# Toolsax

A Next.js application to discover and explore various tools.

---

## How to Deploy to Vercel via GitHub

Follow these step-by-step instructions to deploy this application to Vercel.

### Step 1: Push Your Code to a GitHub Repository

First, make sure all your code is in a GitHub repository.

1.  **Create a new repository on GitHub.** You can do this from the GitHub website.
2.  **Initialize Git and push your code.** If you haven't already, open your terminal in the project directory and run the following commands:

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    git push -u origin main
    ```

    *Remember to replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details.*

### Step 2: Create a Vercel Project

Next, connect your GitHub repository to Vercel.

1.  Log in to your **Vercel dashboard**.
2.  Click the **Add New...** button and select **Project**.
3.  Under **Import Git Repository**, find your GitHub repository and click **Import**.
4.  Vercel will automatically detect that it's a Next.js project and configure the build settings for you. You typically don't need to change anything here.

### Step 3: Set Environment Variables

This is a critical step to connect your application to external services like Firebase, Gemini, and Telegram.

1.  In the project setup screen, expand the **Environment Variables** section.
2.  Copy the contents of the `.env.example` file in this repository.
3.  Click **Add** for each variable, paste the name and its corresponding value.

    | Variable Name                          | Description                                         | Example Value                          |
    | -------------------------------------- | --------------------------------------------------- | -------------------------------------- |
    | `NEXT_PUBLIC_FIREBASE_API_KEY`         | Your Firebase API Key                               | `AIzaSy...`                            |
    | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`     | Your Firebase Auth Domain                           | `your-project.firebaseapp.com`         |
    | `NEXT_PUBLIC_FIREBASE_DATABASE_URL`    | Your Firebase Database URL                          | `https://your-project.firebaseio.com`   |
    | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`      | Your Firebase Project ID                            | `your-project-id`                      |
    | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  | Your Firebase Storage Bucket                        | `your-project.appspot.com`             |
    | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID                 | `1234567890`                           |
    | `NEXT_PUBLIC_FIREBASE_APP_ID`          | Your Firebase App ID                                | `1:12345...`                           |
    | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`  | Your Firebase Measurement ID                        | `G-ABC...`                             |
    | `GEMINI_API_KEY`                       | Google AI Gemini API Key for AI features            | `AIza...`                              |
    | `TELEGRAM_BOT_TOKEN`                   | Your Telegram Bot Token for bug reports             | `12345:ABC...`                         |
    | `TELEGRAM_CHAT_ID`                     | Your Telegram Chat ID for receiving reports         | `-100...`                              |
    | `IMGBB_API_KEY`                        | Your ImgBB API key for image uploads                | `a1b2c3...`                            |

    **Note:** For local development, create a `.env.local` file in the root of your project and add these variables there.

### Step 4: Deploy

1.  Once all environment variables are added, click the **Deploy** button.
2.  Vercel will now start building and deploying your application. You can watch the progress in the build logs.
3.  When it's finished, you'll get a unique `.vercel.app` URL where your live application can be viewed.

Congratulations, your Toolsax application is now live on Vercel!
