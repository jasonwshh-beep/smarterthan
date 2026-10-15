# Are You Smarter Than an Indian? — Railway Game Show v2

## Deploy to Railway
1. Extract ZIP, upload the contents to a GitHub repository, and connect the repository in Railway.
2. Start command: `npm start` (Node.js 18+). Railway supplies the `PORT` environment variable.
3. Generate a public domain under Railway Networking.
4. Host dashboard: `https://YOUR-DOMAIN/admin` (also `/`).
5. OBS Browser Source: `https://YOUR-DOMAIN/overlay` at 1920 × 1080.

## Features
- Opening title uses your provided graphic.
- Ten-category game board with completion counters and 125 questions (5 per category).
- Host picks any category/question and reveals answers with animations.
- Browser-generated chime effects on screen changes, answer reveals, and final challenge. OBS audio may need Browser Source audio enabled; browser autoplay rules may require a click in the overlay preview.
- Two contestant names and live score controls (+10, -10, +100).
- Dedicated dramatic final question with independent answer reveal.
- Controls sync automatically with the stream overlay (polling).
- Host-only answer preview, blank overlay, reset, previous/next.

## Customize
- Edit `questions.json` to change category names and questions. Maintain ten sets of five.
- Edit `finalQ` in `public/overlay.html` and the final host preview in `public/admin.html` to change the final question and answer.
- Optional `ADMIN_PIN` Railway environment variable protects host actions. Without it, anyone can send control requests. For stronger security, restrict dashboard/API access at the hosting layer.
- The application uses in-memory game state; a Railway restart resets scores and progress.
- No npm dependencies or local server required.

Version 3 includes 25 rounds of 5 questions each (125 total), with all rounds available on the category board.
