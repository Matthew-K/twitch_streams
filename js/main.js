// ------------------------
//  Model
// ------------------------
var model = {

	channelNames: ["freecodecamp", "starladder_cs_en", "dreamleague", "upswingpoker", "thomasballinger", "terakilobyte", "RobotCaleb"],

	//list of all channel objects
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
		view.render();
		// $.when(this.getAndSetInfo()).then(view.render());
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

	render: function(){
		$(document).ajaxStop(function() {
			var channelsInfo = controller.getChannels();
			for (var i = 0; i < channelsInfo.length; i++){
				console.log(channelsInfo[i]);
				var channel = channelsInfo[i];
				var name = channel.displayName;
				var logo = channel.logo;
				var url = channel.url;
				var status = channel.status;
				$("#channels").append(
					"<div>" + 
					"<p><b>" + name + "</b></p>" + 
					"<p>" + logo + "</p>" + 
					"<p>" + url + "</p>" + 
					"<p>" + status + "</p>" +
					"<br>" +
					"</div>"
				);
			}
		});
	},

	// displayChannels: function(channels){
	// 	// console.log(info);
	// 	$("#temp").append("<div>" +  + "</div>");
	// }	

}; // end of view


// Initialize on start
controller.init();






