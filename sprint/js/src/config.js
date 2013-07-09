
	//配置不同网站图集页上一张、下一张按钮
	var galleryConfig = [{
		widgetSid:'746YRj7kfucKZSZc3KfGo0',
		containerId:'picbox',
		leftClass:'p_left',
		leftTitle:'上一张',
		rightClass:'p_right',
		rightTitle:'下一张'
	}];
	// 配置应用的展示顺序
	var	appQuery=["adApp","shopApp","weiboApp","wikiApp","newsApp","weatherApp","musicApp","videoApp","shareApp"];
	var prefix="http://push.instreet.cn/";
	//config对象
	var config = {
			redurl	:	prefix+"click.action",
		callbackurl	:	prefix+"push.action",
			murl	:	prefix+"tracker.action",
			iurl    :	prefix+"tracker90.action",
			ourl	:	prefix+"loadImage.action",
			surl    :   prefix+"share/weiboshare",
			cssurl  :	'http://static.instreet.cn/widgets/push/css/instreet.sprint.min.css',
			// cssurl  :	'css/instreet.sprint.css',
			imih	:	300,
			imiw	:	300,
			timer   :   1000,
			width   :   250,
			height	:   250
	};

	//extend config info
	var extendConfig=function(c){
		if(c&&typeof c=="object"){
			for(var i in c){
				config[i]=c[i];
			}
			if(config.widgetSid=='3EmILiPLqC0DXwuPwg0z72'){
				config.showMusic=true;
				config.showVideo=true;
			}
		}else{
			return;
	   }
	};