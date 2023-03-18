export interface Artist {
  id: string;
  name: string;
}

export interface Label {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Personnel {
  id: string;
  name: string;
  instruments: string[];
  leader: boolean;
  appearsOn: string[];
}

export interface Track {
  id: string;
  title: string;
  composedBy: string[];
  length: string;
  number: string;
}

export interface Release {
  id: string;
  artist: Artist;
  catalogueNumber: string;
  label: Label;
  imageUrl: string;
  personnel: Personnel[];
  recorded: string;
  released: string;
  title: string;
  tracks: Track[];
}
