// Data
const places = [
  {
    id: 0,
    position: {
        lat: 40.779437,
        lng: -73.963265
    },
    picture: null,
    foursquareID: '427c0500f964a52097211fe3',
    foursquareUrl: 'https://foursquare.com/v/the-metropolitan-museum-of-art/427c0500f964a52097211fe3',
    name: 'The Metropolitan Museum of Art',
  },
  {
    id: 1,
    position: {
        lat: 40.781338,
        lng: -73.973994
    },
    picture: null,
    foursquareID: '4297b480f964a52062241fe3',
    foursquareUrl: 'https://foursquare.com/v/american-museum-of-natural-history/4297b480f964a52062241fe3',
    name: 'The American Museum of Natural History'
  },
  {
    id: 2,
    position: {
        lat: 40.792499,
        lng: -73.951936
    },
    picture: null,
    foursquareID: '4530db98f964a520623b1fe3',
    foursquareUrl: 'https://foursquare.com/v/museum-of-the-city-of-new-york/4530db98f964a520623b1fe3',
    name: 'The Museum of the City of New York'
  },
  {
    id: 3,
    position: {
        lat: 40.783011,
        lng: -73.959017
    },
    picture: null,
    foursquareID: '41706480f964a520a51d1fe3',
    foursquareUrl: 'https://foursquare.com/v/solomon-r-guggenheim-museum/41706480f964a520a51d1fe3',
    name: 'The Solomon R. Guggenheim Museum'
  },
  {
    id: 4,
    position: {
        lat: 40.785334,
        lng: -73.957365
    },
    picture: null,
    foursquareID: '4a746fb2f964a52025de1fe3',
    foursquareUrl: 'https://foursquare.com/v/the-jewish-museum/4a746fb2f964a52025de1fe3',
    name: 'The Jewish Museum'
  },
  
];

export const getFoursquareData = () => {
  const fourSquare = {
    baseUrl: 'https://api.foursquare.com/v2/venues/',
    picSuffix: '/photos?&oauth_token=IUT0DOG5UFM4FYIZUGJ5QPG1FXSYTBOX434C0M0AAJIATBBA&v=20171222',
    client_id: 'MZERYEYLR3T0DC5S01IGRH45WJF0JAU4BHTEOBQA0521SVVM', // use only while developing
    client_secret: 'FKPET3DIFLTKG0MU11WO2BAMP1HOOHJLRCKEGOIUVFZPKII5' // use only while developing
  };

  return fourSquare;
}

// API Calls
export const getPlaces = () => {
  return new Promise((resolve, reject) => {
    resolve(places);
    if (places.length === 0) {
      reject('something went wrong with the API call');
    }
  });
}

export const getFoursquarePicture = (url) =>
  fetch(url).then(function(response) {
      if (response.ok) {
          return response.json();
      }
  }).then(function(json) {
      // get the pic
      const picture = json.response.photos.items[0];
      const dimensions = '300x300';
      const pictureUrl = picture.prefix + dimensions + picture.suffix;
      // hook it up to the place
      // model.places[placeIndex].picture = pictureUrl;
      return pictureUrl;
  })
