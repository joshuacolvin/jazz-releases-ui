export interface ArtistInput {
  name: string;
}

export interface StudioInput {
  name: string;
  location: string;
}

export interface LabelInput {
  name: string;
}

export interface SessionInput {
  date: string;
  studio: StudioInput;
  personnel: PersonnelInput[];
  tracks: TrackInput[];
}

export interface PersonnelInput {
  id?: string;
  name: string;
  instruments?: string[];
  leader?: boolean;
  appearsOn?: string[];
}

export interface TrackInput {
  id?: string;
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
  released?: string;
  title: string;
  sessions?: SessionInput[];
}
