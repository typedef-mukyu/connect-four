# Connect 4

## Introduction

This package contains a Node.js/Express-based web server that hosts an online
multiplayer Connect 4 game; users can connect to the server, either starting a
new game (where they are given a 6-digit game ID and go first as red), or joining
a game with a game ID given to then (going second as yellow). The first player to
get at least 4 chips in a row (either horizontally, vertically, or diagonally)
wins the game; filling the board without either player winning results in a draw.

## Installation and usage

To install, run:

```bash
npm install
```

to download and install the necessary packages.

Then run:

```bash
npm start
```

to start the server. By default, this listens on port 3000, but the PORT
environment variable can be set to change this. Note that in Linux and macOS,
using a restricted port (< 1024) requires the package to be run as root.

## Gameplay

Once the server is started, players can navigate to the server's address (see
above for port configuration) and start a new game by clicking New Game. The
player will then be given a 6-digit Game ID that they can share with their
opponent; they can then select Join Game and enter this ID to play.

The player starting the game goes first and plays red tokens, while the player
joining goes second and plays yellow tokens. On a player's turn, they can play
a token in any column with available space (i.e., with less than 6 tokens).
A player wins the game by lining up four or more of their tokens in a row, either
horizontally, vertically, or diagonally. If all columns have been filled without
a player winning, the game ends in a draw.

Games are saved to the server's memory and disk automatically; games completed
or left abandoned for two weeks will be deleted to save memory and disk space.