import { VideoSource } from "./videoSource";

export interface Episode {
  id: string;
  name: string;
  slug: string;
  episodeNumber: number;
  seasonNumber: number;
  duration?: string;
  thumbnailUrl?: string;
  videoSources: VideoSource[];
}
