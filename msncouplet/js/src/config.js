
	var galleryConfig = [{	//配置不同网站图集页上一张、下一张按钮
		widgetSid:'746YRj7kfucKZSZc3KfGo0',
		containerId:'picbox',
		leftClass:'p_left',
		leftTitle:'上一张',
		rightClass:'p_right',
		rightTitle:'下一张'
	}];

	var	siteSize={	// 网站宽度
		'746YRj7kfucKZSZc3KfGo0':980
	};

	var prefix="http://push.instreet.cn/";

	var config = {	//config对象
			redurl	:	prefix+"click.action",
		callbackurl	:	prefix+"push.action",
			murl	:	prefix+"tracker.action",
			iurl    :	prefix+"tracker90.action",
			ourl	:	prefix+"loadImage.action",
			surl    :   prefix+"share/weiboshare",
			// cssurl  :	'http://static.instreet.cn/widgets/push/css/instreet.msncouplet.min.css',
			cssurl  :	'css/instreet.msncouplet.css',
			imih	:	300,
			imiw	:	300,
			timer   :   1000,
			width	:   120,
			height	:	600,
			adsLimit:   1
	};

