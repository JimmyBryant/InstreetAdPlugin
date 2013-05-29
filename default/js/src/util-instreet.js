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

		var	shop=instreet.shop,weibo=instreet.weibo,wiki=instreet.wiki,index;
		instreet.container.onclick=function(e){
			var event=ev.getEvent(e),tar=ev.getTarget(event);
			if(tar.className=="button-close-holder"){
				hide(tar.parentNode.parentNode);
			}
		};
		shop.onmouseover=function(e){
			index=this.insId;
			var event=ev.getEvent(e),rela=ev.getRelatedTarget(event),
				ad=cache.adsArray[index];					
			ad.showWidget();
			show(this);
			if(!instreet.shop.contains(rela)){
				ad.recordWatch(this);
			}

		};
		shop.onmouseout=function(e){
			instreet.leaveApp(e,this.insId,this);					
		};
		weibo.onmouseover=function(e){
			index=this.insId;
			var event=ev.getEvent(e),rela=ev.getRelatedTarget(event),
				ad=cache.adsArray[index];					
			ad.showWidget();
			show(this);
			if(!instreet.weibo.contains(rela)){
				ad.recordWatch(this);
			}
		};
		weibo.onmouseout=function(e){
			instreet.leaveApp(e,this.insId,this);
		};
		wiki.onmouseover=function(e){
			index=this.insId;
			var event=ev.getEvent(e),rela=ev.getRelatedTarget(event),
				ad=cache.adsArray[index];					
			ad.showWidget();
			show(this);
			if(!instreet.wiki.contains(rela)){
				ad.recordWatch(this);
			}
		};
		wiki.onmouseout=function(e){
			instreet.leaveApp(e,this.insId,this);
		};

	},
	hideApps  :function(){          //隐藏所有app
		hide(instreet.shop);
		hide(instreet.weibo);
		hide(instreet.wiki);
	},
	enterApp  :function(e,index,app){
		var event=ev.getEvent(e),rela=ev.getRelatedTarget(e),
			ad=cache.adsArray[index];					
		ad.showWidget();
		show(app);
		if(!instreet.shop.contains(rela)){
			ad.recordWatch(app);
		}
	},
	leaveApp  :function(e,index,app){
		var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);
		var ad=cache.adsArray[index];	
		ad.hideWidget();
		hide(app);				
		if(!instreet.container.contains(rela)&&rela!==ad.img){
			ad.hideAd();
		}
	},
	recordImage:function(img){
      var iu=encodeURIComponent(encodeURIComponent(img.src)),
	       pd=config.widgetSid,
		   t=encodeURIComponent(encodeURIComponent(document.title)),
		   ul=config.ourl;

	  var time=new Date().getTime();   
	  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
	  ev.importFile('js',ul);

	}

};