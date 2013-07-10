/*!msncouplet v0.0.1*/
(function(window,undefined){

	if (window.InstreetWidget&&typeof window.InstreetWidget=='object'){
		return;
	} else {

		window.InstreetWidget = {
			version : "@REVISION@",
	        type    : "InstreetImageWidget",
	        name	: "msncouplet"
		};

	}

   var document = window.document,
	   navigator = window.navigator,
	   location = window.location,
	   host = location.hostname,
	   isIE=!!window.ActiveXObject,
	   imgs=[],
	   isFirst=true,
	   container=null;

	var createContainer=function(){	//创建容器

		var c=document.createElement("div"),
			body=document.getElementsByTagName('body')[0]||document.documentElement;
		c.id=c.className="instreet-image-plugin-container";
		if(body&&body.firstChild){
			body.insertBefore(c,body.firstChild);
			return c;
		}
		return null;

	};



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


	//function util
	var	ev = {
		bind : function(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false);
			}else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
			}else{
				element["on"+type] = handler;
			}
		},
		remove : function(element,type,handler){
			if(element.removeEventListener){
				element.removeEventListener(type,handler,false);
			}else if(element.datachEvent){
				element.datachEvent("on"+type,handler);
			}else{
				element["on"+type] = null;
			}
		},
		getEvent : function(event){
			return event ? event : window.event;
		},
		getTarget : function(event){
			return event.target || event.srcElement;
		},
		stopPropagation : function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			}
		},
		getRelatedTarget : function(event){
			if(event.relatedTarget){
				return event.relatedTarget;
			}else if(event.type == "mouseover"){
				return event.fromElement;
			}else if(event.type == "mouseout"){
				return event.toElement;
			}else{
				return null;
			}
		},
		getXY :function (obj){
			var x = 0, y = 0;
			if (obj.getBoundingClientRect) {
				var box = obj.getBoundingClientRect();
				var D = document.documentElement;
				x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
				y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
			} else {
				for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {  }
			}
			return {  x: x,  y: y };
		},
		aTrim	:function(arr){
			var array=[];
			arr.sort(sortNum);
			var len=arr.length,flag=0;
			for(var i=0;i<len;i++){
				if(arr[i]!=arr[i+1]){
					array[flag]=arr[i];
					flag++;
				}
			}
			return array;
			function sortNum(a,b){return a-b;}
		},
		$	:function(parentNode,tagName,className){
			var parent=parentNode||document,
				tag;
			if(arguments.length==2){
				className=tagName;
				tag="*";
			}else{
				tag=tagName||'*';
			}
			if(document.getElementsByClassName) return parent.getElementsByClassName(className);
			var arr=[];
			var elements=parent.getElementsByTagName(tag);
			for(var l=elements.length,i=l;i--;){
			   var ele=elements[i];
			   if(ele.className){
				 var cn=ele.className.replace(/\s/g,'|').split('|');
				 for(var len=cn.length,j=len;j--;){
					if(cn[j]==className){arr.push(ele);break;}
				 }
			   }
			}
			return arr;
		},
	    importFile  :function(type,name){
			 var link,script,
			 head=document.getElementsByTagName( "head" )[0] || document.documentElement;
			 switch(type){
				case "js":
					script=document.createElement('script');
					script.async="async";
					script.charset="utf-8";
					script.type="text/javascript";
					script.onload=script.onreadystatechange=function() {
						if(!script.readyState || script.readyState === "loaded" || script.readyState === "complete"){
							script.onload = script.onreadystatechange = null;
							if ( head && script.parentNode ) {
									head.removeChild( script );
							}
						}
					};
					script.src=name;
					head.appendChild(script);
					break;
				case "css":
					link = document.createElement("link");link.type = "text/css";link.rel = "stylesheet";
					link.href=name;
					head.appendChild(link);
					break;
			 }
		},
		hasClass:function(obj,c){
			if(obj.className){
				var arr=obj.className.split(' ');
				for(var i=0,len=arr.length;i<len;i++){
					if(c===arr[i]){
						return true;
					}
				}
			}
		   return false;
		},
		isVisible :function(obj){
			if (obj == document) return true;
			if (!obj) return false;
			if (!obj.parentNode) return false;
			if (obj.style) {
			    if (obj.style.display == 'none') return false;
			    if (obj.style.visibility == 'hidden') return false;
			}
			var style=null;
			//Try the computed style in a standard way
			if (window.getComputedStyle) {
			    style = window.getComputedStyle(obj, "");
			    if (style.display == 'none') return false;
			    if (style.visibility == 'hidden') return false;
			}

			//Or get the computed style using IE's silly proprietary way
			style = obj.currentStyle;
			if (style) {
			    if (style.display == 'none') return false;
			    if (style.visibility == 'hidden') return false;
			}

			return ev.isVisible(obj.parentNode);
		}
	};

	var $=function(id){return document.getElementById(id);}	//simplify document.getElementById
		,
		each=function(arrs,handler){
			if(arrs.length){
				for(var i=0,len=arrs.length;i<len;i++){
					handler.call(arrs[i],i);
				}
			}else{
				arrs&&handler.call(arrs,0);
			}
		}
		,
		hide=function(elem){
			each(elem,function(){
				this.style.display="none";
			});
		}
		,
		show=function(elem){
			each(elem,function(){
				this.style.display="block";
			});
		};

	var extend=function(c,obj){	//extend object
		if(c){
			if(typeof c=="object"){
				for(var i in c){
					obj[i]=c[i];
				}
			}else if(typeof c=='function'){
				obj[c]=c;
			}
		}
	};

	var readylist=[],
		ready=false,
		loadedReg=/^(loaded|complete)$/;
	var readyHandle = function () {
		if(ready) return;
		for (var i = 0; i < readylist.length; i++){
			readylist[i]&&readylist[i].call(document);
		}
		ready=true;
		readylist=null;
	};
	var DOMContentLoaded = function(){
		if (document.addEventListener) {
			document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
			readyHandle();
		}else{
			if(loadedReg.test(document.readyState)){
				document.detachEvent('onreadystatechange',DOMContentLoaded);
				readyHandle();
			}
		}
	};
	var DOMReady = function (fn){	//DOM ready event

		if(document.readyState==='complete'){readyHandle();return;}

		if (readylist.push(fn) > 1) return;

		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
			window.addEventListener('loaded', readyHandle, false);
		}else if(document.attachEvent){
			document.attachEvent('onreadystatechange',DOMContentLoaded);
			window.attachEvent('onload',readyHandle);
		}
	};

	var cache={	//广告数据cache对象

		adsArray   :[],
        requestAd   :function(){

			var images=document.getElementsByTagName('img');
			for(var i=0,len=images.length;i<len;i++){
				var img=images[i];
				imgs[i]=img;
				img.insId=i;
				img.setAttribute("instreet_img_id",i);
				cache.imgLoadHandle(img);
			}

	    },
	    imgLoadHandle  :function(img){
			var image=new Image();
			image.src=img.src,
			image.insId=img.insId;
			if(image.complete){
				cache.loadData(image);
			}else{
				image.onload=function(){
					var obj=this;
					obj.onload=null;
					cache.loadData(image);
				};
			}
	    },
		loadData     :function(img){
			var index=img.insId,clientImg=imgs[index];
			if(img.width>=config.imiw&&img.height>=config.imih){
				if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih||(clientImg.clientWidth===0&&clientImg.clientHeight===0)){
				if(typeof config.adsLimit=="number"&&config.adsLimit<=0){
					return;
				}
				clientImg.setAttribute('instreet_data_loading',true);
				clientImg.insDataLoading	= true;		//标记正在请求数据
				// InstreetAd.recordImage(clientImg);	 //loadImage action
				cache.createJsonp(clientImg);
				config.adsLimit&&config.adsLimit--;
				}
			}
		},
		createJsonp  :function(img){
		   var w=config.width||250,h=config.height||250;
		   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
		   ev.importFile('js',url);
		}

	};

	var msnCouplet=function  (container,data) {	//couplet对象
		this.data=data;
		this.img=imgs[data.index];
		this.param={width:config.width,height:config.height,initSrc:this.img.src,prevSrc:''};
		this.switchCount=0;
		this.init(container);
	};

	msnCouplet.relocate=function(){
		for(var i in cache.adsArray){
			cache.adsArray[i]&&cache.adsArray[i].locate();
		}
	};

	extend({
		init:function(container){
			this.createCouplet(container);
			this.fillContent();
			this.locate();
			this.bindEvent();
		},
		createCouplet:function(container){
			var w=this.param.width,
				h=this.param.height,
				styleStr="display:none;position:fixed;_position:absolute;width:"+w+
					"px;height:"+h+"px;border:1px solid #ddd;background-color:#EEE;padding:2px;";
			var left=document.createElement("div"),
				right=document.createElement("div");
			left.style.cssText=right.style.cssText=styleStr;
			left.innerHTML=right.innerHTML='<a href="javascript:;" class="ins-btn-close" title="关闭" target="_self">×</a>';

			this.leftCouplet=left;
			this.rightCouplet=right;
			container.appendChild(left);
			container.appendChild(right);

		},
		fillContent:function(){
			var data=this.data,
				w=this.param.width,
				h=this.param.height;

			data={left:{src:'120600.swf',type:'flash'},right:{src:'120600.swf',type:'flash'}};

			var getContent=function(ad){
				var cont=document.createElement("div");
				cont.className="ins-couplet-cont";
				switch(ad.type){
					case "flash":
						cont.innerHTML='<object width="'+w+'" height="'+h+'" align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param value="always" name="allowScriptAccess"/><param value="'+ad.src+'" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><embed width="'+w+'" height="'+h+'" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer" type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque" quality="high" src="'+ad.src+'"></embed></object>';
						break;
					case "image":
					cont.innerHTML='<a href="#"><img width="'+w+'" height="'+h+'" src="'+data.src+'"/></a>';
					break;
				}
				return cont;
			};

			this.leftCouplet.appendChild(getContent(data.left));
			this.rightCouplet.appendChild(getContent(data.right));
		},
		locate:function(){
			var contentWidth=siteSize[config.widgetSid]||980;
				pageWidth=document.documentElement.clientWidth||document.body.offsetWidth,
				pageHeight=document.documentElement.clientHeight||document.body.offsetHeight,
				gap=(pageWidth-contentWidth)/2,
				lC=this.leftCouplet,
				rC=this.rightCouplet,
				w=this.param.width+6,
				h=this.param.height+6,
				x=0,
				y=0;
			function setStyle(){
				if(gap>=w){
					x=gap-w+'px';
				}else{
					hide(lC);
					hide(this.rightCouplet);
					return;
				}
				if(pageHeight>h){
					y=(pageHeight-h)/2+'px';
				}
				if(!lC.closed)
					lC.style.cssText+=";display:block;top:"+y+";left:"+x+";";
				if(!rC.closed)
					rC.style.cssText+=";display:block;top:"+y+";right:"+x+";";
			}
			clearTimeout(this.locateTimer);
			this.locateTimer=setTimeout(setStyle,100);

		},
		bindEvent:function(){
			var lC=this.leftCouplet,
				rC=this.rightCouplet,
				lclose=ev.$(lC,'ins-btn-close')[0],
				rclose=ev.$(rC,'ins-btn-close')[0];
			lclose.onclick=function(){
				hide(lC);
				lC.closed=true;
			};
			rclose.onclick=function(){
				hide(rC);
				rC.closed=true;
			};

		},
		destroy:function(){
			var parent=this.leftCouplet.parentNode;
			parent&&parent.removeChild(this.leftCouplet)&&parent.removeChild(this.rightCouplet);
		},
		isImgChanged:function(){
			var img=this.img;
			if(img.src&&img.src!=this.param.initSrc){
				console.log(img.src,' is diff width ',this.param.initSrc)
				this.param.prevSrc=this.param.initSrc;
				this.param.initSrc=img.src;
				return true;
			}
			return false;
		}
	},msnCouplet.prototype);

	var maxSwitchNumber=5;
	var timerTick=function(arr){
		setInterval(function(){
			for(var i in arr){
				var ad=arr[i];
				if(ad&&ad.isImgChanged()){	//图片发生改变
					if(ad.img.src!=ad.param.prevSrc){
						var img=ad.img;
						if(ad.switchCount==maxSwitchNumber){
							ad.destroy();
							arr[i]=null;
							config.adsLimit++;	//防止广告请求超过限制
							cache.imgLoadHandle(img);	//重新请求广告
							break;
						}
						ad.switchCount++;
						console.log(ad.switchCount)
					}
				}
			}
		},100);
	};

    window.insjsonp=function(data){	//jsonp回调方法

	    if(data){
			var index=data.index,
				img=imgs[index];
			img.insDataLoaded=true;
			img.setAttribute('instreet_data_loaded',true);
			var couplet=new msnCouplet(container,data);	//实例一个msnCouplet对象
			cache.adsArray[index]=couplet;	//缓存msnCouplet对象
		}

	};

	function init(){	//初始化插件

		 if(typeof instreet_config!="undefined"){		//mix配置信息
			extend(instreet_config,config);
		 }
		 if((container=createContainer())){
			ev.importFile('css',config.cssurl);
			cache.requestAd();
		 }
		 ev.bind(window,'resize',function(){msnCouplet.relocate();});
         timerTick(cache.adsArray);	//定时检测图片是否切换

	}

	DOMReady(function(){	//dom ready后开始执行init
		init();	//插件初始化
	});

})(window);