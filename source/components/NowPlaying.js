import React from 'react';
import { Box, Text } from 'ink';

const NowPlaying = ({ currentlyPlaying, audioMetadata }) => (
  <Box borderStyle="classic" marginRight="10%" padding={1} width="50%" flexDirection="column">
    <Text color="cyan">Song Details:</Text>
    {audioMetadata ? (
      <>
        <Text>Title: <Text color="green">{audioMetadata?.tags?.title || 'N/A'}</Text></Text>
        <Text>Artist: <Text color="green">{audioMetadata?.tags?.artist || 'N/A'}</Text></Text>
        <Text>Album: <Text color="green">{audioMetadata?.tags?.album || 'N/A'}</Text></Text>
        <Text>Duration: <Text color="green">{Math.round(audioMetadata?.duration)} seconds</Text></Text>
        <Text>Bit Rate: <Text color="green">{audioMetadata?.bit_rate} kbps</Text></Text>
      </>
    ) : (
      <Text color="red">No Song is playing now...</Text>
    )}
  </Box>
);

export default NowPlaying;
