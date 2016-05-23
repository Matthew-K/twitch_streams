// ------------------------
//  Model
// ------------------------
var model = {

	// array of channel names that will be used during API calls
	channelNames: ["freecodecamp", "starladder_cs_en", "dreamleague", "upswingpoker", "thomasballinger", "terakilobyte", "RobotCaleb", "comster404", "medrybw"],

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
				if(results.error){
					controller.addChannel(name, "images/placeholder.jpg", "", "This channel was not found.");
				} else if (results.stream === null){
					// call controller.makeChannelCall instead
					controller.makeChannelCall(name);
				} else {
					var channel = results.stream.channel;
					var displayName = channel.display_name;
					var logo = channel.logo;
					if(logo === null){
						logo = "images/placeholder.jpg";
					}
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
				if(logo === null){
					logo = "images/placeholder.jpg";
				}
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

				restOfDiv =  
						'<div class="col-xs-3 col-sm-2">' +
							'<img class="logo img-responsive" src=' + logo + '>' + 
						'</div>' + 
						'<div class="col-xs-9 col-sm-10 info">' +
							'<div class="row">' +
								'<div class="name col-xs-4">' +
									name +
								'</div>' + 
								'<div class="status col-xs-8">' +
									status +
								'</div>' +
							'</div>' +
						'</div>' +
					'</a>';

				if(status === "This channel was not found."){
					$("#channels").append(
						'<div class="row offline notFound channel">' + 
							restOfDiv);
				}else if(status === "Offline"){
					$("#channels").append(
						'<a href=' + url + '>' +
							'<div class="row offline channel">' + 
								restOfDiv);
				}else{
					$("#channels").append(
						'<a href=' + url + '>' +
							'<div class="row online channel">' + 
								restOfDiv);
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

	// display all channels when #allChannels div is clicked. Add .active class to #allChannels.
	allClick: function(){
		$("#allChannels").on("click", function(){
			$(".hide").removeClass("hide");

			$("#allChannels").addClass("active");
			$("#onlineChannels").removeClass("active");
			$("#offlineChannels").removeClass("active");
		});
	},

	// display online channels when #onlineChannels div is clicked. Add .active class to #onlineChannels.
	onlineClick: function(){
		$("#onlineChannels").on("click", function(){
			$(".notFound").addClass("hide");
			$(".offline").addClass("hide");
			$(".online").removeClass("hide");

			$("#allChannels").removeClass("active");
			$("#onlineChannels").addClass("active");
			$("#offlineChannels").removeClass("active");
		});
	},

	// display offline channels when #offlineChannels div is clicked. Add .active class to #offlineChannels.
	offlineClick: function(){
		$("#offlineChannels").on("click", function(){
			$(".notFound").addClass("hide");
			$(".online").addClass("hide");
			$(".offline").removeClass("hide");

			$("#allChannels").removeClass("active");
			$("#onlineChannels").removeClass("active");
			$("#offlineChannels").addClass("active");
		});
	}

}; // end of view


// Initialize on start
controller.init();






