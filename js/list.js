 var locations = [
    {title: 'Cactus Bellevue Square', location: {lat: 47.616972,
        lng: -122.201963}},
    {title: 'Ishoni Yakiniku', location: {lat: 47.6181,
        lng: -122.197971}},
    {title: '99 Park Restaurant', location: {lat: 47.611666, lng: -122.204546}},
    {title: 'Lunchbox Laboratory', location: {lat: 47.619048,
        lng: -122.191414}}
    ];

  var viewModel = {
  	locations: ko.observableArray(locations),
  	query: ko.observable(''),

  	search: function(value) {
    	viewModel.locations.removeAll();

	    for(var x in locations) {
	      if(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	        viewModel.locations.push(locations[x]);
	      }
	    }
  	}
  };

  viewModel.query.subscribe(viewModel.search);

  ko.applyBindings(viewModel);
