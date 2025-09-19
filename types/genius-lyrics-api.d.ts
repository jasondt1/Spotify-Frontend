declare module "genius-lyrics-api" {
  export interface Options {
    apiKey: string
    title: string
    artist: string
    optimizeQuery?: boolean
  }

  export interface Song {
    id: string
    url: string
    title: string
    albumArt: string
    lyrics: string
  }

  export function getLyrics(options: Options): Promise<string>
  export function getSong(options: Options): Promise<Song>
}
