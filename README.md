# GameDev Hub — Complete Frontend Demo

## Features
- Landing page with responsive design, game cards, search and category filters
- Signup and login pages with client-side validation
- Browser-local demo accounts (no backend)
- Protected dashboard and profile page
- Saved games collection
- Create, list, and delete game projects
- Developer directory and creator resources
- Responsive desktop/mobile navigation

## Run
1. Extract the ZIP.
2. Open the `gamedev-hub-complete` folder in VS Code.
3. Open a terminal in that folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the URL printed by Vite, usually `http://localhost:5173`.

## Important security note
This is a frontend-only educational demo. Accounts and project data are stored in browser localStorage; passwords are not securely protected and there is no server-side authentication. Do not use real or reused passwords. For production, use a backend/auth provider, server-side password hashing, and secure sessions.

## If you already have an old project running
Stop the old server with `Ctrl+C`, extract this project into a new folder, and run commands from the new folder. Don't mix the old and new `src` files.
