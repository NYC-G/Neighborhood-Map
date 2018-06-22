import React, { Component } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MapDiv from './MapDiv';
import * as PlacesAPI from './PlacesAPI';
import { GoogleApiWrapper } from 'google-maps-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      filteredPlaces: [],
      clickedLocation: {},
      sidebarActive: 'active',
      buttonActive: true,
      infoWindowActive: false,
      filterFocused: false
    }

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.filterLocations = this.filterLocations.bind(this);
    this.listItemClicked = this.listItemClicked.bind(this);
  }

  componentDidMount() {
    // register serviceWorker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function(err) {
        // registration failed
        console.log('ServiceWorker registration failed: ', err);
      });
    } else {
      console.log('service worker is not supported');
    }

    // make the api calls
    const fourSquare = PlacesAPI.getFoursquareData();

    PlacesAPI.getPlaces().then(places => {
      for (let i = 0; i < places.length; i++) {
        // create the url for the 4square API call
        let apiUrl = fourSquare.baseUrl + places[i].foursquareID + fourSquare.picSuffix;
        // Make the API call
        PlacesAPI.getFoursquarePicture(apiUrl).then(pictureUrl => {
          // set the picture on every location
          places[i].picture = pictureUrl;
        }).catch(error => {
          console.error(error);
        })
      }
      // return the places with the 4square pics
      return places;
    }).then(placesWithPics => {
      this.setState({
        filteredPlaces: placesWithPics,
        places: placesWithPics
      })
    }).catch(error => {
      console.error(error);
    })
  }

  toggleSidebar() {
    // toggle button
    const buttonState = this.state.buttonActive;
    this.setState({
      buttonActive: !buttonState
    })

    // toggle sidebar
    if (this.state.sidebarActive === 'active') {
      this.setState({
        sidebarActive: ''
      })
    } else {
      this.setState({
        sidebarActive: 'active'
      })
    }

    // focus filter Input
    const filterState = this.state.filterFocused;
    this.setState({
      filterFocused: !filterState
    })

    // close open infowindows in map
    const infoWindowState = this.state.infoWindowActive;
    this.setState({
      infoWindowActive: !infoWindowState
    })
  }

  filterLocations(value) {
    let filteredLocations = [];
    for (let place of this.state.places) {
      if (place.name.toLowerCase().includes(value)) {
        filteredLocations.push(place);
      }
    }
    this.setState({
      filteredPlaces: filteredLocations
    })
  }

  listItemClicked(itemName) {
    this.toggleSidebar();

    // send an object with name and url
    let clickedLocation = {
      name: itemName,
      pictureUrl: null,
      externalUrl: null
    };

    // get the location picture
    for (let location of this.state.filteredPlaces) {
      if (itemName === location.name) {
        clickedLocation.pictureUrl = location.picture
        clickedLocation.externalUrl = location.foursquareUrl
      }
    }

    // set both
    this.setState({
      clickedLocation: clickedLocation
    })
  }

  render() {
    return (
      <main className="App">
        <Sidebar
          onSidebarActivated={this.state.sidebarActive}
          locations={this.state.filteredPlaces}
          onListItemClicked={this.listItemClicked}
          onFilterChanged={this.filterLocations}
          filterFocused={this.state.filterFocused}
          />
        <main id="content">
          <Navbar
            buttonState={this.state.buttonActive}
            onButtonClicked={this.toggleSidebar} />
          <MapDiv
            google={this.props.google}
            locations={this.state.filteredPlaces}
            clickedLocation={this.state.clickedLocation}
            infoWindowState={this.state.infoWindowActive}/>
        </main>
      </main>
    );
  }
}

export default GoogleApiWrapper({
                apiKey: 'AIzaSyDOQ8VujMU1oNLoLDQkwMNG3gCeaYXDu9E'
              })(App);
