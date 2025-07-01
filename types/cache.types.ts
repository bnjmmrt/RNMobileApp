export type FileDetailsCache = {
  url: string;
  filePath?: string | null;
  size?: string;
  dimensions?: { width: number; height: number };
};
