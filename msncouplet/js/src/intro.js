
(function(window,undefined){

	if (window.InstreetWidget&&typeof window.InstreetWidget=='object'){
		return;
	} else {

		window.InstreetWidget = {
			version : "@REVISION@",
	        type    : "InstreetImageWidget",
	        name	: "msncouplet"
		};

	}

   var document = window.document,
	   navigator = window.navigator,
	   location = window.location,
	   host = location.hostname,
	   isIE=!!window.ActiveXObject,
	   imgs=[],
	   isFirst=true,
	   container=null;

	var createContainer=function(){	//创建容器

		var c=document.createElement("div"),
			body=document.getElementsByTagName('body')[0]||document.documentElement;
		c.id=c.className="instreet-image-plugin-container";
		if(body&&body.firstChild){
			body.insertBefore(c,body.firstChild);
			return c;
		}
		return null;

	};

