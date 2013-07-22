/*
	instreet.sprint.js v0.1.7
*/
(function(window,undefined){

	if (window.InstreetWidget&&typeof window.InstreetWidget=='object'){
		return;
	} else {

		window.InstreetWidget = {
			version : "@REVISION@",
	        type    : "InstreetImageWidget",
	        name	: "sprint"
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
		var c=document.createElement('div'),
			s=document.createElement('div');
		c.id="instreet-plugin-container";
		s.id="instreet-plugin-spotbox";

		c.appendChild(s);
		spotBox=s;
		var body=document.getElementsByTagName('body')[0]||document.documentElement;
		if(body&&body.firstChild){
			body.insertBefore(c,body.firstChild);
			return c;
		}
		return null;
	};