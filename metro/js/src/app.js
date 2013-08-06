
	var spotDiameter=25;

	var insApp = {

		adApp   : function(obj){	// 推广

			if(!config.showFootAd||obj.adsData.badsSpot.length===0)
				return;
			obj.createNavItem('ad','推广');		//创建nav-item

			var data=obj.adsData,
				app=data.badsSpot[0],
				ad=document.createElement('div'),
				redUrl,
				str="",
				w=sizeList[config.sizeNum*2],
				h=sizeList[config.sizeNum*2+1];
				ad.className="content-item ad-item";

			if(app.adClickMonitorUrl){	//增加第三方点击监控
				var monitorUrl=app.adClickMonitorUrl+encodeURIComponent(app.adsLinkUrl||'');
				redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(monitorUrl));
			}else{
				redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl||''));
			}
			if(app.adsType==3){      //图片广告
				str='<a class="ad-thumb" target="_blank" href="'+redUrl+'"><img src="'+app.adsPicUrl+'" alt=""/></a>';
			}else if(app.adsType==9){	//flash广告
				str+='<object id="afg-adloader" width="'+w+'" height="'+h+'"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
				str+='<param value="always" name="allowScriptAccess"/><param value="'+app.adsPicUrl+'" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality"><param value="#F1F1F1" name="bgcolor"/>';
				str+='<embed width="'+w+'" height="'+h+'" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque"  bgcolor="#F1F1F1" quality="high" src="'+app.adsPicUrl+'"></object>';
				str+='<a class="ad-flashcover" href="'+redUrl+'" target="_blank"></a>';
			}else if(!app.adsLinkUrl&&app.description){   //谷歌广告
				var frame='<iframe src="'+app.description+'" scrolling="no" height="'+app.adsHeight+'" width="'+app.adsWidth+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
				str+='<i class="small-info"></i>'+frame;
			}
			ad.innerHTML=str;
			obj.content.appendChild(ad);	//插入ad到content
		},

		shopApp : function(obj){	// 折扣
			if(!config.showAd||obj.adsData.adsSpot.length===0)
				return;

			var data=obj.adsData,
				shop=document.createElement('div'),
				list=document.createElement('div'),
				slider=document.createElement('ul'),
				redUrl,
				title,
				price,
				imgUrl,
				nick,
				app,
				spot;

			obj.createNavItem('shop','折扣');	 //创建nav-item
			shop.className="content-item shop-item";
			list.className="album-list";
			slider.className="slider-nav";
			for(var i=0,len=data.adsSpot.length;i<len;i++){

				var album=document.createElement("a");
				app = data.adsSpot[i];
				redUrl=config.redurl+"?tty=0&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
				title=app.adsTitle;
				nick = app.nick;
				price=app.adsDiscount||app.adsPrice;
				imgUrl=app.adsPicUrl.replace("160x160",sizeList[config.sizeNum*2]+"x"+sizeList[config.sizeNum*2]);

				album.className="product-album";album.target="_blank";album.href=redUrl;
				album.innerHTML='<img alt="'+title+'" src="'+imgUrl+'"><span class="product-info"><em class="price">￥'+price+'</em><em class="name">'+title+'</em><em class="nick">'+nick+'</em>';
				if(len>1){
					slider.innerHTML+='<li class="switch-trigger" index="'+i+'"></li>';
				}
				list.appendChild(album);
				spot=createSpot({metrix:app.metrix,type:'shop',index:data.index,order:i});	//创建spot
				obj.spotsArray.push(spot);	//添加到spot数组
				spotBox.appendChild(spot);
			}
			shop.appendChild(list);
			shop.appendChild(slider);
			list.firstChild.className+=" selected";
			if(slider.firstChild)
				slider.firstChild.className+=" selected";
			obj.content.appendChild(shop);

			slider.onmouseover=function(e){	// 为slider-nav绑定事件
				var event=ev.getEvent(e),
					tar=ev.getTarget(event),
					selected=ev.$(this,'selected')[0],
					w=parseFloat(css(list.firstChild).get('width'));

				if(tar.className=="switch-trigger"){
					selected.className="switch-trigger";
					tar.className+=" selected";
					var end=-parseInt(tar.getAttribute("index"),10)*w;
					Animate(list).animate({'left':end},function(){
						obj.recordWatch();
					});
				}
			};
		},

		weiboApp : function(obj){	// 微博
			if(!config.showWeibo||obj.adsData.weiboSpot.length===0)
				return;
			obj.createNavItem('weibo','微博');
			var data=obj.adsData,
				weibo=document.createElement("div"),
				list=document.createElement('ul'),
				str="",
				avatar,
				icon,
				title,
				article,
				spot,
				redUrl,
				cn='';
			weibo.className="content-item weibo-item";
			list.className="ins-weibo-list";

			for(var i=0,len=data.weiboSpot.length;i<len;i++){
				var app=data.weiboSpot[i],
					arr=app.avatar.split('/');
				for(var j=0,l=arr.length;j<l;j++){
					if(arr[j]==50)arr[j]=180;
				}
				cn=i==len-1?'last':'';
				avatar=arr.join('/');
				icon=app.icon;
				title=app.title;
				article=app.latestStatus;
				redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&rurl="+encodeURIComponent(encodeURIComponent(app.userUrl));
				str+='<li class="'+cn+'"><a href="'+redUrl+'" target="_blank" class="ins-weibo-avatar" title="'+title+'"><img src="'+avatar+'"/></a><div class="ins-weibo-main"><p class="name"><a href="'+redUrl+'" target="_blank">'+title+'</a><a class="ins-weibo-icon" href="'+redUrl+'" target="_blank"><img src="'+icon+'"></a></p><p class="content">'+article+'</p></li>';
				spot=createSpot({metrix:app.metrix,type:'weibo',index:data.index,order:i});	//创建spot
				obj.spotsArray.push(spot);	//添加到spot数组
				spotBox.appendChild(spot);
			}

			list.innerHTML=str;
			weibo.appendChild(list);
			obj.content.appendChild(weibo);
		},

		wikiApp  : function(obj){	// 百科

			if(!config.showWiki||obj.adsData.wikiSpot.length===0)
				return;
			obj.createNavItem('wiki','百科');

			var data=obj.adsData,
				wiki=document.createElement("div"),
				list=document.createElement('ul'),
				str="",
				avatar,
				title,
				article,
				spot,
				redUrl,
				cn='';
			wiki.className="content-item wiki-item";
			list.className="ins-wiki-list";
			for(var i=0,len=data.wikiSpot.length;i<len;i++){
				var app=data.wikiSpot[i];
				cn=i==len-1?'last':'';
				avatar=app.firstimg||"";
				title=app.title;
				article=app.summary;
				redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.url));
				str+='<li class="'+cn+'"><div class="ins-wiki-nav"><a href="'+redUrl+'" class="avatar" title="'+title+'" target="_blank"><img src="'+avatar+'"/></a><p><span>'+title+'</span></p></div><div class="ins-wiki-main"><p class="summary"><span>'+article+'</span></p></li>';
				spot=createSpot({metrix:app.metrix,type:'wiki',index:data.index,order:i});	//创建spot
				obj.spotsArray.push(spot);	//添加到spot数组
				spotBox.appendChild(spot);
			}

			list.innerHTML=str;
			wiki.appendChild(list);
			obj.content.appendChild(wiki);

		},

	    newsApp  : function(obj){	// 新闻

			if(!config.showNews)
				return;
			var data=obj.adsData,
				w=config.width,
				h=config.height,
			newsUrl=prefix+"news?size="+w+"&pd="+data.widgetSid+"&muh="+data.imageUrlHash;
			createThirdApp(obj,{name:'news',title:'新闻',url:newsUrl});
	    },

	    weatherApp : function(obj){	//天气
			if(!config.showWeather)
				return;
			createThirdApp(obj,{name:'weather',title:'天气',height:200,url:'http://www.thinkpage.cn/weather/weather.aspx?uid=&cid=101010100&l=zh-CHS&p=TWC&a=1&u=C&s=1&m=0&x=1&d=3&fc=&bgc=&bc=&ti=1&in=1&li=2&ct=iframe'});
	    }

	};

	var createThirdApp=function(obj,app){	//生成第三方app
		obj.createNavItem(app.name,app.title);
		var appElem=document.createElement("div"),
			w=app.width||config.width,
			h=app.height||config.height,
			appUrl=app.url;
		appElem.className="content-item "+app.name+"-item";
		appElem.innerHTML='<iframe name="ins-app-'+app.name+'" src="'+appUrl+'" width="'+w+'" height="'+h+'" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="true" ></iframe>';
		obj.content.appendChild(appElem);
	};

	var createSpot=function(app){	//创建spot
		var type=app.type,
			index=app.index,
			metrix=app.metrix,
			order=app.order,
			diameter=spotDiameter;

		var	spot=document.createElement("a");
		spot.className="ins-spot ins-"+type+"-spot";
		spot.href="javascript:;";
		spot.index=index;
		spot.target="_self";
		spot.style.cssText+=';width:'+diameter+'px;height:'+diameter+'px;';
		spot.metrix=metrix;
		spot.appType=type;
		spot.orderNum=order;
		return spot;
	};

	var slideTo = function(spot){
		if(spot.className=="switch-trigger"){
			selected.className="switch-trigger";
			spot.className+=" selected";
			var end=-parseInt(spot.orderNum,10)*w;
			Animate(list).animate({'left':end},function(){
				obj.recordWatch();
			});
		}
	};