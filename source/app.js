import React, { useEffect, useState } from 'react';
import { Box, Text, useInput, Newline } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Audic from 'audic';
import Ffmpeg from 'fluent-ffmpeg';

const getAudioMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(`Error getting metadata: ${err}`);
      }
      resolve(metadata.format);
    });
  });
};

const SEEK_STEP_SECONDS = 120;
let player = null;
let splayer = null

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageMap, setPageMap] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState('');
  const [audioMetadata, setAudioMetadata] = useState(null);
  const [playlistchanged, setPlaylistchanged] = useState(false)
  const [shuffeledplaylist , setshuffeledplaylist] = useState([])
  const [index, setIndex] = useState(0)

  const [currTime, setcurrTime] = useState(0)

  setInterval(() => {
    if (player) {
      splayer?.destroy()
      setcurrTime(player?.currentTime)
    }
    if (splayer) {
      player?.destroy()
      setcurrTime(splayer?.currentTime)
    }
  }, 1000);
  

  const stopAudio = () => {
    if (player) {
      player.destroy();
      setIsPlaying(false);
      setCurrentlyPlaying('');
      setAudioMetadata(null);
    }

    if (splayer) {
      splayer.destroy()
      setIsPlaying(false);
      setCurrentlyPlaying('');
      setAudioMetadata(null);
    }
  };

  const pauseAudio = () => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }

    if (splayer?.playing) {
      splayer.pause()
      setIsPlaying(false)
    }else{
      splayer.paly()
      setIsPlaying(true)
    }
  };

  const seekAudio = (seconds) => {
    if (player && isPlaying) {
      const newTime = Math.max(0, player.currentTime + seconds);
      player.currentTime = newTime;
    }

    if (splayer && isPlaying) {
      const newTime = Math.max(0, splayer.currentTime + seconds);
      splayer.currentTime = newTime;
    }
    
  };

  const playAudio = async (audio) => {
    // if (splayer?.playing) {
      // splayer.destroy()
      stopAudio()
    // }
    const dirFullPath = path.join(os.homedir(), 'Music');
    const fullPath = path.join(dirFullPath, audio);

    try {
      if (player) stopAudio();

      const metadata = await getAudioMetadata(fullPath);
      setAudioMetadata(metadata);

      player = new Audic(fullPath);
      await player.play();
      setIsPlaying(true);
      setCurrentlyPlaying(audio);
    } catch (error) {
      console.error("Error playing audio or fetching metadata:", error);
    }
  };

  useEffect(() => {
    const fullPath = path.join(os.homedir(), 'Music');
    try {
      const files = fs.readdirSync(fullPath);
      const chunkSize = 10;
      const tempPageMap = [];

      for (let index = 0; index < files.length; index += chunkSize) {
        tempPageMap.push(files.slice(index, index + chunkSize));
      }

      setPageMap(tempPageMap);
    } catch (err) {
      console.error("Error reading directory:", err);
    }
  }, []);
  
  // let suffeledPlaylist = [];
  useEffect(() => {
    // console.log('useffecthit ')
    // console.log(shuffeledplaylist)
    if (shuffeledplaylist.length > 0) {
      if (player?.playing) {
        player.destroy()
      }
      if (splayer?.playing) {
        splayer.destroy()
      }
      console.log("this is useeffect",shuffeledplaylist)
      async function shhuffledplayer() {
        if (splayer?.playing) {
          splayer.destroy
        }
        splayer = new Audic(shuffeledplaylist[index])
        await splayer.play()
        const metadata = await getAudioMetadata(shuffeledplaylist[index])
        setAudioMetadata(metadata)
        setIsPlaying(true);
        setCurrentlyPlaying(shuffeledplaylist[index]);
        splayer.addEventListener('ended', () => {
          setIndex(prev => prev+1)
          // console.log("index updated")
          if (index == shuffeledplaylist.length-1) {
            console.log(index)
            setshuffeledplaylist([])
            splayer.destroy()
          }
        });
      }
      shhuffledplayer()
      // setshuffeledplaylist([])
    }
  }, [playlistchanged,index])
  
  useInput((input, key) => {
    if (key.upArrow) setSelectedIndex((prev) => Math.max(prev - 1, 0));
    if (key.downArrow) setSelectedIndex((prev) => Math.min(prev + 1, pageMap[selectedPage]?.length - 1));
    if (key.leftArrow) setSelectedPage((prev) => Math.max(prev - 1, 0));
    if (key.rightArrow) setSelectedPage((prev) => Math.min(prev + 1, pageMap.length - 1));

    if (key.return) {
      splayer?.destroy()
      player?.destroy()
      const selectedFile = pageMap[selectedPage]?.[selectedIndex];
      if (selectedFile) playAudio(selectedFile);
    }

    if (input === 'p') pauseAudio();
    if (input === 'k') stopAudio();
    if (input === 'f') seekAudio(SEEK_STEP_SECONDS);
    if (input === 'b') seekAudio(-SEEK_STEP_SECONDS);
    if (input === 'q') process.exit();
    if (input === 's') {
      
      const fullPath = path.join(os.homedir(), 'Music');
      const files = fs.readdirSync(fullPath);
      const totalCount = files.length;
      
      if (totalCount === 0) {
        console.error("No music files found in the directory.");
        return;
      }
      
      let count = 0;
      let localPLaylist =[]
      do {
        let randIndex = Math.floor(Math.random() * totalCount);
        let fileToPlay = files[randIndex];
        let filePlayPath = path.join(fullPath, fileToPlay);
    
        if (!localPLaylist.includes(filePlayPath)) {
          localPLaylist.push(filePlayPath)
          count++;
        }
      } while (count !== totalCount);
    
      // console.log("Shuffled Playlist:", localPLaylist);
      setshuffeledplaylist([...shuffeledplaylist,...localPLaylist])
      setPlaylistchanged(prev => !prev)
      

    }
  });

  return (
    <Box flexDirection="row" height="100%" gap={20} justifyContent="space-between">
      {/* Left Panel */}
      <Box borderStyle="classic" marginRight={10} flexDirection="column" padding={1}   width="75%">
        <Box >
          <Gradient name="atlas">
            <BigText text="MUSIC CLI"  />
          </Gradient>
{/* borderStyle="round" borderColor="green" padding="100" name='vice' */}
        </Box>
        <Box  justifyContent='center' alignItems='center'>
          <Gradient borderStyle="round" name='vice'  >Play Your Favourite Music via CLI.</Gradient>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text color="yellow">Your Music List:</Text>
          {pageMap[selectedPage]?.map((file, index) => (
            <Text
              key={index}
              backgroundColor={index === selectedIndex ? 'blue' : undefined}
              color={index === selectedIndex ? 'white' : 'cyan'}
            >
              {index === selectedIndex ? `> ${file}` : `  ${file}`}
            </Text>
          ))}
          <Text color="magenta">Page {selectedPage + 1} of {pageMap.length}</Text>
        </Box>

        {isPlaying && (
          <Box marginTop={1}>
            <Text color="yellow">Currently Playing: <Text color="white">{currentlyPlaying}</Text></Text>
          </Box>
        )}
        <Box>
          <Text color="yellow">Time Remaining:</Text>
          {/* splayer?.duration ? splayer?.duration : "_" */}
          <Text>{` ${currTime ? currTime : " _" }seconds : ${splayer ? splayer?.duration ? splayer?.duration : "_" : player?.duration ? player?.duration : "_"}seconds`} </Text>
        </Box>
      </Box>

      {/* Right Panel */}
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
    </Box>
  );
};

export default App;
