//instreet object
var instreet={
	container :null,
	shop:null,
	weibo:null,
	wiki:null,
	widgetBox :null,
    init   :function(){
	    var cssUrl=config.cssurl;
		ev.importFile('css',cssUrl);
		instreet.createContainer();
		instreet.bindEvents();

	},
	createContainer: function(){						//创建广告容器
       var container=document.createElement('div');
	   container.id="instreet-plugin-container";
	   instreet.container=container;
	   document.body.insertBefore(container,document.body.firstChild);
	   instreet.createWidgetBox();
	},
	createWidgetBox:function(){

	    var	section=document.createDocumentFragment(),
	        shop=document.createElement("div"),weibo=document.createElement("div"),wiki=document.createElement("div");
	    shop.className="shop-holder";
	    weibo.className="weibo-holder";
	    wiki.className="wiki-holder";

	    section.appendChild(shop);
	    section.appendChild(weibo);
	    section.appendChild(wiki);
		instreet.container.appendChild(section);
		instreet.shop=shop;instreet.weibo=weibo;instreet.wiki=wiki;

	},
	bindEvents :function(){

		var	shop=instreet.shop,
			weibo=instreet.weibo,
			wiki=instreet.wiki,
			index;
		instreet.container.onclick=function(e){
			var event=ev.getEvent(e),
				tar=ev.getTarget(event);
			if(tar.className=="button-close-holder"){
				hide(tar.parentNode.parentNode);
			}
		};
		shop.onmouseover=function(e){
			instreet.enterApp(e,this.insId,this);
		};
		shop.onmouseout=function(e){
			instreet.leaveApp(e,this.insId,this);
		};
		weibo.onmouseover=function(e){
			instreet.enterApp(e,this.insId,this);
		};
		weibo.onmouseout=function(e){
			instreet.leaveApp(e,this.insId,this);
		};
		wiki.onmouseover=function(e){
			instreet.enterApp(e,this.insId,this);
		};
		wiki.onmouseout=function(e){
			instreet.leaveApp(e,this.insId,this);
		};

	},
	hideApps  :function(){          //隐藏所有app
		hide(instreet.shop);
		hide(instreet.weibo);
		hide(instreet.wiki);
		instreet.blurSpot();
	},
	blurSpot :function(){
		var f=$('ins-spot-focus');
		if(f){
			f.id='';
		}
	},
	enterApp  :function(e,index,app){
		var event=ev.getEvent(e),
			rela=ev.getRelatedTarget(event),
			ad=cache.adsArray[index];
		ad.showSpots();

		if(!app.contains(rela)){
			show(app);
			ad.recordWatch(app);
		}
	},
	leaveApp  :function(e,index,app){
		var event=ev.getEvent(e),
			rela=ev.getRelatedTarget(event),
			ad=cache.adsArray[index];
		ad.hideSpots();
		//当鼠标离开container的时候或者移动到底部广告的时候关闭app
		if(ad.ad.contains(rela)||!instreet.container.contains(rela)){
			hide(app);
			instreet.blurSpot();
		}
		if(!instreet.container.contains(rela)&&rela!==ad.img){
				ad.hideAd();
		}
	},
	recordImage:function(img){
      var iu=encodeURIComponent(encodeURIComponent(img.src)),
	       pd=config.widgetSid,
		   t=encodeURIComponent(encodeURIComponent(document.title)),
		   ul=config.ourl,
		   index=img.insId;

	  var time=new Date().getTime();
	  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&index="+index+"&time="+time;
	  ev.importFile('js',ul);

	}

};