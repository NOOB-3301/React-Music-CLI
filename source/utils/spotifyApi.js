// source/utils/spotifyApi.js
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});

const getAccessToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    console.error('Error obtaining Spotify access token:', error);
  }
};

module.exports = { spotifyApi, getAccessToken };
