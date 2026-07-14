export interface MediaItem {
  id: string;
  type: "photo" | "video";
  src: string;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
}

export interface Photo extends MediaItem {
  type: "photo";
  category?: string;
}

export interface Video extends MediaItem {
  type: "video";
  category?: string;
  /** Optional poster/still frame shown before playback (no autoplay, per design rules). */
  posterSrc?: string;
}
