
	//InstreetAd apps
	InstreetAd.apps={

		adApp  :function(obj){
			if(!config.showFootAd||obj.data.badsSpot.length===0)
				return;
			var tab,
				cont,
				data,
				app,
				redUrl,
				w=config.width;
			if(obj.isFirstApp){
				tab=InstreetAd.createTab('ad','推广','first');
				obj.isFirstApp=false;
			}else{
				tab=InstreetAd.createTab('ad','推广');
			}
			data=obj.data;
			app=data.badsSpot[0];

			// app.adsType=9;
			// app.description="http://static.youku.com/v1.0.0223/v/swf/loader.swf?winType=adshow&VideoIDS=118492875&isAutoPlay=true&delayload=true&isShowRelatedVideo=false&imglogo=http://static.atm.youku.com/Youku2012/201211/1112/20635/280-210.jpg";

			cont=document.createElement("li");
			cont.className="ad";
			//增加第三方点击监控
			if(app.adClickMonitorUrl){
				var monitorUrl=app.adClickMonitorUrl+encodeURIComponent(app.adsLinkUrl||'');
				redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(monitorUrl));
			}else{
				redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl||''));
			}

			str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>产品推广</h3><div class="main-cont">';
			if(app.adsType==3){      //图片广告
				str+="<a class='large-image' target='_blank' href='"+redUrl+"'><img src='"+app.adsPicUrl+"' alt=''/></a>";
			}else if(app.adsType==9){              //flash广告
				str+='<object id="afg-adloader" width="'+w+'" height="'+w+'"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
				str+='<param value="always" name="allowScriptAccess"/><param value="'+app.adsPicUrl+'" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality"><param value="#F1F1F1" name="bgcolor"/>';
				str+='<embed width="'+w+'" height="'+w+'" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque"  bgcolor="#F1F1F1" quality="high" src="'+app.adsPicUrl+'"></object>';
				str+='<a class="flash-cover" href="'+redUrl+'" target="_blank"></a>';
			}
			else if(!app.adsLinkUrl&&app.description){   //谷歌广告
				str+='<iframe src="'+app.description+'" scrolling="no" height="'+config.height+'" width="'+config.width+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
				// str+='<i class="small-info"></i>'+frame;
			}
			str+='</div>';
			cont.innerHTML=str;
			return {tab:tab,cont:cont};
		},
		shopApp :function(obj){
			if(!config.showAd||obj.data.adsSpot.length===0)
				return;

			var tab,
				cont,
				str,
				data,
				app,
				redUrl,
				imgUrl,
				title,
				price,
				focus,
			selectStr='<div class="in-shop-selector">';
			if(obj.isFirstApp){
				tab=InstreetAd.createTab('shop','折扣','first');
				obj.isFirstApp=false;
			}else{
				tab=InstreetAd.createTab('shop','折扣');
			}

			data=obj.data;
			cont=document.createElement("li");
			cont.className="shop";
			str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>品牌折扣</h3><div class="main-cont">';
			str+='<div class="in-slider-container">';
			for(var i=0,len=data.adsSpot.length;i<len;i++){
				focus=i===0?" focus":"";
				app=data.adsSpot[i];
				obj.createSpot(app,i);        //创建spot
				redUrl=config.redurl+"?tty=0&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
				title=app.adsTitle;
				price=app.adsDiscount||app.adsPrice;
				imgUrl=app.adsPicUrl.replace("160x160",config.width+"x"+config.width);
				str+='<a target="_blank" class="pro-box'+focus+'" href="'+redUrl+'"><img class="ins-shop-image" src="'+imgUrl+'"/><span class="pro-info"><span class="pro-name">'+title+'</span><span class="pro-tobuy"><em>进入商店</em></span><span class="pro-price">¥'+price+'</span></span></a>';
				if(len>1)selectStr+='<a href="javascript:;" target="_self" class="select-item'+focus+'"></a>';
			}
			str+='</div>'+selectStr+'</div></div>';
			cont.innerHTML=str;
			return {tab:tab,cont:cont};
		},
		weiboApp:function(obj){

			if(!config.showWeibo||obj.data.weiboSpot.length===0)
				return;
			var tab,
				cont,
				data,
				app,
				title,
				redUrl,
				article,
				avatar,
				str="",
				focus="",
			selectStr='<div class="in-weibo-selector">';
			if(obj.isFirstApp){
				tab=InstreetAd.createTab('weibo','微博','first');
				obj.isFirstApp=false;
			}else{
				tab=InstreetAd.createTab('weibo','微博');
			}

			data=obj.data;
			cont=document.createElement("li");
			cont.className="weibo";
			str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>相关微博</h3><div class="main-cont">';
			str+='<div class="in-slider-container">';
			for(var i=0,len=data.weiboSpot.length;i<len;i++){
				focus=i===0?" focus":"";
				app=data.weiboSpot[i];
				obj.createSpot(app,i);        //创建spot
				avatar=app.avatar;
				icon=app.icon;
				title=app.title;
				article=app.latestStatus;
				redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&rurl="+encodeURIComponent(encodeURIComponent(app.userUrl));
				str+='<div class="weibo-item'+focus+'"><div class="left"><a href="'+redUrl+'" target="_blank" title="'+title+'"><img src="'+avatar+'"/></a></div><div class="right"><h3><a href="'+redUrl+'" target="_blank">'+title+'</a></h3><p><em class="arrow-one"></em><em class="arrow-two"></em>'+article+'</p><div class="icon-section"><a href="'+redUrl+'" target="_blank"><img src="'+icon+'"/></a></div></div></div>';
				if(len>1)selectStr+='<a href="javascript:;" class="select-item'+focus+'"></a>';
			}
			str+='</div>'+selectStr+'</div></div>';
			cont.innerHTML=str;
			return {tab:tab,cont:cont};

		},
		wikiApp:function(obj){
			if(!config.showWiki||obj.data.wikiSpot.length===0)
				return;
			var tab,cont,data,app,title,redUrl,article,avatar,str="",focus="",
				selectStr='<div class="in-wiki-selector">';
			if(obj.isFirstApp){
				tab=InstreetAd.createTab('wiki','百科','first');
				obj.isFirstApp=false;
			}else{
				tab=InstreetAd.createTab('wiki','百科');
			}
			data=obj.data;
			cont=document.createElement("li");
			cont.className="wiki";
			str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>相关百科</h3><div class="main-cont">';
			str+='<div class="in-slider-container">';
			for(var i=0,len=data.wikiSpot.length;i<len;i++){
				focus=i===0?" focus":"";
				app=data.wikiSpot[i];
				obj.createSpot(app,i);        //创建spot
				avatar=app.firstimg;
				title=app.title;
				article=app.summary;
				redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.url));
				str+='<div class="wiki-item'+focus+'"><div class="left"><a class="thumb" href="'+redUrl+'" target="_blank" title="'+title+'"><img src="'+avatar+'"/></a><h3><a class="tagName" href="'+redUrl+'" target="_blank">'+title+'</a></h3></div><div class="right"><p><em class="arrow-one"></em><em class="arrow-two"></em>'+article+'</p><div class="icon-section"><a href="'+redUrl+'" target="_blank"><img src="http://static.instreet.cn/widgets/push/images/icon_baike.png"/></a></div></div></div>';
				if(len>1)selectStr+='<a href="javascript:;" target="_self" class="select-item'+focus+'"></a>';
			}
			str+='</div>'+selectStr+'</div></div>';
			cont.innerHTML=str;
			return {tab:tab,cont:cont};
		},
		shareApp:function(obj){
			if(!config.showShareButton)
				return;
			var tab,
				cont;
			if(obj.isFirstApp){
				tab=InstreetAd.createTab('share','分享','first');
				obj.isFirstApp=false;
			}else{
				tab=InstreetAd.createTab('share','分享');
			}
			cont=document.createElement("li");
			cont.className="share";
			str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>图片分享</h3><div class="main-cont">';
			str+='<div class="in-share-icons"><a title="新浪微博" class="sina-ico" href="javascript:;" target="_self"></a><a title="腾讯微博" class="tx-ico" href="javascript:;" target="_self"></a><a title="QQ空间" class="qzone-ico" href="javascript:;" target="_self"></a><a title="人人网" class="renren-ico" href="javascript:;" target="_self"></a><a title="搜狐微博" class="sohu-ico" href="javascript:;" target="_self"></a><a title="网易微博" class="wangyi-ico" href="javascript:;" target="_self"></a><a title="豆瓣" class="douban-ico" href="javascript:;" target="_self"></a><a title="开心网" class="kaixin-ico" href="javascript:;" target="_self"></a>';
			str+='</div></div>';
			cont.innerHTML=str;
			return {tab:tab,cont:cont};
		},
		newsApp:function(obj){	//新闻应用
			if(!config.showNews)
				return;
			var data=obj.data,
				w=config.width,
				h=config.height,
			    appUrl=prefix+"news?size="+w+"&pd="+data.widgetSid+"&muh="+data.imageUrlHash,
			    app={type:'news',name:'新闻',title:'热点新闻',url:appUrl};
			return createThirdApp(obj,app);
		},
		weatherApp:function(obj){	//天气应用
			if(!config.showWeather)
				return;
			var	height=110,
				appUrl="http://www.thinkpage.cn/weather/weather.aspx?uid=&cid=101010100&l=zh-CHS&p=TWC&a=1&u=C&s=1&m=0&x=1&d=3&fc=&bgc=&bc=&ti=1&in=1&li=2&ct=iframe",
				app={type:'weather',name:'天气',title:'天气预报',url:appUrl,height:200};
			return createThirdApp(obj,app);
		},
		musicApp:function(obj){	//音乐应用
			if(!config.showMusic)
				return;
			var w=config.width,
				h=config.height,
				appUrl="http://img.xiami.com/res/player/widget/multiPlayer.swf?dataUrl=http://www.xiami.com/widget/xml-dynamic/uid/5840720/id/22460975/width/"+w+"/height/"+h+"/mainColor/5695c1/backColor/457cb4/type/collect/autoplay/0",
				app={type:'music',name:'音乐',title:'精选音乐',url:appUrl};
			return createThirdApp(obj,app);

		},
		videoApp:function(obj){	//视频应用
			if(!config.showVideo)
				return;
			var w=config.width,
				h=config.height,
				appUrl="http://www.tudou.com/a/hiGUpMnrqE8/&resourceId=0_04_05_99&iid=131089123/v.swf",
				app={type:'video',name:'视频',title:'top视频',url:appUrl};
			return createThirdApp(obj,app);
		}

	};

	var createThirdApp=function(obj,app){	//创建第三方应用
		var tab,
			cont,
			w=app.width||config.width,
			h=app.height||config.height;
		if(obj.isFirstApp){
			tab=InstreetAd.createTab(app.type,app.name,'first');
			obj.isFirstApp=false;
		}else{
			tab=InstreetAd.createTab(app.type,app.name);
		}
		cont=document.createElement("li");
		cont.className=app.type;
		str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>'+app.title+'</h3><div class="main-cont">';
		str+='<iframe name="ins-'+app.type+'" src="'+app.url+'" width="'+w+'" height="'+h+'" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="true" ></iframe>';
		str+='</div>';
		cont.innerHTML=str;
		return {tab:tab,cont:cont};
	};