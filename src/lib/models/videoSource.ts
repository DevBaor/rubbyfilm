export interface VideoSource {
  serverName: string;
  label: string;
  url: string;
  type: "mp4" | "hls" | "embed";
}
