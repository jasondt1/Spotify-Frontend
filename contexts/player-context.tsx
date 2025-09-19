"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import type {
  AlbumResponseDto,
  ArtistResponseDto,
  TrackResponseDto,
} from "@/dto/artist"
import type { NowPlayingResponseDto } from "@/dto/now-playing"
import type { PlaylistResponseDto } from "@/dto/playlist"
import type { QueueItemResponseDto } from "@/dto/queue"
import { albumService } from "@/services/album-service"
import { artistService } from "@/services/artist-service"
import { nowPlayingService } from "@/services/now-playing-service"
import { playlistService } from "@/services/playlist-service"
import { queueService } from "@/services/queue-service"

import { useUser } from "./user-context"

type PlayerContextType = {
  queue: QueueItemResponseDto[]
  fetchQueue: () => Promise<void>
  nowPlaying: NowPlayingResponseDto | null
  fetchNowPlaying: () => Promise<void>
  setNowPlaying: (
    trackId: string,
    source?: { artistId?: string; albumId?: string; playlistId?: string }
  ) => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  togglePlay: () => void
  seek: (sec: number) => void
  isPlaying: boolean
  progress: number
  shuffle: boolean
  setShuffle: (val: boolean) => void
  repeat: boolean
  setRepeat: (val: boolean) => void
  volume: number
  setVolume: (val: number) => void
  isMuted: boolean
  setMuted: (val: boolean) => void
  localQueue: TrackResponseDto[]
  setLocalQueue: React.Dispatch<React.SetStateAction<TrackResponseDto[]>>
  localQueueName: string | null
  setLocalQueueName: React.Dispatch<React.SetStateAction<string | null>>
  addToQueue: (track: TrackResponseDto) => void
  removeFromQueue: (trackId: string) => void
  reorderQueue: (fromIndex: number, toIndex: number) => void
  clearQueue: () => void
  isShuffledFor: (id?: string | null) => boolean
  setShuffleFor: (id: string, val: boolean) => void
  toggleShuffleForCurrent: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function PlayerProvider({
  children,
  initialQueue,
  initialNowPlaying,
}: {
  children: React.ReactNode
  initialQueue?: QueueItemResponseDto[]
  initialNowPlaying?: NowPlayingResponseDto | null
}) {
  const [queue, setQueue] = useState<QueueItemResponseDto[]>(initialQueue ?? [])
  const [nowPlaying, setNowPlayingState] = useState<NowPlayingResponseDto | null>(
    initialNowPlaying ?? null
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [localQueue, setLocalQueue] = useState<TrackResponseDto[]>([])
  const [localQueueName, setLocalQueueName] = useState<string | null>(null)
  const [originalQueue, setOriginalQueue] = useState<TrackResponseDto[]>([])
  const [playedTracks, setPlayedTracks] = useState<TrackResponseDto[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1)
  const [shuffledSources, setShuffledSources] = useState<string[]>([])

  const { fetchLibraries } = useUser()

  useEffect(() => {
    const savedShuffle = localStorage.getItem("player_shuffle")
    const savedRepeat = localStorage.getItem("player_repeat")
    const savedVolume = localStorage.getItem("player_volume")
    const savedLocalQueue = localStorage.getItem("player_local_queue")
    const savedLocalQueueName = localStorage.getItem("player_local_queue_name")
    const savedOriginalQueue = localStorage.getItem("player_original_queue")
    const savedPlayedTracks = localStorage.getItem("player_played_tracks")
    const savedCurrentIndex = localStorage.getItem("player_current_index")
    const savedShuffleSources = localStorage.getItem("player_shuffle_sources")

    if (savedShuffle) setShuffle(savedShuffle === "true")
    if (savedRepeat) setRepeat(savedRepeat === "true")
    if (savedVolume) setVolume(parseFloat(savedVolume))
    if (savedLocalQueue) setLocalQueue(JSON.parse(savedLocalQueue))
    if (savedLocalQueueName) setLocalQueueName(savedLocalQueueName)
    if (savedOriginalQueue) setOriginalQueue(JSON.parse(savedOriginalQueue))
    if (savedPlayedTracks) setPlayedTracks(JSON.parse(savedPlayedTracks))
    if (savedCurrentIndex) setCurrentTrackIndex(parseInt(savedCurrentIndex))
    if (savedShuffleSources) setShuffledSources(JSON.parse(savedShuffleSources))
  }, [])

  useEffect(() => {
    localStorage.setItem("player_shuffle", String(shuffle))
  }, [shuffle])

  useEffect(() => {
    localStorage.setItem("player_repeat", String(repeat))
  }, [repeat])

  useEffect(() => {
    localStorage.setItem("player_volume", String(volume))
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    localStorage.setItem("player_local_queue", JSON.stringify(localQueue))
  }, [localQueue])

  useEffect(() => {
    if (localQueueName) {
      localStorage.setItem("player_local_queue_name", localQueueName)
    }
  }, [localQueueName])

  useEffect(() => {
    localStorage.setItem(
      "player_shuffle_sources",
      JSON.stringify(shuffledSources)
    )
  }, [shuffledSources])

  const isShuffledFor = (id?: string | null) => {
    if (!id) return false
    return shuffledSources.includes(id)
  }

  const setShuffleFor = (id: string, val: boolean) => {
    setShuffledSources((prev) => {
      const set = new Set(prev)
      if (val) set.add(id)
      else set.delete(id)
      return Array.from(set)
    })
    const currentSource =
      nowPlaying?.playlistId ||
      nowPlaying?.albumId ||
      nowPlaying?.artistId ||
      null
    if (currentSource === id) setShuffle(val)
  }

  const toggleShuffleForCurrent = () => {
    const currentSource =
      nowPlaying?.playlistId ||
      nowPlaying?.albumId ||
      nowPlaying?.artistId ||
      null
    if (!currentSource) {
      setShuffle(!shuffle)
      return
    }
    const nextVal = !isShuffledFor(currentSource)
    setShuffleFor(currentSource, nextVal)
  }

  useEffect(() => {
    localStorage.setItem("player_original_queue", JSON.stringify(originalQueue))
  }, [originalQueue])

  useEffect(() => {
    localStorage.setItem("player_played_tracks", JSON.stringify(playedTracks))
  }, [playedTracks])

  useEffect(() => {
    localStorage.setItem("player_current_index", String(currentTrackIndex))
  }, [currentTrackIndex])

  useEffect(() => {
    if (originalQueue.length === 0) return

    if (shuffle) {
      const currentTrack = nowPlaying?.track
      const remainingTracks = originalQueue.filter(
        (track) =>
          track.id !== currentTrack?.id &&
          !playedTracks.some((played) => played.id === track.id)
      )
      const shuffledRemaining = shuffleArray(remainingTracks)
      setLocalQueue(shuffledRemaining)
    } else {
      const currentTrack = nowPlaying?.track
      if (currentTrack) {
        const currentIndexInOriginal = originalQueue.findIndex(
          (track) => track.id === currentTrack.id
        )
        const remainingInOrder = originalQueue.slice(currentIndexInOriginal + 1)
        setLocalQueue(remainingInOrder)
      }
    }
  }, [shuffle, originalQueue, playedTracks, nowPlaying?.track])

  const fetchQueue = async () => {
    try {
      const res = await queueService.fetch()
      setQueue(res)
    } catch (err) {
      console.error("Failed to load queue", err)
    }
  }

  const fetchNowPlaying = async () => {
    try {
      const res = await nowPlayingService.fetch()
      setNowPlayingState(res)
    } catch (err) {
      console.error("Failed to load now playing", err)
    }
  }

  const setNowPlaying = async (
    trackId: string,
    source?: { artistId?: string; albumId?: string; playlistId?: string }
  ) => {
    try {
      const hasSource =
        source &&
        (source.artistId !== undefined ||
          source.albumId !== undefined ||
          source.playlistId !== undefined)

      const res = await nowPlayingService.set(trackId, hasSource ? source : {})

      let tracks: TrackResponseDto[] = []
      let queueName = ""

      const sameSource =
        nowPlaying?.artistId === source?.artistId ||
        nowPlaying?.albumId === source?.albumId ||
        nowPlaying?.playlistId === source?.playlistId

      if (!sameSource || originalQueue.length === 0) {
        if (res.playlistId) {
          const playlist: PlaylistResponseDto = await playlistService.getById(
            res.playlistId
          )
          tracks = playlist.tracks
          queueName = playlist.name
        } else if (res.albumId) {
          const album: AlbumResponseDto = await albumService.getById(
            res.albumId
          )
          tracks = album.tracks
          queueName = album.title
        } else if (res.artistId) {
          const artist: ArtistResponseDto = await artistService.getById(
            res.artistId
          )
          tracks = artist.tracks!
          queueName = artist.name
        }

        const currentTrackIndex = tracks.findIndex((t) => t.id === res.track.id)
        const remainingTracks = tracks.slice(currentTrackIndex + 1)

        setOriginalQueue(tracks)
        setCurrentTrackIndex(currentTrackIndex)
        setPlayedTracks([])

        if (shuffle) {
          setLocalQueue(shuffleArray(remainingTracks))
        } else {
          setLocalQueue(remainingTracks)
        }

        setLocalQueueName(queueName)
      } else {
        if (nowPlaying?.track && nowPlaying.track.id !== trackId) {
          setPlayedTracks((prev) => [nowPlaying.track, ...prev.slice(0, 49)])

          const newIndex = originalQueue.findIndex(
            (track) => track.id === trackId
          )
          setCurrentTrackIndex(newIndex)

          setLocalQueue((prev) => prev.filter((track) => track.id !== trackId))
        }
      }

      setNowPlayingState(res)
      await fetchLibraries()

      if (audioRef.current) {
        setProgress(0)
        audioRef.current.src = res.track.audio
        await audioRef.current.play()
        setIsPlaying(true)
      }
      const currentSource =
        res.playlistId || res.albumId || res.artistId || null
      if (currentSource) {
        setShuffle(isShuffledFor(currentSource))
      }
    } catch (err) {
      console.error("Failed to set now playing", err)
    }
  }

  const nextTrack = async () => {
    try {
      const next = await queueService.popNext()
      if (next) {
        await fetchQueue()
        await setNowPlaying(next.id, {
          artistId: nowPlaying?.artistId,
          albumId: nowPlaying?.albumId,
          playlistId: nowPlaying?.playlistId,
        })
        return
      }
    } catch (err) {
      console.warn("No server queue available")
    }

    if (localQueue.length > 0) {
      const nextTrack = localQueue[0]
      await setNowPlaying(nextTrack.id, {
        artistId: nowPlaying?.artistId,
        albumId: nowPlaying?.albumId,
        playlistId: nowPlaying?.playlistId,
      })
      return
    }

    if (repeat && originalQueue.length > 0) {
      const firstTrack = originalQueue[0]
      await setNowPlaying(firstTrack.id, {
        artistId: nowPlaying?.artistId,
        albumId: nowPlaying?.albumId,
        playlistId: nowPlaying?.playlistId,
      })

      const remainingTracks = originalQueue.slice(1)
      if (shuffle) {
        setLocalQueue(shuffleArray(remainingTracks))
      } else {
        setLocalQueue(remainingTracks)
      }
      setPlayedTracks([])
      setCurrentTrackIndex(0)
      return
    }

    setIsPlaying(false)
  }

  const previousTrack = async () => {
    const audio = audioRef.current

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      if (!isPlaying) {
        audio.play()
        setIsPlaying(true)
      }
      return
    }

    if (playedTracks.length > 0) {
      const previousTrack = playedTracks[0]
      const currentTrack = nowPlaying?.track

      if (currentTrack) {
        setLocalQueue((prev) => [currentTrack, ...prev])
      }

      setPlayedTracks((prev) => prev.slice(1))

      const newIndex = originalQueue.findIndex(
        (track) => track.id === previousTrack.id
      )
      setCurrentTrackIndex(newIndex)

      try {
        const res = await nowPlayingService.set(previousTrack.id, {
          artistId: nowPlaying?.artistId,
          albumId: nowPlaying?.albumId,
          playlistId: nowPlaying?.playlistId,
        })

        setNowPlayingState(res)

        if (audioRef.current) {
          setProgress(0)
          audioRef.current.src = res.track.audio
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (err) {
        console.error("Failed to set previous track", err)
      }
      return
    }

    if (nowPlaying?.track?.id) {
      if (audio) {
        audio.currentTime = 0
        if (!isPlaying) {
          audio.play()
          setIsPlaying(true)
        }
      }
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (!audioRef.current.src && nowPlaying?.track?.audio) {
      audioRef.current.src = nowPlaying.track.audio
    }
    if (!audioRef.current.src) {
      console.warn("No track loaded")
      return
    }
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const seek = (sec: number) => {
    if (audioRef.current) audioRef.current.currentTime = sec
  }

  const addToQueue = (track: TrackResponseDto) => {
    setLocalQueue((prev) => [...prev, track])
  }

  const removeFromQueue = (trackId: string) => {
    setLocalQueue((prev) => prev.filter((track) => track.id !== trackId))
  }

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    setLocalQueue((prev) => {
      const newQueue = [...prev]
      const [movedTrack] = newQueue.splice(fromIndex, 1)
      newQueue.splice(toIndex, 0, movedTrack)
      return newQueue
    })
  }

  const clearQueue = () => {
    setLocalQueue([])
    setOriginalQueue([])
    setPlayedTracks([])
    setCurrentTrackIndex(-1)
    setLocalQueueName(null)
  }

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    const audio = audioRef.current

    const updateProgress = () => {
      if (!isNaN(audio.currentTime)) setProgress(audio.currentTime)
    }

    const onEnded = () => {
      if (repeat && localQueue.length === 0 && originalQueue.length === 0) {
        audio.currentTime = 0
        audio.play()
      } else {
        nextTrack()
      }
    }

    const onError = () => {
      console.error("Audio playback error")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
    }
  }, [repeat, nextTrack])

  useEffect(() => {
    if (!initialQueue) fetchQueue()
    if (!initialNowPlaying) fetchNowPlaying()
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        queue,
        fetchQueue,
        nowPlaying,
        fetchNowPlaying,
        setNowPlaying,
        nextTrack,
        previousTrack,
        togglePlay,
        seek,
        isPlaying,
        progress,
        shuffle,
        setShuffle,
        repeat,
        setRepeat,
        volume,
        setVolume,
        isMuted,
        setMuted,
        localQueue,
        setLocalQueue,
        localQueueName,
        setLocalQueueName,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        isShuffledFor,
        setShuffleFor,
        toggleShuffleForCurrent,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider")
  return ctx
}
