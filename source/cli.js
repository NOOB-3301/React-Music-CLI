#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
// import { searchSongs, getSongDetails } from './utils/api.js';
import { searchSongs } from './utils/api.js';
import readline from 'readline';

const cli = meow(
	`
		Usage
		  $ musicCLI

		Options
			--name  Your name

		Examples
		  $ musicCLI --name=Jane
		  Hello, Jane
	`,
	{
		importMeta: import.meta,
	},
);

// CLI Input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
  });
  
  rl.question("🎵 Enter song name to search: ", async (query) => {
	if (!query.trim()) {
	  console.log("❌ Please enter a valid song name.");
	  rl.close();
	  return;
	}
  
	console.log(`🔍 Searching for "${query}"...\n`);
  
	const songs = await searchSongs(query);
  
	if (songs.length > 0) {
	  console.log("🎶 Search Results:");
	  songs.forEach((song, index) => {
		console.log(`${index + 1}. ${song.title} - ${song.artist}`);
		console.log(`   🔗 Play: ${song.url}\n`);
	  });
	} else {
	  console.log("❌ No songs found.");
	}
  
	rl.close();
  });
  
render(<App name={cli.flags.name} />);
