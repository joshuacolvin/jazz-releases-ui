import gql from "graphql-tag";

// Label Queries
export const GET_LABEL_BY_NAME_QUERY = gql`
  query GetLabelByName($name: String!) {
    getLabelByName(name: $name) {
      id
      name
      releases {
        id
        title
        artist {
          id
          name
        }
      }
    }
  }
`;

export const GET_ALL_LABELS = gql`
  query GetAllLabels {
    getAllLabels {
      id
      name
      imageUrl
    }
  }
`;

export const GET_LABEL_BY_ID = gql`
  query GetLabelById($id: ID!) {
    getLabelById(id: $id) {
      id
      name
    }
  }
`;

// Release Queries
export const GET_RELEASES_BY_CATALOGUE_NUMBER = gql`
  query GetReleasesByCatalogueNumber($catalogueNumber: String!) {
    getReleasesByCatalogueNumber(catalogueNumber: $catalogueNumber) {
      id
      title
      imageUrl
      catalogueNumber
      released
      artist {
        name
      }
      label {
        name
      }
    }
  }
`;

export const GET_ALL_RELEASES_FOR_ARTIST = gql`
  query GetAllReleasesForArtist($name: String!) {
    getAllReleasesForArtist(name: $name) {
      id
      title
      imageUrl
      catalogueNumber
      released
      artist {
        name
      }
      label {
        name
      }
    }
  }
`;

export const GET_RELEASES_FOR_LEADER = gql`
  query GetReleasesForLeader($name: String!) {
    getReleasesForLeader(name: $name) {
      id
      title
      imageUrl
      catalogueNumber
      released
      artist {
        name
      }
      label {
        name
      }
    }
  }
`;

export const GET_RELEASES_FOR_SIDEMAN = gql`
  query GetReleasesForSideman($name: String!) {
    getReleasesForSideman(name: $name) {
      id
      title
      imageUrl
      catalogueNumber
      released
      artist {
        name
      }
      label {
        name
      }
    }
  }
`;

export const GET_RELEASES_BY_LABEL_ID = gql`
  query GetReleasesByLabelId($labelId: String!) {
    getReleasesByLabelId(labelId: $labelId) {
      id
      title
      artist {
        id
        name
      }
      label {
        id
        name
      }
      catalogueNumber
      imageUrl
      released
    }
  }
`;

export const GET_RELEASES_BY_LABEL_NAME = gql`
  query GetReleasesByLabelName($labelName: String!) {
    getReleasesByLabelName(labelName: $labelName) {
      id
      title
      artist {
        id
        name
      }
      label {
        id
        name
      }
      catalogueNumber
      imageUrl
      released
    }
  }
`;

export const GET_RELEASES_BY_SERIES = gql`
  query GetReleasesBySeries($last: String!, $first: String!) {
    getReleasesBySeries(last: $last, first: $first) {
      id
      title
      artist {
        id
        name
      }
      label {
        id
        name
      }
      catalogueNumber
      imageUrl
      released
    }
  }
`;

export const GET_RELEASE_BY_ID = gql`
  query GetReleaseById($releaseId: String!) {
    getReleaseById(releaseId: $releaseId) {
      id
      title
      artist {
        id
        name
      }
      producer {
        id
        name
      }
      designer {
        id
        name
      }
      photographer {
        id
        name
      }
      label {
        id
        name
      }
      catalogueNumber
      imageUrl
      released
      sessions {
        id
        date
        engineer {
          id
          name
        }
        studio {
          id
          name
          location
        }
        personnel {
          id
          artist {
            id
            name
          }
          instruments
          leader
          appearsOn
        }
        tracks {
          id
          title
          composedBy
          length
          number
        }
      }
    }
  }
`;

export const GET_RELEASE_BY_TITLE = gql`
  query GetReleaseByTitle($title: String!) {
    getReleaseByTitle(title: $title) {
      id
      title
      artist {
        id
        name
      }
      label {
        id
        name
      }
      catalogueNumber
      imageUrl
      released
    }
  }
`;

export const GET_ALL_ARTISTS = gql`
  query GetAllArtists {
    getAllArtists {
      id
      name
    }
  }
`;

// MUTATIONS
export const CREATE_RELEASE = gql`
  mutation createRelease($input: ReleaseInput!) {
    createRelease(input: $input)
  }
`;

export const UPDATE_RELEASE = gql`
  mutation updateRelease($input: ReleaseInput!) {
    updateRelease(input: $input) {
      id
    }
  }
`;

export const DELETE_PERSONNEL_BY_ID = gql`
  mutation DeletePersonnelById($personnelId: String!) {
    deletePersonnelById(personnelId: $personnelId) {
      id
    }
  }
`;

export const DELETE_TRACK_BY_ID = gql`
  mutation DeleteTrackById($trackId: String!) {
    deleteTrackById(trackId: $trackId) {
      id
    }
  }
`;
