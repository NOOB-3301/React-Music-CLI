// source/components/SpotifyMusicPlayer.js
const React = require('react');
const { useState, useEffect } = require('react');
const { Text, Box, TextInput } = require('ink');
const { spotifyApi, getAccessToken } = require('../utils/spotifyApi');
const play = require('audio-play');
const load = require('audio-loader');

const SpotifyMusicPlayer = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    getAccessToken();
  }, []);

  const searchTracks = async (searchQuery) => {
    try {
      const data = await spotifyApi.searchTracks(searchQuery);
      setTracks(data.body.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const playPreview = async (previewUrl) => {
    if (!previewUrl) {
      console.log('No preview available for this track.');
      return;
    }
    try {
      const audio = await load(previewUrl);
      play(audio);
    } catch (error) {
      console.error('Error playing preview:', error);
    }
  };

  return (
    <Box flexDirection="column">
      <Text>Search Spotify:</Text>
      <TextInput
        value={query}
        onChange={setQuery}
        onSubmit={() => searchTracks(query)}
      />
      {tracks.map((track, index) => (
        <Box
          key={track.id}
          borderColor={selectedTrack === index ? 'green' : 'white'}
          borderStyle="round"
          padding={1}
          marginTop={1}
          onClick={() => {
            setSelectedTrack(index);
            playPreview(track.preview_url);
          }}
        >
          <Text>
            {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

module.exports = SpotifyMusicPlayer;
