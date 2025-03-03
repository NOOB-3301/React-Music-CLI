import React, { useEffect, useState } from 'react';
import { Box, useInput } from 'ink';
import path from 'path';
import { getMusicFiles } from './utils/fileHelper.js';
import { playAudio, stopAudio } from './utils/audioPlayer.js';
import Header from './components/Header.js';
import SongList from './components/SongList.js';
import NowPlaying from './components/NowPlaying.js';

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageMap, setPageMap] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState('');
  const [audioMetadata, setAudioMetadata] = useState(null);

  useEffect(() => {
    const files = getMusicFiles();
    const chunkSize = 10;
    const tempPageMap = [];

    for (let i = 0; i < files.length; i += chunkSize) {
      tempPageMap.push(files.slice(i, i + chunkSize));
    }

    setPageMap(tempPageMap);
  }, []);

  useInput((input, key) => {
    if (key.upArrow) setSelectedIndex((prev) => Math.max(prev - 1, 0));
    if (key.downArrow) setSelectedIndex((prev) => Math.min(prev + 1, pageMap[selectedPage]?.length - 1));
    if (key.leftArrow) setSelectedPage((prev) => Math.max(prev - 1, 0));
    if (key.rightArrow) setSelectedPage((prev) => Math.min(prev + 1, pageMap.length - 1));

    if (key.return) {
      const selectedFile = pageMap[selectedPage]?.[selectedIndex];
      if (selectedFile) {
        const fullPath = path.join(require('os').homedir(), 'Music', selectedFile);
        playAudio(fullPath, setAudioMetadata, setIsPlaying, setCurrentlyPlaying);
      }
    }

    if (input === 'p') setIsPlaying((prev) => !prev);
    if (input === 'k') stopAudio();
    if (input === 'q') process.exit();
  });

  return (
    <Box flexDirection="row" height="100%" gap={20} justifyContent="space-between">
      <Box borderStyle="classic" marginRight={10} flexDirection="column" padding={1} width="75%">
        <Header />
        <SongList pageMap={pageMap} selectedPage={selectedPage} selectedIndex={selectedIndex} />
      </Box>
      <NowPlaying currentlyPlaying={currentlyPlaying} audioMetadata={audioMetadata} />
    </Box>
  );
};

export default App;
