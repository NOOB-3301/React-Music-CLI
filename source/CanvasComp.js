import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import Canvas from 'cli-canvas';  // Import the default export

const MyCanvas = () => {
  useEffect(() => {
    const canvas = new Canvas(40, 10);  // Create a new Canvas instance with size (width, height)
    
    // Draw a rectangle
    canvas.rect(2, 2, 20, 6, { char: '▒', color: 'green' });

    // Draw a line
    canvas.line(0, 0, 20, 8, { char: '-', color: 'blue' });

    // Draw text
    canvas.text('CLI Canvas with Ink', 5, 5, { color: 'magenta' });

    // Render the canvas directly to the terminal
    console.log(canvas.toString());  // Output canvas as string for the terminal
  }, []);

  return (
    <Box flexDirection="column">
      <Text color="cyan">Check the terminal for the canvas drawing!</Text>
    </Box>
  );
};

export default MyCanvas;
