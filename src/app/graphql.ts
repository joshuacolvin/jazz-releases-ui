import gql from 'graphql-tag';

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
      personnel {
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
      personnel {
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
      personnel {
        name
      }
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
      personnel {
        name
      }
    }
  }
`;

// MUTATIONS
export const CREATE_RELEASE = gql`
  mutation createRelease($input: ReleaseInput!) {
    createRelease(input: $input) {
      id
      artist {
        id
        name
      }
      title
      catalogueNumber
      label {
        id
        name
      }
      imageUrl
      personnel {
        id
        name
      }
      tracks {
        id
        title
      }
      recorded
      released
    }
  }
`;
