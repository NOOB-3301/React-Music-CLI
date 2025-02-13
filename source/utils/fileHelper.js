import fs from 'fs';
import os from 'os';
import path from 'path';

const getMusicFiles = () => {
  const dirFullPath = path.join(os.homedir(), 'Music');
  try {
    return fs.readdirSync(dirFullPath);
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
};

export { getMusicFiles };
