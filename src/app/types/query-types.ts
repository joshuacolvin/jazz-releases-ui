export interface Artist {
  id: string;
  name: string;
}

export interface Designer {
  id: string;
  name: string;
}

export interface Engineer {
  id: string;
  name: string;
}

export interface Photographer {
  id: string;
  name: string;
}

export interface Producer {
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
  artist: Artist;
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
  photographer: Photographer;
  producer: Producer;
  designer: Designer;
  catalogueNumber: string;
  label: Label;
  imageUrl: string;
  sessions: Session[];
  released: string;
  title: string;
}

export interface Session {
  id: string;
  date: string;
  engineer: Engineer;
  studio: Studio;
  personnel: Personnel[];
  tracks: Track[];
}

export interface Studio {
  id: string;
  name: string;
  location: string;
}
