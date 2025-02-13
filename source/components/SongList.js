import React from 'react';
import { Box, Text } from 'ink';

const SongList = ({ pageMap, selectedPage, selectedIndex }) => (
  <Box flexDirection="column">
    <Text color="yellow">Your Music List:</Text>
    {pageMap[selectedPage]?.map((file, index) => (
      <Text key={index} backgroundColor={index === selectedIndex ? 'blue' : undefined} color={index === selectedIndex ? 'white' : 'cyan'}>
        {index === selectedIndex ? `> ${file}` : `  ${file}`}
      </Text>
    ))}
    <Text color="magenta">Page {selectedPage + 1} of {pageMap.length}</Text>
  </Box>
);

export default SongList;
