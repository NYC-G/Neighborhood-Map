var allMarkers = [];
var infowindow = null;

$(window).bind("load", function() {
  var self = this;
  var map;
  // Array of locations
  var locations = [
          {title: 'The Metropolitan Museum of Art', location: {lat: 40.779437, lng: -73.963265}},
          {title: 'The American Museum of Natural History', location: {lat: 40.781338, lng: -73.973994}},
          {title: 'The Museum of the City of New York', location: {lat: 40.792499, lng: -73.951936}},
          {title: 'The Solomon R. Guggenheim Museum', location: {lat: 40.783011, lng: -73.959017}},
          {title: 'The Jewish Museum', location: {lat: 40.785334, lng: -73.957365}},
        ];

  // ViewModel
  var viewModel = function(locations) {
      var self = this;
      // Observable arrays
      self.markers = ko.observableArray([]);
      self.allLocations = ko.observableArray([]);
      self.map = ko.observable(map);

      self.filter = ko.observable('');
      self.search = ko.observable('');

      // Initialize map
      initMap();
      // Alert if map doesn't open
      if (!map) {
        alert("Google Maps is not avaliable. Try again later!");
      }

      setLocations(locations, self.markers);

      for (var i = 0; i < allMarkers.length; i++) {
        self.allLocations.push(allMarkers[i]);
      }

      //getFoursquareUrl(locations);

      // Filter functionality to check if letter is in location title
      self.filteredArray = ko.computed(function() {
        return ko.utils.arrayFilter(self.allLocations(), function(item) {
          if (item.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
            if(item.marker) {
              item.marker.setVisible(true);
            }
          } else {
            if(item.marker) {
              item.marker.setVisible(false);
            }
          }
          return item.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
        });
      }, self);


      self.filterLocations = ko.computed(function() {
        return ko.utils.arrayForEach(self.allLocations(), function(marker) {
          var text = marker.title.toLowerCase();
          if (text.indexOf(self.filter().toLowerCase()) !== -1) {
            marker.setVisible(true);
          }
          else {
            marker.setVisible(false);
          }
        });
       });

      setInfowindows(allMarkers, getFoursquareUrl(locations));

      // Animate on click
      self.showClick = function () {
        for (var i = 0; i < self.markers.length; i++) {
          self.markers[i].infowindow.close();
        }
        self.setMarkerAnimation(this);
      };

      // Make markers bounce
      self.setMarkerAnimation = function (marker) {
        google.maps.event.trigger(marker, 'click');
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( function() {
          marker.setAnimation(null);
        }, 700);
      };
  };

    function initMap() {
      // Map function
      map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.785499, lng: -73.961712},
         zoom: 15,
         mapTypeControl: false,
      });

      // Resize for responsiveness
      google.maps.event.addListener(window, "resize", function() {
         var center = map.getCenter();
         google.maps.event.trigger(map, "resize");
         map.setCenter(center);
      });
      // Make empty infowindow content
      infowindow = new google.maps.InfoWindow({
         content: "hold"
      });
    }

    function toggleBounce(marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( function() {
          marker.setAnimation(null);
        }, 700);
      }
    }
    // Iterate over locations and create marker properties
    function setLocations(locations, markers) {
      // Create markers
      for (var i=0; i < locations.length; i++) {
          var marker = new google.maps.Marker({
            position: locations[i].location,
            title: locations[i].title,
            map: map,
            animation: google.maps.Animation.DROP,
            checkins: ''
          });

          var highlightedIcon = makeMarkerIcon('FFFF24');

          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });

          marker.addListener('mouseout', function() {
            this.setIcon();
          });

          markers.push(marker);
          allMarkers.push(marker);
        }

      return;
    }

    // Retrieve data from FoursquareAPI
    function getFoursquareUrl(locations) {
      var fourSquareUrl = '';
      var checkins;
      var storeData = [];
      for (var x =0; x <locations.length; x++) {

            fourSquareUrl = 'https://api.foursquare.com/v2/venues/search' +
            '?client_id=AMWJL4GLRVDE4NTXYIX3A1PNL2TOKDMK5AMMIBK42QINFH1W' +
            '?client_secret=15ZYGX5OR4PDWSXXUWPIVSQE1KZIND3MH3IIXVKNO2XT2MUK' +
            '&v=20130815' + '&m=foursquare' +
            '&ll=' + locations[x].location.lat + ',' + locations[x].location.lng +
            '&query=' + locations[x].title + '&intent=match' +
            '&oauth_token=5SJQANNEWCQNY0TPY2OLA5LTNOHRPSNZE40BWUCSHR1KXMDX&v=20161107';

            $.ajax({
              url: fourSquareUrl,
              async: false,
              dataType: 'json',
              success: function (data) {
                checkins = data.response.venues[0].stats.checkinsCount;
                var formattedCheckins = Number(checkins);
                storeData.push(formattedCheckins);
              },
              error: function () {
                storeData.push("No checkin data available")
              }
            });
          };
          return storeData;
        }

    // Make different marker icon colors
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    function setInfowindows(markers, array) {
          for (var x =0; x<array.length; x++) {
              allMarkers[x].checkins = array[x];
          }

          // Add infowindow showing title and checkin data
          for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            google.maps.event.addListener(marker, 'click', function() {
              toggleBounce(this);
              var infoContent = '<div class="infowindow"><strong>' + this.title + '</strong>' + '<br>'+ 'Checkins: ' + this.checkins + '</div>';
              infowindow.setContent(infoContent);
              infowindow.open(map, this);
            });
          }
        }

  // Call viewModel to apply Knockout bindings
  ko.applyBindings(new viewModel(locations));
});
