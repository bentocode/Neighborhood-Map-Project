var map;
// Create a blank array for the listing markers.
var markers = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


function initMap() {

// Add a styles array to use with the map
// This style is 'Bright & Bubbly' by Paulo Avila from SnazzyMaps.com

var styles = [{"featureType":"water","stylers":[{"color":"#19a0d8"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"weight":6}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e85113"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-20}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"road.highway","elementType":"labels.icon"},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"lightness":20},{"color":"#efe9e4"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"hue":"#11ff00"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"hue":"#4cff00"},{"saturation":58}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f0e4d3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-10}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]}]
// Constructor creates a new map - only center and zoom are required
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6101, lng: -122.2015},
    zoom: 14,
    styles: styles,
    mapTypeControl: false
});

// These are real estate listings that will be shown to the user.
// Normally these would be in a database see Google Fusion Tables
var locations = [
    {title: 'Cactus Bellevue Square', location: {lat: 47.616972,
        lng: -122.201963}},
    {title: 'Ishoni Yakiniku', location: {lat: 47.6181,
        lng: -122.197971}},
    {title: '99 Park Restaurant', location: {lat: 47.611666, lng: -122.204546}},
    {title: 'Lunchbox Laboratory', location: {lat: 47.619048,
        lng: -122.191414}}
];

var largeInfoWindow = new google.maps.InfoWindow();

// Use the location array to create an array of markers
for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker on the map for each location
    var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i,
        label: labels[labelIndex++ % labels.length]
    });
    // Push each marker to the markers array
    markers.push(marker);
    // Create an onClick event to open an infowindow at each marker
    marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow);
    });

};

document.getElementById('show-listings').addEventListener('click', showListings);
document.getElementById('hide-listings').addEventListener('click',  hideListings);
}

// This function populates the infoWindow when the marker is clicked
// Only one infoWindow is allowed at one time
// The infoWindow populates based on the markers position

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already open on this marker
    if (infowindow.marker != marker) {
        // Clear content to allow streetview to load
        infowindow.setContent('');
        infowindow.marker = marker;

        // infowindow.open(map, marker);
        // Clear the marker property if the infowindow is closed
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, compute position and heading
        // Then get panorama and set options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearSteetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearSteetViewLocation, marker.position);
                    infowindow.setContent('<div>'+ marker.title + '</div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearSteetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }

                    };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Steet View Found</div>');
                }
            }
                // Use streetview service to get closest image within 50 meters
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                // Open the infowindow on the correct marker
                infowindow.open(map, marker);
            }
        }

// This function will loop through the markers array and display them all
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries for the map for each marker and display the
    // marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    // Tell the map to fit itself to the bounds defined by the markers
    map.fitBounds(bounds);
};

function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
};
