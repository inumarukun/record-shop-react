export type Record = {
  id: number
  title: string
  artist: string
  genre: string
  style: string
  release_year: number
  created_at: Date
  updated_at: Date
}
export type CsrfToken = {
  csrf_token: string
}
export type Credential = {
  email: string
  password: string
}
export type TrackInfo = {
  trackNumber: number
  trackTitle: string
}
export type Detail = {
  recordTitle: string
  albumImageUrl: string
  youtubeTitle: string
  youtubeVideoId: string
  tracks: TrackInfo[]
}
