declare module "sadaslk-dlcore" {
  export interface YouTubeDownloadResult {
    url?: string
    downloadUrl?: string
    link?: string
    result?: {
      url?: string
      downloadUrl?: string
      link?: string
      [k: string]: any
    }
    title?: string
    thumbnail?: string
    [k: string]: any
  }

  export function ytmp3(
    url: string,
    options?: Record<string, any>
  ): Promise<YouTubeDownloadResult>

  export function ytmp4(
    url: string,
    options?: Record<string, any>
  ): Promise<YouTubeDownloadResult>

  export function facebook(
    url: string,
    options?: Record<string, any>
  ): Promise<any>

  export function tiktok(
    url: string,
    options?: Record<string, any>
  ): Promise<any>

  export function instagram(
    url: string,
    options?: Record<string, any>
  ): Promise<any>

  export function twitter(
    url: string,
    options?: Record<string, any>
  ): Promise<any>
}

