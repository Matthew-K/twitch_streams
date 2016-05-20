





$.ajax({
	dataType: "jsonp",
	url: 
	//	 "https://api.twitch.tv/kraken/streams/freecodecamp",
		 "https://api.twitch.tv/kraken/channels/freecodecamp",
	success: function(results) {
		console.log(results);

	}
});