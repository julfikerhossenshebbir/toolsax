# Toolsax

A Next.js application to discover and explore various tools.

---

## How to Deploy to Cloudflare Pages via GitHub

Follow these step-by-step instructions to deploy this application.

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

### Step 2: Create a Cloudflare Pages Project

Next, connect your GitHub repository to Cloudflare.

1.  Log in to your **Cloudflare dashboard**.
2.  Navigate to **Workers & Pages** > **Create application**.
3.  Select the **Pages** tab and click on **Connect to Git**.
4.  Choose the GitHub repository you just created and click **Begin setup**.

### Step 3: Configure Build Settings

Cloudflare will ask for build settings. It should automatically detect Next.js, but ensure the settings are correct:

-   **Project name:** Choose a name for your project.
-   **Production branch:** `main`
-   **Framework preset:** `Next.js`
-   **Build command:** `npm run build`
-   **Build output directory:** `.next`

Leave the **Root Directory** blank unless your project is in a subfolder.

### Step 4: Set Environment Variables

This is a critical step to connect your application to Firebase.

1.  In the same setup screen, scroll down to **Environment variables (advanced)**.
2.  Add the following variables with the exact names and your corresponding Firebase project values. You can find these in your `src/lib/firebase.ts` file or your Firebase project console.

    | Variable Name              | Value                                  |
    | -------------------------- | -------------------------------------- |
    | `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API Key                  |
    | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain              |
    | `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Your Firebase Database URL             |
    | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID               |
    | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Your Firebase Storage Bucket           |
    | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| Your Firebase Messaging Sender ID    |
    | `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID                   |
    | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your Firebase Measurement ID         |

3.  Click the **+ Add variable** button for each one. Make sure there are no typos.

### Step 5: Save and Deploy

1.  Once all environment variables are added, click the **Save and Deploy** button.
2.  Cloudflare will now start building and deploying your application. You can watch the progress in the deployment logs.
3.  When it's finished, you'll get a unique `.pages.dev` URL where your live application can be viewed.

Congratulations, your Toolsax application is now live on Cloudflare Pages!
