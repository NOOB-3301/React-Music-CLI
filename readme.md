# Music CLI

Music CLI is a terminal-based music player built with React, Ink, and Node.js. It allows you to browse and play audio files directly from the command line. Additional features include metadata display, playback controls, and playlist shuffling.

## Features

- **Browse Local Music**: Lists audio files from the user's `Music` directory.
- **Playback Controls**: 
  - Play/Pause (`p`)
  - Stop (`k`)
  - Seek Forward/Backward (`f`/`b`)
  - Shuffle Playlist (`s`)
- **Metadata Display**: Displays song details such as title, artist, album, duration, and bit rate.
- **Keyboard Navigation**:
  - Navigate up/down: `↑` / `↓`
  - Switch pages: `←` / `→`
  - Select and play: `Enter`
  - Exit: `q`

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install the pacakges using `npm i`
3. link your cli tool using `npm link` or `sudo npm link`
4. For changes :
	```
   - npm run build
   - chmod +x dist/*
   - musicCLI
	```
