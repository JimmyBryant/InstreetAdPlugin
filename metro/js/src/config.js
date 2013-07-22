
	var prefix="http://push.instreet.cn/";
	var themeList=['red','yellow','green','blue','purple','brown'];
	var config = {	//config对象
			redurl	:	prefix+"click.action",
		callbackurl	:	prefix+"push.action",
			murl	:	prefix+"tracker.action",
			iurl    :	prefix+"tracker90.action",
			ourl	:	prefix+"loadImage.action",
			surl    :   prefix+"share/weiboshare",
			// cssurl	:   "http://static.instreet.cn/widgets/push/css/instreet.metro.min.css",
			cssurl	:   "css/instreet.metro.css",
			imih	:   300,
			imiw	:	300,
			width	:   250,
			height	:   250,
			timer   :   5000,
			sizeNum	:   0,
			color	:   'RED',
			appQuery:   ["adApp","shopApp","weiboApp","wikiApp","newsApp","weatherApp","musicApp","videoApp","shareApp"]	//指定显示的app以及顺序
	};