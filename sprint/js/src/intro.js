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
	   isFirst=true,
	   container=null,
	   spotBox=null;

	var createContainer = function(){						//创建广告容器
		var container=document.createElement('div'),
			spotBox=document.createElement('div');
		container.id="instreet-plugin-container";
		spotBox.id="instreet-plugin-spotbox";

		container.appendChild(spotBox);
		var body=document.getElementsByTagName[0]||document.documentElement;
		body.firstChild&&body.insertBefore(container,body.firstChild);
		return container;
	};