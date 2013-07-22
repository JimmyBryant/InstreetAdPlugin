/*
	instreet.metro.js v0.0.4
*/
(function(window,undefined){

	if (window.InstreetWidget&&typeof window.InstreetWidget=='object'){
		return;
	} else {

		window.InstreetWidget = {
			version : "@REVISION@",
	        type    : "InstreetImageWidget",
	        name	: "metro"
		};

	}

	var document = window.document,
		navigator = window.navigator,
		location = window.location,
		host = location.hostname,
		isIE=!!window.ActiveXObject,
		isFirst=true,
		adsObjectArray=[],       //存放广告数据
		imagesList=[],
		sizeList=[250,250],   //广告尺寸数组，w=config.sizeNum*2 ,h=config.sizeNum*2+1
		container=null,
		spotBox=null;

	var createContainer=function(){	//创建容器

		var c=document.createElement("div"),
			s=document.createElement("div"),
			body=document.getElementsByTagName('body')[0]||document.documentElement;
		c.id=c.className="instreet-plugin-container";
		s.id=s.className="ins-spotbox-"+config.color.toLowerCase();
		spotBox=s;
		c.appendChild(s);
		if(body&&body.firstChild){
			body.insertBefore(c,body.firstChild);
			return c;
		}
		return null;

	};