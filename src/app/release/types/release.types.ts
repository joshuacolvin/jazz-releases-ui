import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface ArtistFormGroup {
  name: FormControl<string>;
}

export interface EngineerFormGroup {
  name: FormControl<string>;
}

export interface PhotographerFormGroup {
  name: FormControl<string>;
}

export interface ProducerFormGroup {
  name: FormControl<string>;
}

export interface DesignerFormGroup {
  name: FormControl<string>;
}

export interface LabelFormGroup {
  name: FormControl<string>;
}

export interface StudioFormGroup {
  name: FormControl<string>;
  location: FormControl<string>;
}

export interface PersonnelFormGroup {
  id: FormControl<string | undefined>;
  artist: FormGroup<ArtistFormGroup>;
  instruments: FormControl<string>;
  leader: FormControl<boolean>;
  appearsOn: FormControl<string>;
}

export interface SessionFormGroup {
  id: FormControl<string | undefined>;
  engineer: FormGroup<EngineerFormGroup>;
  date: FormControl<string>;
  studio: FormGroup<StudioFormGroup>;
  personnel: FormArray<FormGroup<PersonnelFormGroup>>;
  tracks: FormArray<FormGroup<TrackFormGroup>>;
}

export interface TrackFormGroup {
  id: FormControl<string>;
  title: FormControl<string>;
  composedBy: FormControl<string>;
  length: FormControl<string>;
  number: FormControl<string>;
}

export interface CreateReleaseForm {
  artist: FormGroup<ArtistFormGroup>;
  photographer: FormGroup<PhotographerFormGroup>;
  producer: FormGroup<ProducerFormGroup>;
  designer: FormGroup<DesignerFormGroup>;
  catalogueNumber: FormControl<string>;
  imageUrl: FormControl<string>;
  label: FormGroup<LabelFormGroup>;
  released: FormControl<string>;
  sessions: FormArray<FormGroup<SessionFormGroup>>;
  title: FormControl<string>;
}
