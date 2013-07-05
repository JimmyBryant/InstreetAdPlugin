/*
	instreet.sprint.js v0.1.7
*/
(function(window,undefined){

	if (window.InstreetWidget&&typeof window.InstreetWidget=='object'){
		return;
	} else {

		window.InstreetWidget = {
			version : "@REVISION@",
	        name    : "InstreetImageWidget",
	        style	: "sprint"
		};

	}

   var document = window.document,
	   navigator = window.navigator,
	   location = window.location,
	   host = location.hostname,
	   isIE=!!window.ActiveXObject,
	   imgs=[],
	   isFirst=true;