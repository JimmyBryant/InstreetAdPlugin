//config.js the configuration for the widget
var prefix="http://push.instreet.cn/";
var config={
	cssurl	:"http://static.instreet.cn/widgets/push/css/instreet.pinad.min.css",
	// cssurl	: "css/instreet.pinad.min.css",
	redurl	:prefix+"click.action",
	callbackurl	:prefix+"push.action",
	murl	:prefix+"tracker.action",
	iurl    :prefix+"tracker90.action",
	ourl	:prefix+"loadImage.action",
	surl    :prefix+"share/weiboshare",
	imih	:290,
	imiw	:290,
	timer   :1000
};

//extend config info
var extendConfig=function(c){
	if(c&&typeof c=="object"){
		for(var i in c){
			config[i]=c[i];
		}
	}else{
		return;
   }
};