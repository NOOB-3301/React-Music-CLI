import Audic from 'audic';
import Ffmpeg from 'fluent-ffmpeg';
import nodeNotifier from 'node-notifier';

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

let player = null;
let splayer = null;

const stopAudio = () => {
  if (player) {
    player.destroy();
  }
  if (splayer) {
    splayer.destroy();
  }
};

const playAudio = async (filePath, setMetadata, setPlaying, setCurrentlyPlaying) => {
  try {
    stopAudio();
    const metadata = await getAudioMetadata(filePath);
    setMetadata(metadata);

    player = new Audic(filePath);
    await player.play();
    setPlaying(true);
    setCurrentlyPlaying(filePath);
    nodeNotifier.notify(`Started Playing ${filePath}`);
  } catch (error) {
    console.error("Error playing audio or fetching metadata:", error);
  }
};

export { playAudio, stopAudio, getAudioMetadata };
