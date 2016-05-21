// ------------------------
//  Model
// ------------------------
var model = {
	//list of all channel objects
	channelNames: ["freecodecamp", "starladder_cs_en", "dreamleague", "upswingpoker", "thomasballinger", "terakilobyte", "RobotCaleb"],

	channels: [],

	// Channel object constructor, used by controller.addChannel;
	Channel: function(displayName, logo, url, status){
		this.displayName = displayName;
		this.logo = logo;
		this.url = url;
		this.status = status;	
	}

}; // end of data



// ------------------------
//  Controler
// ------------------------
var controller= {

	//some users for testing purposes
	//--------------------------------
	//thomasballinger
	//starladder_cs_en
	//freecodecamp
	//--------------------------------

	init: function(){
		this.getAndSetInfo();
	},

	getAndSetInfo: function(){
		for(var i = 0; i < model.channelNames.length; i++){
			controller.makeStreamCall(model.channelNames[i]);
		}
	},

	makeStreamCall: function(name){
		$.ajax({
			dataType: "jsonp",
			url: "https://api.twitch.tv/kraken/streams/" + name,
			success: function(results) {
				// if the stream is offline
				if (results.stream === null){
					// call controller.makeChannelCall instead
					controller.makeChannelCall(name);
				} else {
					var channel = results.stream.channel;
					var displayName = channel.display_name;
					var logo = channel.logo;
					var url = channel.url;
					var status = channel.status;
					controller.addChannel(displayName, logo, url, status);
				}
			}
		});
	},

	makeChannelCall: function(name){
		$.ajax({
			dataType: "jsonp",
			url: "https://api.twitch.tv/kraken/channels/" + name,
			success: function(results) {
				var displayName = results.display_name;
				var logo = results.logo;
				var url = results.url;
				var status = "Offline";
				controller.addChannel(displayName, logo, url, status);
			}
		});
	},
	
	addChannel: function(displayName, logo, url, status){
		var channel = new model.Channel(displayName, logo, url, status);
		model.channels.push(channel);
	},

	getChannels: function(){
		return model.channels;
	}
}; // end of controller



// ------------------------
//  View
// ------------------------
var view = {

	// render: function(){
	// 	var info = controller.getChannels();
	// 	this.displayChannels(channels);
	// },

	// displayChannels: function(channels){
	// 	// console.log(info);
	// 	$("#temp").append("<div>" +  + "</div>");
	// }	

}; // end of view


// Initialize on start
controller.init();






