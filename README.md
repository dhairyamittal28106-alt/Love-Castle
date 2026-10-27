# Love Castle

Love Castle is a React web app for couples, with a relationship dashboard, private chat, shared games, secret letters, and account settings. Firebase provides authentication and Firestore-backed chat data; the interface uses React, Vite, Tailwind CSS, and Framer Motion.

## Configure Firebase

Create a Firebase project and provide the `VITE_FIREBASE_*` settings used by `src/lib/firebase.ts` in a local `.env` file. Enable the authentication methods and Firestore services used by the app. Keep private configuration and admin credentials out of source control.

## Run locally

Use Node.js and npm:

    npm install
    npm run dev

Vite prints the local development URL. Other useful commands are `npm run build`, `npm run lint`, and `npm run preview`.

## Source layout

- `src/pages/`: landing, dashboard, chat, games, letters, and settings
- `src/context/AuthContext.tsx`: user session state
- `src/lib/firebase.ts`: Firebase initialization
- `public/`: static files
