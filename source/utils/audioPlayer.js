import { useEffect, useRef } from "react";

const AudioPlayer = ({ songs, currentSongIndex, setCurrentSongIndex }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  const playSong = (songUrl) => {
    if (audioRef.current) {
      audioRef.current.src = songUrl;
      audioRef.current.load(); 
      audioRef.current.play().catch(err => console.error("Auto-play blocked", err));
    }
  };

 
  const playNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    playSong(songs[nextIndex].url);
  };

  useEffect(() => {
    if (songs[currentSongIndex]) {
      playSong(songs[currentSongIndex].url);
    }
  }, [currentSongIndex]);

  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", playNextSong);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("ended", playNextSong);
      }
    };
  }, [currentSongIndex]);

  return (
    <audio ref={audioRef} controls>
      <source src={songs[currentSongIndex]?.url} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
