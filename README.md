# Little Forest Name Picker

A responsive, installable student name picker with a cozy forest-spirit aesthetic.

## Features
- Individual random picker with spinning/reveal animation
- Optional no-repeat draw mode
- Group creation by group size, plus random group selection
- Add/remove/edit student names
- Local browser storage for names and picked students
- Toggleable synthesized ambient music and sound effects (no external audio files)
- Responsive phone and desktop layout
- PWA manifest and offline cache

## Starter roster
Yangan, Pagaran, Salcedo, Fortallio, Abuzo, Ledesma, Arias, Abrio, Intia, Amora, Cabalang, Labial, L., Gulapo, C., Naluan, Alaba, Miculob

## Run locally
Open `index.html` in a browser. For install/offline features, serve the files over HTTPS or localhost.

## Publish with GitHub Pages
1. Create a GitHub repository.
2. Extract this ZIP directly into the repository root. Do not put the files inside another folder.
3. Commit and push.
4. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Open the published Pages URL.

## Audio
Music and sound effects are generated in the browser with Web Audio after the user taps the controls. This avoids missing external MP3/WAV files and respects browser autoplay restrictions.

## Privacy
Student names are stored in local browser storage on the device. They are not uploaded to a server.
