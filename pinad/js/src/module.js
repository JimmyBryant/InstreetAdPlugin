//InstreetAd Class
var spot_index=29999999;
var InstreetAd=function(data){
	var img=imgs[data.index];
	this.data=data;
	this.originInfo={width:img.clientWidth,height:img.clientHeight,src:img.src,pos:ev.getXY(img)};
	this.img=img;
	this.init();
};
InstreetAd.prototype={
	constructor:InstreetAd,
	init :function(){
		var _=this;
		_.createAll();
		_.locate();
		_.bindEvents();
	},
	createAll  :function(){
		var _=this,boxWrapper=document.createElement("div"),spotHolder=document.createElement("div");
		boxWrapper.className="instreet-box-wrapper";
		spotHolder.className="spot-holder";
		instreet.container.appendChild(boxWrapper);
		boxWrapper.appendChild(spotHolder);
		_.boxWrapper=boxWrapper;
		_.spotHolder=spotHolder;
		// _.createIconsHolder();
		_.createSpots();
		_.createAd();

	},
	locate  :function(){
		var _=this,spots=_.spotHolder.children,
			icons=_.icons,
			ad=_.ad,
			img=_.img,pos=ev.getXY(img),
			icons_left,
			icons_top,
			imgW=img.offsetWidth,
			imgH=img.offsetHeight,
			r=15,
			pad=2;

		if(ad){	// locate底部广告
			var adW=ad.lastChild.offsetWidth,adH=100;
			var dis=ad.style.display?'display:'+ad.style.display+';':'';
			ad.style.cssText=dis+"left:"+(pos.x+(imgW-adW)/2)+"px;top:"+(pos.y+imgH-adH)+"px;width:"+adW+"px;height:"+adH+"px";
		}
		for(var len=spots.length,i=0;i<len;i++){	//定位spot
			var spot=spots[i],
				coor=_.getCoor(spot);
			spot.style.cssText="top:"+(coor.top-r)+"px;left:"+(coor.left-r)+"px;";
		}
	},
	detect   :function(){	//每隔一段时间开始检测图片对象是否change

		var _=this,
			img=_.img,
			origin=_.originInfo,
			side=_.sideWrapper,
			pos=ev.getXY(img);

        if(img.src&&img.src!=origin.src){
            var parent=side.parentNode||document.body;
            parent.removeChild(side);
            cache.onImgLoad(img);
            origin.src=img.src;
        }
        else if(img.clientWidth!=origin.width||img.clientHeight!=origin.height){
			if(img.clientWidth===0||img.clientHeight===0){
				var images=document.images;
				for(var i=images.length;i--;){
					if(images[i].src==img.src&&img!==images[i]){
						images[i].insId=img.insId;
						_.img=images[i];
					}
				}
			}
			_.locate();

        }else if(pos.x!==origin.pos.x||pos.y!==origin.pos.y){

				origin.pos=pos;
				_.locate();
        }

	},
	bindEvents :function(){
		var _=this,
			box=_.boxWrapper,
			img=_.img,
			ad=_.ad,
			spotHolder=_.spotHolder;

		//adbox onclick
		if(typeof ad!="undefined"){
			ad.onclick=function(e){
				var event=ev.getEvent(e),tar=ev.getTarget(event);
				if(tar.className=="button-close-ad"){
					_.adClosed=false;
					_.hideAd();
				}
			};
			ad.onmouseover=function(e){
				var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);
				if(!this.contains(rela)){
					_.recordWatch(this);
				}
			};
		}

		//box mouseover
		box.onmouseover=function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			!_.stopMouseover&&_.showSpots();
			if(rela!==img){
				!_.stopMouseover&&_.showAd();
			}
		};
		//box mouseout
		box.onmouseout=function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			_.hideSpots();
			if(!instreet.container.contains(rela)&&rela!==img){
				_.hideAd();
			}
		};


		//img mouseover
		ev.bind(img,"mouseover",function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			!_.stopMouseover&&_.showSpots();
			if(!instreet.container.contains(rela)){
				_.recordShow(10);
				!_.stopMouseover&&_.showAd();
			}
		});
		//img mouseout
		ev.bind(img,"mouseout",function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			_.hideSpots();

			if(!instreet.container.contains(rela)){
				instreet.hideApps();
				_.hideAd();
			}

		});
		//spotsHolder mouseover
		spotHolder.onmouseover=function(e){
			var event=ev.getEvent(e),
				tar=ev.getTarget(event);
			if(tar.className=="instreet-spot-shop"&&instreet.shop.display!=="block"){
				_.recordShow(9,tar);
			}
			var f=$('ins-spot-focus');
			if(f){
				if(f===tar)
					return;
				f.id='';
			}
			instreet.hideApps();
			_.showApp(tar);
			tar.id='ins-spot-focus';
		};


	},
	createIconsHolder:function(){	//创建尚街图标
		var div=document.createElement("div"),str='';
		div.className="icons-holder";
		str='<a class="icon-logo" href="javascript:;" title="尚街网"></a><dl class="tool-bar"><dd><a class="icon-meiding" target="_blank" href="http://www.imeiding.com?ufrom=ad"></a></dd><dd><a class="icon-share" href="javascript:;" title="分享"></a><div class="instreet-share-icons right" instreet-img-id="5"><a class="instreet-sina" title="分享到新浪微博" href="javascript:;"></a><a class="instreet-renren" href="javascript:;" title="分享到人人网"></a><a class="instreet-tx" title="分享到腾讯微博" href="javascript:;"></a></div></dd><dd><a class="icon-logo" href="javascript:;" title="尚街网"></a></dd></dl>';
		div.innerHTML=str;
		this.boxWrapper.appendChild(div);
		this.icons=div;
	},
	createSpots  :function(){	//创建一张图片的所有spots

		var _=this,
			container=instreet.container,
			data=_.data,
			index=parseInt(data.index,10),
			wrapper=_.wrapper,
			metrixArray=[],
			i,
			len,
			w,
			spot;
		if(config.showAd){               //创建adSpot
			for(i=0,len=data.adsSpot.length;i<len;i++){
				var ad=data.adsSpot[i];
				metrixArray.push(parseInt(ad.metrix,10));
			}
			metrixArray=ev.aTrim(metrixArray);            //数组去重
			for(i=0,len=metrixArray.length;i<len;i++){
				w=data.adsSpot[0].width;
				_.createSpot({metrix:metrixArray[i],width:w},"shop");
			}
		}
		if(config.showWeibo){              //创建weiboSpot
			for(i=0,len=data.weiboSpot.length;i<len;i++){
				w=data.weiboSpot[0].width;
				_.createSpot({metrix:data.weiboSpot[i].metrix,width:w},"weibo");
			}
		}
		if(config.showWiki){              //创建wikiSpot
			for(i=0,len=data.wikiSpot.length;i<len;i++){
				w=data.wikiSpot[0].width;
				_.createSpot({metrix:data.wikiSpot[i].metrix,width:w},"wiki");
			}
		}

	},
	createSpot: function(obj,type){        //创建spot

	  if(type&&obj){
		   var spot=document.createElement('a');
		   spot.className="instreet-spot-"+type;
		   spot.href="javascript:;";
		   spot.metrix=obj.metrix;
		   spot.originWidth=obj.width;
		   this.spotHolder.appendChild(spot);
	   }

	},
	getSpotByMetrix: function(metrix){	//查找spot
		var spots=this.spotsHolder.children,
			len=spots.length;

		for(var i=0;i<len;i++){
			if(spots[i].metrix==metrix){
				return spots[i];
			}
		}
		return null;
	},
	createAd :function(){
		var _=this,
			data=_.data,
			index=data.index,
			img=_.img,
			pos=ev.getXY(img),
			height=img.offsetHeight,
			width=img.offsetWidth,
			h=100,
			w=300,
			str='';
        if(config.showFootAd&&data.badsSpot.length>0){

			var app=data.badsSpot[0],
				ad=document.createElement('div'),
				aw=!!app.adsWidth?app.adsWidth+"px;":"auto;",
				ah=!!app.adsHeight?app.adsHeight+"px;":"auto;",
				monitorUrl;

			ad.className='ad-holder';
			str='<div class="ad-cont" style="width:'+aw+'height:'+ah+'"><a class="button-close-ad" title="关闭" href="javascript:;">×</a>';

			//增加第三方点击监控
			if(app.adClickMonitorUrl){
				ad.notAllowShow=true;
				monitorUrl=app.adClickMonitorUrl+encodeURIComponent(app.adsLinkUrl||'');
			}
			redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(monitorUrl||app.adsLinkUrl||''));

			if(app.adsType=='3'){
				str+='<a href="'+redUrl+'" class="imgbox" target="_blank"><img class="adimg" src="'+app.adsPicUrl+'" alt=""/></a>';
			}else if(app.adsType=='8'){
				str+="<img src='"+app.adsPicUrl+"'  media-src='"+app.description+"' class='instreet-video-trigger' alt='' style='cursor:pointer;'/>";
			}else if(app.adsType=='9'){
				str+="<a href='"+redUrl+"' target='_blank'><embed wmode='transparent' width='300' height='100'  src='"+app.adsPicUrl+"' type='application/x-shockwave-flash'></embed></a>";
			}else if(app.adsType=='2'){
			    h=35;
				w=width-32;
				var urlArr=app.adsPicUrl.split(','),pt=30;
				ad.setAttribute("width",w);
				ad.setAttribute("height",h+pt);
			    ad.style.cssText="width:"+w+"px;height:"+h+"px;left:"+pos.x+"px;top:"+(pos.y+height-h-pt)+"px;padding-top:30px;";
			    if(w>375){
				str+="<a href='"+redUrl+"' class='black-bg' target='_blank'><img class='sprite1' src='"+(urlArr[0]||"")+"' alt=''/><span class='slogan'><p class='light'>"+footAd.adsTitle+"</p><p>更多精彩»</p></span></a>";
				}else{
				str+="<a href='"+redUrl+"' class='black-bg' target='_blank'><span class='slogan'><p class='light'>"+footAd.adsTitle+"</p><p>更多精彩»</p></span></a>";
				}
			}else if(!app.adsLinkUrl&&app.description){
				str+='<iframe src="'+app.description+'" scrolling="no" height="'+app.adsHeight+'" width="'+app.adsWidth+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
			}


			str+="</div>";
			ad.innerHTML=str;
			_.boxWrapper.appendChild(ad);
			_.ad=ad;
			if(app.adsType==3)
				InstreetAd.getImageAd(app.adsPicUrl,_);
		}
	},
	getCoor  :function(spot){

        var _=this,
			img=_.img,
			metrix=spot.metrix,
			ox=metrix%3000,
		    oy=Math.round(metrix/3000),
		    w=spot.originWidth,
		    zoomNum=img.width/w,
		    x=ox*zoomNum,
		    y=oy*zoomNum,
		    pos=ev.getXY(img);

		return {top:(y+pos.y),left:(x+pos.x)};

	},
	showSpots   :function(){
		var _=this,
			spots=_.spotHolder;
			// icons=_.icons;
		// show(icons.lastChild);
		// icons.style.zIndex=100000;
		spots.children.length&&show(spots.children);
		if($('ins-spot-focus')){
			$('ins-spot-focus').style.zIndex=spot_index;
		}
	},
	hideSpots   :function(){
		var _=this,
			spots=_.spotHolder;
			// icons=_.icons;
		// hide(icons.lastChild);
		// icons.style.zIndex=99999;
		spots.children.length&&hide(spots.children);
		if($('ins-spot-focus')){
			$('ins-spot-focus').style.zIndex=0;
		}
	},
	showAd   :function(){
		var _=this,
			ad=_.ad,
			img=_.img,
			pos=ev.getXY(img),
			imgW=img.offsetWidth,
			imgH=img.offsetHeight;
		if(ad){
			if(ad.notAllowShow){
				return;
			}
			if(ad.style.display!="block"){
				show(ad);
				var adW=ad.lastChild.offsetWidth,
					adH=100;
				ad.style.cssText="display:block;left:"+(pos.x+(imgW-adW)/2)+"px;top:"+(pos.y+imgH-adH)+"px;width:"+adW+"px;height:"+adH+"px";
				if(!_.slider||_.slider.height<=0){  //如果不存在slider对象则初始化一个
					_.adClosed=true;
					_.slider=new slider(ad.lastChild);
				}
				if(_.adClosed){
					_.slider.stop();
					_.slider.slideDown();
				}
			}
		}
	},
	hideAd       :function(){
		var _=this,ad=_.ad;
		if(ad&&ad.style.display=="block"){
			_.slider.stop();
			_.slider.slideUp(function(){hide(ad);_.adClosed=true;});
		}
	},
	showApp  :function(tar){
		var _=this,
			data=_.data,
			cn=tar.className.split(' ')[0],
			appBox=null,
			metrix=tar.metrix,
			headIntro='',
			headOutro='',
			str="",
			i=0,
			len=0,
			pos={x:parseFloat(tar.style.left),y:parseFloat(tar.style.top)},
			size=15,
			app,
			redUrl='';

		headIntro="<div class='cont-head'>";
		headOutro="<a class='button-close-holder' href='javascript:;' title='关闭'>×</a></div>";

		switch(cn){
			case "instreet-spot-shop":
				var adId=0,
					rightStr='',
					leftStr='',
					leftClass='left',
					priceStr='';
				appBox=instreet.shop;
				if(appBox.metrix==metrix){	//app已经展示则跳出
					break;
				}
				appBox.metrix=metrix;
				len=data.adsSpot.length;
				appBox.insId=_.img.insId;   //标记app属于哪张图片
			    for(i=0;i<len;i++){

				    app=data.adsSpot[i];
					var	discount=app.adsDiscount,
						price=app.adsPrice;
					redUrl=config.redurl+"?tty=0&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
					if(app.metrix==metrix){

						if(price!==undefined&&price!==null){
							priceStr=app.adsDiscount&&parseFloat(discount)<parseFloat(price)?'<p class="p-money">原价：<em>￥'+price+'</em></p>':'';
							rightStr="<div class='right'>"+priceStr+"<p class='p-nowmoney'>现价：<em>￥"+(discount||price)+"</em></p><p class='p-buyit'><a class='button-buy' href='"+redUrl+"' target='_blank'></a></p></div>";
						}else{	//不存在价格则展示产品图片
							leftClass='product-large-image';
						}
						leftStr='<div class="'+leftClass+'"><a class="thumb" target="_blank" href="'+redUrl+'"><img src="'+app.adsPicUrl+'"/></a></div>';
						str+=headIntro+'<div class="h1-title"><a class="p-name" target="_blank" href="'+redUrl+'">'+app.adsTitle+'</a></div>'+headOutro;
						str+='<div class="cont-body clearfix" id="instreet-shop-focus" adsid="'+app.adsId+'" index="'+adId+'">'+leftStr+rightStr+'</div>';

				    }

				 }
				appBox.innerHTML=str;
				break;

			case "instreet-spot-weibo":
				appBox=instreet.weibo;
				if(appBox.metrix==metrix){	//app已经展示则跳出
					break;
				}
				appBox.metrix=metrix;
				appBox.insId=_.img.insId;
				len=data.weiboSpot.length;
			    for(i=0;i<len;i++){
					app=data.weiboSpot[i];
					var title=app.title,
						nickName=app.nickName,
						icon=app.icon,
						avatar=app.avatar,
						latestStatus=app.latestStatus;
					redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.userUrl));
				if(app.metrix==metrix){
				  str=headIntro+'<a class="thumb" target="_blank" href="'+redUrl+'" ><img src="'+avatar+'"/></a><div class="head-right"><a class="nickname" target="_blank" href="'+redUrl+'"">'+nickName+'</a><div class="icon"><a target="_blank" href="'+redUrl+'" title="'+nickName+'的微博"><img src="'+icon+'"/></a></div></div>'+headOutro;
				  str+='<div class="cont-body clearfix"><p class="summary">'+latestStatus+'</p></div>';
			    }
			   }
			   appBox.innerHTML=str;
			   break;

		   case "instreet-spot-wiki":
			    appBox=instreet.wiki;
				if(appBox.metrix==metrix){	//app已经展示则跳出
					break;
				}
				appBox.metrix=metrix;
				appBox.insId=_.img.insId;
				len=data.wikiSpot.length;
				for(i=0;i<len;i++){
					app=data.wikiSpot[i];
					var keywords=app.title,
						firstimg=app.firstimg,
						summary=app.summary;
					redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(keywords))+"&rurl="+encodeURIComponent(encodeURIComponent(app.url));
			     if(app.metrix==metrix){
			     str=headIntro+'<div class="h1-title"><a class="nickname" target="_blank" href="'+redUrl+'">'+keywords+'</a></p></div>'+headOutro;
				 str+="<div class='cont-body'><div class='left'><a class='thumb' target='_blank' href='"+redUrl+"' ><img src='"+firstimg+"'/></a></div><div class='right'><p class='summary'>"+summary+"</p><p class='icon'><a target='_blank' href='"+redUrl+"' title='互动百科'><img src='http://static.instreet.cn/widgets/push/images/icon-baike.png'/></a></p></div></div>";
				 }
			   }
			   appBox.innerHTML=str;
		   break;

		}
		appBox.style.cssText="left:"+(pos.x+size)+"px;top:"+(pos.y+size)+"px;display:block;";
	}

};

//static method

InstreetAd.reLocate =function(){                   //重新定位广告

   var adsArray=cache.adsArray;

   for(var i in adsArray){

      var adObj=adsArray[i];
      adObj.locate&&adObj.locate();

    }
};

InstreetAd.getImageAd=function(url,obj){
	var image=new Image(),
		ad=obj.ad,
		cont=ad.lastChild;
	image.src=url;
	var loaded=function(){
		var img=this,
			maxH=100,
			h=img.height<=maxH?img.height:maxH,
			w=Math.round(img.width*(h/img.height)),
			adImg=cont.getElementsByTagName('img')[0],
			styleStr='width:'+w+'px;height:'+h+'px;display:block;';
		cont.style.cssText=styleStr;
		if(adImg){
			adImg.style.cssText=styleStr;
		}
		ad.notAllowShow=false;
		if(instreet_config.footAuto){
			obj.showAd();
		}
	};
	if(image.complete){
		loaded.call(image);
		return;
	}
	image.onload=function(){
		image.onload=null;
		loaded.call(image);
	};
};