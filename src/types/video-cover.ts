export interface VideoTag {
  id: string;
  name: string;
  color?: string;
}

export interface VideoCover {
  id: string;
  title: string;
  image: string;
  tags: string[];
  order: number;
  priority?: boolean;
}

export interface VideoCoverData {
  tags: VideoTag[];
  covers: VideoCover[];
}
