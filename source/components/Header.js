import React from 'react';
import { Box } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

const Header = () => (
  <Box>
    <Gradient name="atlas">
      <BigText text="MUSIC CLI" />
    </Gradient>
  </Box>
);

export default Header;
