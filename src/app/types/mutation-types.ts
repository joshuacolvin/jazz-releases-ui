export interface ArtistInput {
  name: string;
}

export interface LabelInput {
  name: string;
}

export interface PersonnelInput {
  name: string;
  instruments?: string[];
  leader?: boolean;
}

export interface TrackInput {
  title: string;
  composedBy?: string[];
  length?: string;
  number?: string;
}

export interface ReleaseInput {
  artist: ArtistInput;
  catalogueNumber: string;
  label: LabelInput;
  imageUrl?: string;
  personnel?: PersonnelInput[];
  recorded?: string;
  released?: string;
  title: string;
  tracks?: TrackInput[];
}
