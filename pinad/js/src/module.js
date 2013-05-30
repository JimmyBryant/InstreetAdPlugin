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
			imgH=img.offsetHeight,pad=2;
        // var dis=_.data.badsSpot.length?"none":"block";
  //       if(config.position==1){    //logo图标放在左侧
  //       	icons_left=pos.x+pad+"px;";
  //       }else if(config.position==0){	//logo图标放在右侧
  //       	icons_left=pos.x+imgW-icons.offsetWidth-pad+"px;";
  //       }				
		// icons_top=pos.y+imgH-icons.offsetHeight+"px;";					
		// icons.style.cssText="left:"+icons_left+"top:"+icons_top+"display:"+dis;
						
		if(ad){	// locate底部广告
			var adW=ad.lastChild.offsetWidth,adH=100;
			var dis=ad.style.display?'display:'+ad.style.display+';':'';
			ad.style.cssText=dis+"left:"+(pos.x+(imgW-adW)/2)+"px;top:"+(pos.y+imgH-adH)+"px;width:"+adW+"px;height:"+adH+"px";
		}
		for(var len=spots.length,i=0;i<len;i++){               //定位spot
			var spot=spots[i];
			var coor=_.getCoor(spot);
			spot.style.cssText="top:"+coor.top+"px;left:"+coor.left+"px;";
		}
	},
	detect   :function(){                     //每隔一段时间开始检测图片对象是否change

        var _=this,img=_.img,origin=_.originInfo,
        	side=_.sideWrapper,pos=ev.getXY(img);

        if(img.src&&img.src!=origin.src){
            var parent=side.parentNode||document.body;
            parent.removeChild(side);
            cache.onImgLoad(img);
            origin.src=img.src;
        }
        else if(img.clientWidth!=origin.width||img.clientHeight!=origin.height){
        		if(img.clientWidth==0||img.clientHeight==0){
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
			// icons=_.icons,
			// shareIcon=icons.lastChild.children[1];
		//box onclick
		/*
		box.onclick=function(e){
			var event=ev.getEvent(e),tar=ev.getTarget(event);
			if(tar.className=="icon-logo"){
				if(_.stopMouseover){
					_.showWidget();
					_.stopMouseover=false;
				}else{
					_.hideWidget();
					instreet.hideApps();
					_.hideAd();
					_.stopMouseover=true;
				}
			}else if(tar.parentNode.className.match("instreet-share-icons")){

		  		 var img=_.img,data=_.data,picUrl=encodeURIComponent(img.src),shareTo=tar.className.replace("instreet-",""),widgetSid=data.widgetSid,
		  		     url=encodeURIComponent(location.href),title=encodeURIComponent(document.title),				  		 	
		  		     recordUrl=config.surl+"?content=''&imgUrl="+picUrl+"&widgetSid="+widgetSid+"&pageUrl="+url+"&shareTo="+shareTo;
		  		 ev.importFile('js',recordUrl);  //record share click 
				 var winStr="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500";
				 switch(tar.className){
				    case "instreet-sina": 
					window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
                    break;
                    case "instreet-renren":
					window.open('http://share.renren.com/share/buttonshare.do?link='+url,"_blank",winStr);
					break;
                    case "instreet-tx"   :
					window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
					break;
				}
			}
		};
		
		//share icon mouseover
		shareIcon.onmouseover=function(){
			show(this.lastChild);
		};	
		share icon mouseout
		shareIcon.onmouseout=function(){
			hide(this.lastChild);
		};	
		*/
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
			}
		};
		
		//box mouseover
		box.onmouseover=function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			!_.stopMouseover&&_.showWidget();
			if(rela!==img){
				!_.stopMouseover&&_.showAd();
			}
		};
		//box mouseout
		box.onmouseout=function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			_.hideWidget();
			if(!instreet.container.contains(rela)&&rela!==img){
				_.hideAd();
			}
		};


		//img mouseover
		ev.bind(img,"mouseover",function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);	
			!_.stopMouseover&&_.showWidget();			
			if(!instreet.container.contains(rela)){
				_.recordShow(10);
				!_.stopMouseover&&_.showAd();
			}
		});
		//img mouseout
		ev.bind(img,"mouseout",function(e){
			var event=ev.getEvent(e),
				rela=ev.getRelatedTarget(event);
			_.hideWidget();

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
	createIconsHolder:function(){                      //创建尚街图标
		var div=document.createElement("div"),str='';
		div.className="icons-holder";
		str='<a class="icon-logo" href="javascript:;" title="尚街网"></a><dl class="tool-bar"><dd><a class="icon-meiding" target="_blank" href="http://www.imeiding.com?ufrom=ad"></a></dd><dd><a class="icon-share" href="javascript:;" title="分享"></a><div class="instreet-share-icons right" instreet-img-id="5"><a class="instreet-sina" title="分享到新浪微博" href="javascript:;"></a><a class="instreet-renren" href="javascript:;" title="分享到人人网"></a><a class="instreet-tx" title="分享到腾讯微博" href="javascript:;"></a></div></dd><dd><a class="icon-logo" href="javascript:;" title="尚街网"></a></dd></dl>';
		div.innerHTML=str;
		this.boxWrapper.appendChild(div);
		this.icons=div;
	},
	createSpots  :function(){                 //创建一张图片的所有spots
	  
	    var _=this,container=instreet.container,data=_.data,
		    index=parseInt(data.index),wrapper=_.wrapper,w,
		    metrixArray=[],i,len,w,spot;
		if(config.showAd){               //创建adSpot	
			for(i=0,len=data.adsSpot.length;i<len;i++){
				var ad=data.adsSpot[i];
				metrixArray.push(parseInt(ad.metrix));						
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
		var _=this,data=_.data,index=data.index,img=_.img,
			pos=ev.getXY(img),height=img.offsetHeight,width=img.offsetWidth,
	   	   h=100,w=300,str='';
        if(config.showFootAd&&data.badsSpot.length>0){   

		      var app=data.badsSpot[0],ad=document.createElement('div'),
		      	  aw=!!app.adsWidth?app.adsWidth+"px;":"auto;",ah=!!app.adsHeight?app.adsHeight+"px;":"auto;";
			  
			  ad.className='ad-holder';
			  str='<div class="ad-cont" style="width:'+aw+'height:'+ah+'"><a class="button-close-ad" title="关闭" href="javascript:;">×</a>';
			
			  //增加第三方点击监控
			  var monitorUrl; 
			  if(app.adClickMonitorUrl){
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
			  }	else if(!app.adsLinkUrl&&app.description){
				str+='<iframe src="'+app.description+'" scrolling="no" height="'+app.adsHeight+'" width="'+app.adsWidth+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
			  }
				  

			  str+="</div>";
			  ad.innerHTML=str;
		   	  _.boxWrapper.appendChild(ad);
		   	  _.ad=ad;
		}
	},
	getCoor  :function(spot){

        var _=this,img=_.img,
				metrix=spot.metrix,ox=metrix%3000,
		    oy=Math.round(metrix/3000),w=spot.originWidth,zoomNum=img.width/w,
		    x=ox*zoomNum,y=oy*zoomNum,pos=ev.getXY(img);	

		return {top:(y+pos.y),left:(x+pos.x)};	
        
	},
	showWidget   :function(){
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
	hideWidget   :function(){
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
		if(ad&&ad.style.display!="block"){
			show(ad);
			var adW=ad.lastChild.offsetWidth,
				adH=100;
			ad.style.cssText="display:block;left:"+(pos.x+(imgW-adW)/2)+"px;top:"+(pos.y+imgH-adH)+"px;width:"+adW+"px;height:"+adH+"px";
			if(!_.slider){  //如果不存在slider对象则初始化一个
				_.adClosed=true;
				_.slider=new slider(ad.lastChild);
			}
			if(_.adClosed){
				_.slider.stop();
				_.slider.slideDown();
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
			headOutro=''
			str="",			
			pos={x:parseFloat(tar.style.left),y:parseFloat(tar.style.top)},
			size=13;

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
				appBox.insId=_.img.insId;   //标记app属于哪张图片
			    for(var i=0,len=data.adsSpot.length;i<len;i++){

				    var app=data.adsSpot[i],
				    	discount=app.adsDiscount,
				    	price=app.adsPrice,						
					    redUrl=config.redurl+"?tty=0&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
				    if(app.metrix==metrix){

				    	if(price!=undefined&&price!=null){	
				    		priceStr=app.adsDiscount&&parseFloat(discount)<parseFloat(price)?'<p class="p-money">原价：<em>￥'+price+'</em></p>':'';				    		
				    		rightStr="<div class='right'>"+priceStr+"<p class='p-nowmoney'>现价：<em>￥"+(discount||price)+"</em></p><p class='p-buyit'><a class='button-buy' href='"+redUrl+"' target='_blank'>购买</a></p></div>";	
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
			    for(var i=0,len=data.weiboSpot.length;i<len;i++){
			     var app=data.weiboSpot[i],
				     title=app.title,
					 nickName=app.nickName,
					 icon=app.icon,
					 avatar=app.avatar,
					 latestStatus=app.latestStatus,
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
				for(var i=0,len=data.wikiSpot.length;i<len;i++){
			     var app=data.wikiSpot[i],
				     title=app.title,
					 firstimg=app.firstimg,
					 summary=app.summary,
				     redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.url));
			     if(app.metrix==metrix){
			     str=headIntro+'<div class="h1-title"><a class="nickname" target="_blank" href="'+redUrl+'">'+title+'</a></p></div>'+headOutro;
				 str+="<div class='cont-body'><div class='left'><a class='thumb' target='_blank' href='"+redUrl+"' ><img src='"+firstimg+"'/></a></div><div class='right'><p class='summary'>"+summary+"</p><p class='icon'><a target='_blank' href='"+redUrl+"' title='互动百科'><img src='http://static.instreet.cn/widgets/push/images/icon-baike.png'/></a></p></div></div>";
				 }
			   }
			   appBox.innerHTML=str;
		   break;
		
		}
		appBox.style.cssText="left:"+(pos.x+size)+"px;top:"+(pos.y+size)+"px;display:block;";							
	},
   //鼠标移动到图片的时候发送展现记录
   recordShow: function(flag,spot){  

       var _=this,data=_.data,img=_.img,
		   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
		   iu=encodeURIComponent(encodeURIComponent(img.src));
		var adsId="",adsType="",mx="";
		if(flag==9&&spot){
			var metrix=spot.metrix;
			for(var i=0,len=data.adsSpot.length;i<len;i++){
				var app=data.adsSpot[i];
				if(app.metrix==metrix){
					adsId+=adsId==""?app.adsId:","+app.adsId;
					adsType+=adsType==""?app.adsType:","+app.adsType;
					mx=app.metrix;
				}
			}
		}else if(flag==10&&_.ad){
			var app=data.badsSpot[0];
			adsId=app.adsId;
			adsType=app.adsType;
		}

		var time=new Date().getTime();  
		ul+="?pd="+pd+"&muh="+muh+"&mx="+mx+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
		ev.importFile('js',ul);
		//增加第三方广告展现统计
		!spot&&data.badsSpot[0]&&data.badsSpot[0].adViewMonitorUrl&&ev.importFile('js',data.badsSpot[0].adViewMonitorUrl+"?time="+time);
				   
   },
   //鼠标移动到广告或者微博、百科上发送行为记录
      recordWatch:function(tar){   		       

	      var  _=this,data=_.data,
	      	   img=_.img,
			   iu=encodeURIComponent(encodeURIComponent(img.src)),
			   pd=data.widgetSid,
			   ul=config.murl,
			   mid=data.imageNumId||'',
			   muh=data.imageUrlHash,
			   adData,
			   ad='',
			   at='',
			   tg='',
			   ift=0,
			   tty=1,
			   mx='';
            var cn=tar.className.replace("-holder","");

            if(cn=="shop"){
               var metrix=instreet.shop.metrix;
               for(var i=0,len=data.adsSpot.length;i<len;i++){
               	   var app=data.adsSpot[i];
               	   if(app.metrix==metrix){
               	   		ad+=ad==""?app.adsId:","+app.adsId;
               	   		at+=at==""?app.adsType:","+app.adsType;
               	   }
               }
			   tty=0;
			   mx=metrix;
			}else if(cn=="weibo"){
			   ift=2;
			   var metrix=instreet.weibo.metrix;
               for(var i=0,len=data.weiboSpot.length;i<len;i++){
               	   var app=data.weiboSpot[i];
               	   mx=metrix;
               	   // if(app.metrix==metrix){
               	   // 	 tg=app.title||'';
               	   // 	 break;
               	   // }
               }
			   
			}else if(cn=="wiki"){
			   ift=4;
			   var metrix=instreet.wiki.metrix;
               for(var i=0,len=data.wikiSpot.length;i<len;i++){
               	   var app=data.wikiSpot[i];
               	   mx=metrix;
               	   // if(app.metrix==metrix){
               	   // 	 tg=app.title||'';
               	   // 	 break;
               	   // }
               }
			}else if(cn=="ad"){
			   ad=data.badsSpot[0].adsId;
			   at=data.badsSpot[0].adsType;
			   tty=0;
			}else{
				return;
			}
			var time=new Date().getTime();  								
			ul+="?iu="+iu+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&mid="+mid+"&at="+at+"&tty="+tty+"&ift="+ift+"&mx="+mx+"&time="+time;				
			ev.importFile('js',ul);				
	}

};

//static method

InstreetAd.reLocate =function(){                   //重新定位广告

   var adsArray=cache.adsArray;
   
   for(i in adsArray){

      var adObj=adsArray[i];
      adObj.locate&&adObj.locate();
 	
    }
};