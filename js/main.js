// ------------------------
//  Model
// ------------------------
var data = {
	results: {

	}

}; // end of data



// ------------------------
//  Controler
// ------------------------
var controller= {

	init: function(){
		this.makeCall();
	},

	makeCall: function(){
		$.ajax({
			dataType: "jsonp",
			url: 
			//	 "https://api.twitch.tv/kraken/streams/freecodecamp",
				 "https://api.twitch.tv/kraken/channels/freecodecamp",
			success: function(results) {
				controller.setResults(results);
				// console.log(data.results);
				view.render();

			}
		});
	},

	setResults: function(results){
		data.results = results;
	},

	getResults: function(){
		return data.results;
	}

}; // end of controller



// ------------------------
//  View
// ------------------------
var view = {

	render: function(){
		var info = controller.getResults();
		this.displayData(info);
	},

	displayData: function(info){
		console.log(info);
		$("#temp").append("<div>" + info.display_name + "</div>");
	}	

}; // end of view


// Initialize on start
controller.init();






