// ------------------------
//  Model
// ------------------------
var model = {
	// array of channel names that will be used during API calls
	channelNames: ["freecodecamp", "starladder_cs_en", "dreamleague", "upswingpoker", "thomasballinger", "terakilobyte", "RobotCaleb"],

	// array of all channel objects
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

	// runs at start of app
	init: function(){
		this.getAndSetInfo();
		view.init();
	},

	// use each channel name in model.channelNames to make an API call
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

	init: function(){
		this.render();
		this.createClickHandlers();
	},

	// render information about all channels 
	render: function(){
		$(document).ajaxStop(function() {
			var channelsInfo = controller.getChannels();
		
			for (var i = 0; i < channelsInfo.length; i++){
				var channel = channelsInfo[i];
				var name = channel.displayName;
				var logo = channel.logo;
				var url = channel.url;
				var status = channel.status;

				var restOfDiv = "<p><b>" + name + "</b></p>" + 
								"<p>" + logo + "</p>" + 
								"<p>" + url + "</p>" + 
								"<p>" + status + "</p>" +
								"<br>" +
								"</div>";

				if(status === "Offline"){
					$("#channels").append("<div class='offline channel'>" + restOfDiv);
				} else {
					$("#channels").append("<div class='online channel'>" + restOfDiv);
				}
			}
		});
	},

	// create click handlers
	createClickHandlers: function(){
		this.allClick();
		this.onlineClick();
		this.offlineClick();
	},

	// display all channels when #allChannels div is clicked
	allClick: function(){
		$("#allChannels").on("click", function(){
			$(".hide").removeClass("hide");
		});
	},

	// display online channels when #onlineChannels div is clicked
	onlineClick: function(){
		$("#onlineChannels").on("click", function(){
			$(".offline").addClass("hide");
			$(".online").removeClass("hide");
		});
	},

	// display offline channels when #offlineChannels div is clicked
	offlineClick: function(){
		$("#offlineChannels").on("click", function(){
			$(".online").addClass("hide");
			$(".offline").removeClass("hide");
		});
	}

}; // end of view


// Initialize on start
controller.init();






