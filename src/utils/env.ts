import SpotifyWebApi from 'spotify-web-api-js'

export const OAUTH_TOKEN = import.meta.env.VITE_OAUTH_TOKEN ?? ''

export const spotifyApi = new SpotifyWebApi()
spotifyApi.setAccessToken(OAUTH_TOKEN)
