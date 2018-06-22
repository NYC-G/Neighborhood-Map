import React, { Component } from 'react';
import ReactDOM from 'react-dom'

class MapDiv extends Component {

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      infoWindow: null,
      markers: [],
      mapStyle: {
        width: '100%',
        height: '100%'
      }
    }

    this.initMap = this.initMap.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.markerClicked = this.markerClicked.bind(this);
    this.showInfoWindow = this.showInfoWindow.bind(this);
  };

  componentDidUpdate(prevProps) {
    // make sure to load it only if changes happen
    if (prevProps.google !== this.props.google) {
      this.initMap();
    }
  }

  initMap() {
    // get google to interact with it directly
    const google = this.props.google;

    // get the div where I will place the map
    const mapElement = ReactDOM.findDOMNode(this.refs.map);

    // create and config the map
    const mapConfig = {
      zoom: 15,
      center: new google.maps.LatLng(40.791240, -73.973989), // Central
      backgroundColor: 'gray'
    }
    const map = new google.maps.Map(mapElement, mapConfig);

    // create infoWindow
    const infoWindow = new google.maps.InfoWindow();

    // save them to use them later
    this.setState({
      map: map,
      infoWindow: infoWindow
    })

    // create Markers
    this.createMarkers(map);
  }

  createMarkers(map) {
    const google = this.props.google;
    const bounds = new google.maps.LatLngBounds();
    let markers = [];

    for (let location of this.props.locations) {
      let markerOptions = {
        position: location.position,
        title: location.name,
        map: map,
        animation: google.maps.Animation.DROP
      };
      let marker = new google.maps.Marker(markerOptions);

      // add actions on marker
      marker.addListener('click', () => {
        this.markerClicked(marker);
        this.showInfoWindow(marker, location.picture, location.foursquareUrl);
      });

      bounds.extend(marker.position);
      markers.push(marker);
    }

    map.fitBounds(bounds);

    this.setState({
      markers: markers,
      map: map
    })
  }

  markerClicked(marker) {
    // bounce the marker on click
    const google = this.props.google;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => { marker.setAnimation(null); }, 700);
  }

  showInfoWindow(marker, pictureUrl, externalUrl) {
    let infoWindow = this.state.infoWindow;
    const map =  this.state.map;

    // handle pic
    let content = `
    <h5>New York City</h5>
    <p>Welcome to ${marker.title}</p>
    <p>See it on <a href=${externalUrl} target="_blank" style='color:blue'>FourSquare</a></p>
    `;

    if (pictureUrl) {
      content += `<img src=${pictureUrl} alt='A picture of ${marker.title}'></img>`;
    } else {
        // handle error gracefully
      content += '<div>Unfortunately, there is no picture available at this time</div>'
    }
    // set up the infoWindow
    if (infoWindow.marker !== marker) {
      infoWindow.marker = marker;
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
      infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker = null;
      });
    } else if (infoWindow.marker === marker && infoWindow.getMap() === null) {
      infoWindow.setMap(map);
    }

    this.setState({
      infoWindow: infoWindow
    })
  }

  componentWillReceiveProps(newProps) {
    const google = this.props.google;
    const map = this.state.map;

    // handle markers
    if (this.props.locations !== newProps.locations) {
      // get location names
      let newLocationNames = [];
      for (let location of newProps.locations) {
        newLocationNames.push(location.name);
      }

      // loop through markers, if it is in there, keep it, if not, remove it
      for (let marker of this.state.markers) {
        // it is not in the new locations
        if (!newLocationNames.includes(marker.title)) {
          marker.setMap(null);
        } else if (newLocationNames.includes(marker.title) && marker.map === null) {
          // it is in the new locations, but it isnt already showing
          marker.setAnimation(google.maps.Animation.DROP);
          marker.setMap(map);
        }
      }
    }

    // handle clicked markers
    if (this.props.clickedLocation !== newProps.clickedLocation) {
      for (let marker of this.state.markers) {
        if (marker.title === newProps.clickedLocation.name) {
          this.markerClicked(marker);
          this.showInfoWindow(marker, newProps.clickedLocation.pictureUrl, newProps.clickedLocation.externalUrl);
        }
      }
    }

    // handle infoWindow
    if ((this.props.infoWindowState !== newProps.infoWindowState) && newProps.infoWindowState) {
      let infoWindow = this.state.infoWindow;
      infoWindow.close();
    }
  }

  render() {
    return(
      <section
        ref="map"
        role="presentation"
        style={this.state.mapStyle}>Loading Map..</section>
    )
  }
}

export default MapDiv;
