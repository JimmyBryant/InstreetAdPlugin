/*
	instreet.metro.js v0.1.1

	metro风格的js广告插件
	支持自定义主题

	+	增加关闭按钮
	m	优化分享按钮
	m   优化广告框定位
*/

(function (window,undefined) {

	// 判断是否已经存在广告插件
	if (typeof window.InstreetWidget!="undefined"||window.InstreetWidget != null){

			return false;

	} else {

			window.InstreetWidget = {
				version : "@REVISION@",
		        name    : "InstreetWidget"
			}; 

	}

   var document = window.document,
   navigator = window.navigator,
   location = window.location,
   isIE=!!window.ActiveXObject,
   adsObjectArray=[],       //存放广告数据
   imagesList=[],
   readyList=[],
   sizeList=[250,250],   //广告尺寸数组，w=config.sizeNum*2 ,h=config.sizeNum*2+1
   themeList=['red','yellow','green','blue','purple','brown'],
   firstImage=true,
   prefix="http://monkey.instreet.cn/",
   // prefix="http://push.instreet.cn/",
   container;


    
	// config 对象
	// 广告插件的全局配置

	var config = {
			redurl	:	prefix+"click.action",
		callbackurl	:	prefix+"push.action",
			murl	:	prefix+"tracker.action",
			iurl    :	prefix+"tracker90.action",
			ourl	:	prefix+"loadImage.action",
			surl    :   prefix+"share/weiboshare",	
			// cssurl 	:	"http://static.instreet.cn/widgets/push/css/instreet.metro.min.css",
			cssurl 	:	"css/instreet.metro.css",				
			imih	:	300,
			imiw	:	300,
			timer   :   2000,
			sizeNum : 	0	//0为250*250 1为200*200 2为300*250
			// ,
			// adsLimit :  3,
			// // widgetSid:"77WCO3MnOq5GgvoFH0fbH2",
			// widgetSid:"27YkzLdd7nCQH5vGOScA2Q",
			// showAd:true,
			// showFootAd:true,
			// showWeibo:true,
			// showWiki:true,
			// showShareButton:true,
			// showWeather:true,
			// showNews:true,
			// showMeiding  :true,
			// footAuto:  true,
			// position: 0       //0为right 1为left

	};

	// dom ready
	
	var domReady = function (fn){ 

		var run = function () {   
			for (var i = 0; i < readyList.length; i++) readyList[i]&&readyList[i]();   
		},
		doScrollCheck=function(){
			  try {   
					document.documentElement.doScroll('left');   
					 
			  }catch (err){   
					setTimeout(doScrollCheck, 50); 
	                return;					
			  }  
			  run();  
	    };
        var isIE = !!window.ActiveXObject;
        if(document.readyState==="complete") {readyList.push(fn);run();return;}				
		if (readyList.push(fn) > 1) return; 	
		if (document.addEventListener)  			
		return document.addEventListener('DOMContentLoaded', run, false);   

		if (isIE) {   
             doScrollCheck();
	    }  
					  
	}; 

	// css对象
	// 用于获取或者设置样式
	var css = {

		get:function(elem,name){

			var core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,//用于匹配数字
			rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
			rposition = /^(top|right|bottom|left)$/,
			ropacity = /opacity=([^)]*)/,
		    rmargin = /^margin/;

	    	//用于获取elem的width和height
			var getWidthOrHeight=function(elem,name){

				var ret=name==="width"?elem.clientWidth:elem.clientHeight
				,pt=parseFloat(css.get(elem,'paddingTop'))
				,pb=parseFloat(css.get(elem,'paddingBottom'))
				,pl=parseFloat(css.get(elem,'paddingLeft'))
				,pr=parseFloat(css.get(elem,'paddingRight'));

				return ret=(name==="width"?ret-pl-pr:ret-pt-pb)+'px';

			};

			//标准浏览器
			if(window.getComputedStyle){
				var ret, width, minWidth, maxWidth,
					computed = window.getComputedStyle( elem, null ),
					style = elem.style;

				name=name==="float"?"cssFloat":name;  //cssFloat获取float

				if ( computed ) {
					ret = computed[ name ];
					if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
						width = style.width;
						minWidth = style.minWidth;
						maxWidth = style.maxWidth;

						style.minWidth = style.maxWidth = style.width = ret;
						ret = computed.width;

						style.width = width;
						style.minWidth = minWidth;
						style.maxWidth = maxWidth;
					}
				}

				return ret;
			}else if(document.documentElement.currentStyle){       //IE浏览器

				var left, rsLeft,
				ret = elem.currentStyle && elem.currentStyle[ name ],
				style = elem.style;
				name=name==="float"?"styleFloat":name;//styleFloat获取float
				if(name==='opacity'){	

					return ropacity.test( (elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
						( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
						computed ? "1" : "";

				}else if(name==="width"||name==="height"){

					if(elem.currentStyle[name]==="auto"){    //如果未设置width,height默认返回auto

						return ret=getWidthOrHeight(elem,name);

					}

				}

				// Avoid setting ret to empty string here
				// so we don't default to auto
				if ( ret == null && style && style[ name ] ) {
					ret = style[ name ];
				}

				if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

					// Remember the original values
					left = style.left;
					rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

					// Put in the new values to get a computed value out
					if ( rsLeft ) {
						elem.runtimeStyle.left = elem.currentStyle.left;
					}
					style.left = name === "fontSize" ? "1em" : ret;
					ret = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					if ( rsLeft ) {
						elem.runtimeStyle.left = rsLeft;
					}
				}

				return ret === "" ? "auto" : ret;

			}else{
				return elem.style[name];
			}
		},
		set:function(elem,name,value){
			// 如果name是对象
			if(typeof name=="object"&&value===undefined){
				for(var pro in name){
					css.set(elem,pro,name[pro]);
				}
				return;
			}
			if(window.getComputedStyle){
				name=name==="float"?"cssFloat":name;
			}else{
				name=name==="float"?"styleFloat":name;
				if(name==="opacity"){
					elem.style["filter"]="alpha(opacity="+100*value+")";
				}
			}
			elem.style[name]=value;

		}
	};

	// Animate
	//	动画类
	var Animate=function(elem){
   
   
	    var timers=[],       //用于存放Fx对象
			timerId;         //全局计时器

	    var requestAnimationFrame = window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame;

		var isEmptyObject=function(obj){            //判断对象是否为空

				for ( var name in obj ) {
					return false;
				}
				return true;

		};

		var Animate=function(elem){

			this.elem=elem;
			return this;

		};

	    Animate.prototype.animate=function(property, duration, easing, callback){               //js动画入口API

		   var elem=this.elem;
		   var options=Animate.getOpt(duration, easing, callback);                     //修正参数

		   if(elem&&elem.nodeType==1){

			    var start,to;
			    if(property&&typeof property=="object"){

					if(isEmptyObject(property)){             //如果property为空直接执行callback

					    options.callback.call(elem);

					}else{

					   options.animatedProperties={};
					   for(var pro in property){
					   	  options.animatedProperties[pro]=false;    //用于标记该属性的动画是否执行完毕
					   }

					   for(var name in property){

					      var fx=new FX(elem,options,name);
						  start=parseFloat(css.get(elem,name));
						  end=parseFloat(property[name]);
					      fx.custom(start, end);  

					   }


					}

				}

		   }

		};
		// fadeIn方法
		Animate.prototype.fadeIn=function(duration, easing, callback){ 
			var _=this,elem=_.elem;
			if(css.get(elem,'display')=='none'){
				css.set(elem,{opacity:0,display:'block'});
			}
			_.animate({opacity:1},duration, easing, callback);
		};

		// fadeOut方法
		Animate.prototype.fadeOut=function(duration, easing, callback){ 
			var _=this,elem=_.elem;
			duration=duration||400;
			easing=easing||'swing';
			_.animate({opacity:0},duration,easing,function(){css.set(elem,'display','none');callback&&callback();});
		};

	    Animate.prototype.stop=function(end){  //停止某个dom元素的动画  end为true则会把动画进行到最后一帧 false则停止到当前帧
	    	var elem=this.elem;
		    end=end||false;
			for(var i=0;i<timers.length;i--){

			   var fx=timers[i];
			   if(fx.elem===elem){
			    if(end){
				  fx.update(fx.name,fx.end); 
				}
			    timers.splice(i--,1); //移除fx要将i减1
			   }

			}
			return this;

		};

		Animate.getOpt=function(duration, easing, callback){       // 修正参数
			 var opt={};
			 opt.duration=duration;
			 opt.callback=callback||easing||duration;
			 opt.old=opt.callback;
			 opt.easing=callback&&easing||easing||duration;
			 opt.callback=function(){
			 	if(typeof opt.old=="function"){
			 		opt.old.call(this);
			 	}
			 };

	 		 opt.duration=typeof opt.duration=="number"?opt.duration:400;
	 		 opt.easing=typeof opt.easing=="string"?opt.easing:"swing";
			 return opt;

		};



		var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象 

			this.elem=elem;
			this.options=options;
			this.name=name;

		};

		FX.interval=13;

		FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

			var t,raf,self=this;
			this.startTime = new Date().getTime();  
			this.start = from;  
			this.end = end; 

			function t( gotoEnd ) {
				return self.step(gotoEnd);
			};

			t.elem = this.elem;

			if ( t() && timers.push(t) && !timerId ) {
				// 如果可以的话使用requestAnimationFrame代替setInterval 
				if ( requestAnimationFrame ) {
					timerId = true;
					raf = function() {
						// 当timerId设为null，动画停止
						if ( timerId ) {
							requestAnimationFrame( raf );
							FX.tick();
						}
					};
					requestAnimationFrame( raf );
				} else {
					timerId = setInterval( FX.tick, FX.interval );
				}
			}

		};

		FX.prototype.step=function(){
		    var now=new Date().getTime(),
				nowPos,
				done=true,
				options=this.options;

			if(now>options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
			   nowPos=this.end;
			   options.animatedProperties[ this.name ] = true;
				for ( i in options.animatedProperties ) {
					if ( options.animatedProperties[i] !== true ) {
						done = false;
					}
				}
			   done&&options.callback.call(this.elem);  //所有动画结束执行回调函数
			   this.update(this.name,nowPos);                 
			   return false;	
			}else{
			    var n = now - this.startTime;  
	            var state = n / options.duration;  
	            var pos =Easing[options.easing](state, 0, 1, options.duration);  
	            nowPos = this.start + ((this.end - this.start) * pos);  
	        }  

	        this.update(this.name,nowPos); 
	        return true; 
		};


		FX.prototype.update=function(name,value){

			if(name!="opacity")
			{
				value+="px";
			}

			css.set(this.elem,name,value);

		};

		FX.tick = function(){                //用于计时器中执行动画队列
	                                      
			for ( var  i = 0 ; i < timers.length ; ++i ) {
				if ( !timers[i]() ) {
					timers.splice(i--, 1);
				}
			} 
	        if (!timers.length){  
	            FX.stop();  
	        }  

	    };  
	     
		FX.stop = function(){                                  //清除全局计时器 停止所有动画 
	        clearInterval(timerId);   
	        timerId = null;  
	    };

	    var Easing={                                         //easing对象
	 	
			linear: function( p ) {
				return p;
			},
			swing: function( p ) {
				return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
			}

		};	

		return new Animate(elem); 

	};

	//兼容IE的常用方法集合 
	var U = {                  
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
			getXY : function (obj){
					var x = 0, y = 0;
					if (obj.getBoundingClientRect) {
						var box = obj.getBoundingClientRect();
						var D = document.documentElement;
						x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
						y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
					} else {
						for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {  }
					};
					return {  x: x,  y: y };
			},
			aTrim  :function(arr){	       
				   var array=new Array();
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
		    $   :  function(id){
		    	return document.getElementById(id);
		    },
		    $$  :  function(parentNode,tagName,className){  	//getElementsByClassName	   
				   var parent=parentNode||document,tag;
				   if(arguments.length==2){  
				   	  className=tagName;
				   	  tag="*";
				   }else{
					  var tag=tagName||'*';
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
		    createElem : function  (tag) {
		    	return document.createElement(tag);	
		    },
		    importFile  :function(type,name){
				 var link,script,
				 head=document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
				 switch(type){
				   case "js": 
				   script=U.createElem('script');
				   script.async="async";script.charset="utf-8";
				   script.type="text/javascript";
				   script.onload = script.onreadystatechange = function () {
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
				   link = U.createElem("link");link.type = "text/css";link.rel = "stylesheet";
				   link.href=name;
				   head.appendChild(link);
				   break;					   
				 }
	        },
	       isVisible :function(obj){
			    if (obj == document) return true;

			    if (!obj) return false;
			    if (!obj.parentNode) return false;
			    if (obj.style) {
			        if (obj.style.display == 'none') return false;
			        if (obj.style.visibility == 'hidden') return false;
			    }

			    //Try the computed style in a standard way
			    if (window.getComputedStyle) {
			        var style = window.getComputedStyle(obj, "");
			        if (style.display == 'none') return false;
			        if (style.visibility == 'hidden') return false;
			    }

			    //Or get the computed style using IE's silly proprietary way
			    var style = obj.currentStyle;
			    if (style) {
			        if (style['display'] == 'none') return false;
			        if (style['visibility'] == 'hidden') return false;
			    }

			    return U.isVisible(obj.parentNode);
			},
			getCookie:function (Name) {

			    var search = Name + "=" ;
			    if(document.cookie.length > 0) 
			    { 
			        offset = document.cookie.indexOf(search) ;
			        if(offset != -1) 
			        { 
			            offset += search.length ;
			            end = document.cookie.indexOf(";", offset) ;
			            if(end == -1) end = document.cookie.length ;
			            return unescape(document.cookie.substring(offset, end)) ;
			        } 
			        else return "" ;
			    } 
			},
			setCookie : function (name, value) { 

			    var argc = arguments.length; 
			    var expires = (argc > 2) ? arguments[2] : null; 
			    if(expires!=null) 
			    { 
			        var LargeExpDate = new Date (); 
			        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));         
			    } 
			    document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString())); 
			} 
		};

		// 用于jsonp的回调函数
        window['insjsonp'] = function(data){

		    if(data){
			  var index=data.index,img=imagesList[index];
			  img.setAttribute('instreet_data_ready',true);
			  removeOldDom(index);
			  var ad=new InstreetAd(data,container);
			  adsObjectArray[index]=ad;
			}
				
		};

		// 移除旧的InstreetAd对象的dom元素
		var removeOldDom = function(index){
			if(adsObjectArray[index]){
				var _=adsObjectArray[index],parent=_.box.parentNode;
				parent&&parent.removeChild(_.box);
				parent&&parent.removeChild(_.controlBox);
			}
		};

    	
        //页面加载时向服务器返回符合要求的图片信息

        recordImage=function(img){
	       var iu=encodeURIComponent(encodeURIComponent(img.src)),
		       pd=config.widgetSid,
			   pu=encodeURIComponent(encodeURIComponent(window.location.href)),
			   t=encodeURIComponent(encodeURIComponent(document.title)),
			   ul=config.ourl;
			var time=new Date().getTime();   
			  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
			  U.importFile('js',ul);
		   
	    };

		// 请求图片的广告数据
		var requestAdsData = function(img){
			// 预加载图片
			var loadImage = function(img,callback){

				 var image=new Image();
				 if(typeof image.src=="undefined")        //没有src属性则退出
				 	return;
				 image.src=img.src;
				 image.ins_index=img.ins_index;
				 if(image.complete){
				    callback&&callback(image);
				 }else{
					 image.onload=function(){					   
					   var obj=this;
					   obj.onload=null;
					   callback&&callback(image);  
					 }				 
			     }

			};
			// 用于图片onload回调
			var loadHandle = function(img){

			   var index=img.ins_index,clientImg=imagesList[index];		   
			   if(img.width>=config.imiw&&img.height>=config.imih){
			   	 if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih){  

				   	  if(typeof config.adsLimit=="number"&&config.adsLimit<=0){	
				   	  	return;
				   	  }	
				   	  recordImage(clientImg);	 //loadImage action

				   	  // 为不支持naturalWidth的浏览器增加naturalWidth
				   	  if(typeof clientImg.naturalWidth=="undefined"||typeof clientImg.naturalHeight=="undefined"){
				   	   		clientImg.naturalWidth=img.width;
				   	   		clientImg.naturalHeight=img.height;
				   	  }	   
					  createJsonp(clientImg);
					  config.adsLimit&&config.adsLimit--;
			   	    }
			    }

			};
			// createJsonp 跨域请求广告数据
			var createJsonp = function(img){

			   var w=250,h=250;
			   if(typeof config.sizeNum=="number"){
			   	  w=sizeList[config.sizeNum*2];
			   	  h=sizeList[config.sizeNum*2+1];
			   }
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),
			   url=config.callbackurl+"?index="+img.ins_index+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
			   U.importFile('js',url);

			};

			loadImage(img,loadHandle);	

		};

		// 简单的extend 方法
		var extend = function  (base,ext) {			
			for(var i in ext){
				base[i] = ext[i];
			}
		};

		// 更换主题
		var changeTheme = function(theme){		

			U.setCookie('instreet_theme',theme,7);
			for(var i in adsObjectArray){
				var ad=adsObjectArray[i];
				if(ad.box&&ad.box.lastChild){
					ad.box.lastChild.className="ins-wrapper ins-"+themeList[theme]+"style ins-size"+sizeList[config.sizeNum*2];
					ad.controlBox.firstChild.className="ins-"+themeList[theme]+"style";
					// 调整关闭按钮
					ad.close.className='ins-btn-close ins-btn-'+themeList[theme]+'style';
					// 调整footer的themelist
					var footer=ad.footer;
					var selected=U.$$(footer,'selected')[0];
					selected.className="";
					footer.getElementsByTagName('li')[theme].className="selected";

				}
				
			}
			config.theme=theme;
		};

		// InstreetAd对象
		var InstreetAd = function(data,container){

			var img=imagesList[data.index];
			this.insIndex=data.index;
			this.adsData=data;
			this.container=container;
			this.image=img;
			this.spotsArray=[];
			this.timer=null;		//该计时器用于locate函数
			this.timerApp=null;     //该计时器用于应用展示
			this.isFirstShow=true;	//用于标记广告是否是第一次展示
			this.isOn=true;			//标记是否启动尚街
			// 初始化对象
			this.init();
		};
		InstreetAd.fn=InstreetAd.prototype;
		// 扩展原形对象
		extend(InstreetAd.fn,{
		
			init:	function () {
				var _=this;
				_.createController();
				_.createContainer();
				_.createApps();			
				_.locate();
			},
			createController : function(){		//创建controller按钮
				var _=this,box=U.createElem('div'),theme=U.createElem('div'),
					control=U.createElem('div'),share,str='';
				box.className='instreet-plugin-control';
				theme.className='ins-'+themeList[config.theme]+'style';
				control.className="ins-control";
				css.set(box,'display','none');
				str+='<a href="javascript:;" class="ins-icon ins-icon-control"></a><div class="ins-bubble"><dl><dt><em class="ins-arrow-top"></em></dt><dd><p>尚街已开启</p></dd></dl></div>';
				control.innerHTML=str;
				theme.appendChild(control);
				// 事件处理函数
		
				var overHandler = function(e){
					var event=U.getEvent(e),rel=U.getRelatedTarget(event);	
					if(!this.contains(rel)){	
						this.timer&&clearTimeout(this.timer);					
						Animate(this.lastChild).stop().fadeIn();
					}
				};
				var outHandler = function(e){
					var event=U.getEvent(e),rel=U.getRelatedTarget(event);
					if(!this.contains(rel)){
						var btn=this;	
						btn.timer=setTimeout(function(){Animate(btn.lastChild).fadeOut()},500);
					}
				};
				// 根据配置控制是否显示分享按钮
				if(config.showShareButton){
					share=U.createElem('div');
					share.className='ins-share';
					share.innerHTML='<a href="javascript:;" title="分享图片" class="ins-icon ins-icon-share"></a><div class="ins-bubble"><dl><dt><em class="ins-arrow-top"></em></dt><dd><a href="javascript:;" class="ins-share-sina" title="新浪微博"></a><a href="javascript:;" class="ins-share-tx" title="腾讯微博"></a><a href="javascript:;" class="ins-share-qz" title="QQ空间"></a><a href="javascript:;" class="ins-share-renren" title="人人网"></a></dd></dl></div>';
					theme.appendChild(share);
					_.share=share;
					// 绑定事件
					share.onmouseover=overHandler;
					share.onmouseout=outHandler;
					share.onclick=function(e){
						var event=U.getEvent(e),tar=U.getTarget(event);
						if(tar.tagName!='A'||tar.className.indexOf('ins-share-')==-1)
							return;
						var picUrl=encodeURIComponent(_.image.src),shareTo=tar.className.replace("ins-share-",""),widgetSid=_.adsData.widgetSid,time=new Date().getTime(),
							title=encodeURIComponent(document.title),url=encodeURIComponent(location.href),
			    			recordUrl=config.surl+"?content=''&imgUrl="+encodeURIComponent(picUrl)+"&widgetSid="+widgetSid+"&pageUrl="+encodeURIComponent(location.href)+"&shareTo="+shareTo+"&time="+time,
							winStr="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500";
						switch(tar.className){
							case "ins-share-sina":
							window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
                    		break;
                    		case "ins-share-tx":
                    		window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
                    		break;
                    		case "ins-share-qz":
                    		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?showcount=1&url='+url+'&title='+title+'&pics='+picUrl+'&summary=','_blank',winStr);
                    		break;
                    		case "ins-share-renren":
                    		window.open('http://share.renren.com/share/buttonshare.do?link='+url,"_blank",winStr);
                    		break;
						}
						U.importFile('js',recordUrl);     //记录分享行为
					}
				}

				box.appendChild(theme);
				_.container.appendChild(box);
				_.controlBox=box;
				_.control=control;

				// 绑定事件
				control.onmouseover=overHandler;
				control.onmouseout=outHandler;
				U.bind(control.firstChild,'click',function(){
					var p=control.getElementsByTagName('p')[0];
					if(_.isOn==true){
						InstreetAd.slideIn(_);
						_.isOn=false;
						p.innerHTML='尚街已关闭';

					}else{
						InstreetAd.slideOut(_);
						_.isOn=true;
						p.innerHTML='尚街已开启';
						_.recordShow(9);  //记录1次广告展示
					}
				});

			},
			createContainer :function () {
				var _=this,w=sizeList[config.sizeNum*2],
					box=U.createElem('div'),
					close=U.createElem('a'),
				    wrapper=U.createElem('div'),
				    fragment=document.createDocumentFragment(),
				    line=U.createElem('div'),
				    borderBox=U.createElem('div'),
				    nav=U.createElem('ul'),
				    content=U.createElem('div'),
				    footer=_.createFooter();
				box.className="instreet-plugin-box";
				close.className='ins-btn-close ins-btn-'+themeList[config.theme]+'style';
				close.href='javascript:;';close.title='关闭广告';
				close.innerHTML='×';
				wrapper.className="ins-wrapper ins-"+themeList[config.theme]+"style ins-size"+w;
				css.set(box,'visibility','hidden');
				css.set(wrapper,'width',0);
				css.set(close,'display','none');
				line.className="ins-colorline clearfix";
				borderBox.className="ins-borderbox";
				nav.className="ins-main-nav";
				content.className="ins-main-content";				
				fragment.appendChild(line);fragment.appendChild(nav);fragment.appendChild(content);fragment.appendChild(footer);
				
				borderBox.appendChild(fragment);
				wrapper.appendChild(borderBox);
				box.appendChild(close);
				box.appendChild(wrapper);
				_.container.appendChild(box);
				// 添加属性
				_.close=close;
				_.nav=nav;
				_.content=content;
				_.footer=footer;
				_.box=box;
			},
			createApps   : function(){

				var _ = this,timer=null,box=_.box;
				var fillLine = function(){
					var line=U.$$(_.box,'ins-colorline')[0],len=_.nav.children.length;
					line.className+=" ins-column"+len,str="";
					len=len==5?len:len==4?len:6;
					for(var i=0;i<len;i++){
						str+='<span class="'+themeList[i]+'"></span>'
					}
					line.innerHTML=str;
				},
				overHandler = function(){

					clearTimeout(timer);
					if(!_.isOn){
						return;
					}
					_.recordShow(10) ;//记录鼠标mouseover到图片的行为
					InstreetAd.slideOut(_);

				},
				outHandler = function(){
					if(!_.isOn){
						return;
					}
					timer = setTimeout(function(){
						InstreetAd.slideIn(_);
					},config.timer);

				};
				// 创建apps
				for(var i in InstreetAd.apps){
					InstreetAd.apps[i]&&InstreetAd.apps[i](_);
				}
				// 填充clolorline
				fillLine();
				// 为图片绑定mouseover、mouseout事件
				U.bind(_.image,'mouseover',overHandler);
				U.bind(_.image,'mouseout',outHandler);
				// 为plugin-box绑定mouseover、mouseout事件
				U.bind(_.box,'mouseover',overHandler);
				U.bind(_.box,'mouseout',outHandler);
				// 关闭按钮点击事件
				U.bind(_.close,'click',function(){InstreetAd.slideIn(_)});
				// 统计鼠标mouseover到广告内容的行为
				_.content.onmouseover = function(e){
					var event=U.getEvent(e),rel=U.getRelatedTarget(event);
					if(!this.contains(rel)){
						_.recordWatch();
					}
				};
				// 为controller绑定mouseover事件
				U.bind(_.controlBox,'mouseover',function(){clearTimeout(timer);});
				_.nav.className+=' ins-nav'+_.nav.children.length;
				_.content.firstChild.className+=" content-item-selected";
			},
			createNavItem : function(type,text){
				var _=this,li=U.createElem('li');
				li.className=_.nav.children.length?'nav-item':'nav-item first selected';
				li.innerHTML='<div><em class="icon-'+type+'"></em><span>'+text+'</span></div>';
				_.nav.appendChild(li);
				// 为nav-item绑定事件
				var timer=null;
				li.onmouseover=function(){

					if(this.className.indexOf('selected')==-1){
						var li=this;

						timer = setTimeout(function(){

							var nav=U.$$(_.nav,'selected')[0],content=U.$$(_.content,'content-item-selected')[0],
								next=U.$$(_.content,type+'-item')[0],borderbox=_.nav.parentNode,wrapper=borderbox.parentNode;
							nav.className=nav.className.replace(" selected","");
							li.className+=" selected";
							Animate(content).stop(true).animate({'opacity':0},200,function(){
								this.className=this.className.replace(" content-item-selected","");
								next.className+=" content-item-selected";
								css.set(next,{'opacity':1});
								css.set(wrapper,'height',css.get(borderbox,'height'));
								_.recordShow(9); //记录广告展现
							});							
						},200);

					}	

				};
				li.onmouseout=function(){
					// 清除定时器
					clearTimeout(timer);
					timer=null;
				};
			},
			createFooter : function(){
				var _=this,footer=U.createElem('div'),list=footer.getElementsByTagName('li');
				footer.className="ins-footer";
				footer.innerHTML='<div>powered by <a target="_blank" href="http://www.instreet.cn" title="尚街网">instreet</a><ul class="theme-list"><li><a class="red" index="0" href="javascript:;"></a></li><li><a class="yellow" index="1" href="javascript:;"></a></li><li><a class="green" index="2" href="javascript:;"></a></li><li><a class="blue" index="3" href="javascript:;"></a></li><li><a class="purple" index="4" href="javascript:;"></a></li><li><a class="brown" index="5" href="javascript:;"></a></li></ul></div>';
				list[config.theme].className="selected";
				// 为li绑定点击事件
				footer.onclick=function(e){

					var event=U.getEvent(e),tar=U.getTarget(event);
					if(tar.parentNode.tagName=="LI"||tar.tagName=='LI'){

						var theme=tar.tagName=='LI'?tar.firstChild.getAttribute("index"):tar.getAttribute("index");
						if(config.theme!=theme){							
							changeTheme(theme);
						}

					}

				};
				return footer;
			},
			locate   :  function(){     //定位instreet-plugin-box

				var _=this;
				clearTimeout(_.timer);

				_.timer=setTimeout(function(){
					var img=_.image,pos=U.getXY(img),w=sizeList[config.sizeNum*2]+18,h=parseFloat(css.get(_.box,'height')),top=pos.y+"px",maxTop=pos.y+img.clientHeight-h,
					W=Math.max(document.body.clientWidth,document.documentElement.clientWidth),scrollTop=window.pageYOffset||document.documentElement.scrollTop||0;
					_.imageInfo={width:img.clientWidth,height:img.clientHeight,x:pos.x,y:pos.y,scrollTop:scrollTop,src:img.src};
					//判断是否显示广告框
					if(U.isVisible(img)&&img.clientWidth>=config.imiw&&img.clientHeight>=config.imih){
						// 定位control
						css.set(_.controlBox,{top:(pos.y+5)+'px',left:(pos.x+5)+'px','display':'block'});
						// 显示instreet-plugin-box
						css.set(_.box,'visibility','visible');
					}else{
						css.set(_.controlBox,'display','none');
						css.set(_.box,'visibility','hidden');
					}
					// 定位
					if(scrollTop>maxTop){
						top=maxTop+"px";
					}else if(pos.y<scrollTop&&scrollTop<=maxTop){
						top=scrollTop+"px";
					}
					// 判断图片右侧空间是否充足
					if(W<(pos.x+img.clientWidth+w)){
						var right=(W-pos.x-img.clientWidth)+"px";						
						css.set(_.box,{'top':top,'right':right,'left':'auto'});
						css.set(_.box.lastChild.lastChild,{left:0,right:'auto'});
					}else{
						var left=(pos.x+img.offsetWidth)+"px";
						css.set(_.box,{'top':top,'left':left,'right':'auto'});
						css.set(_.box.lastChild.lastChild,{left:'auto',right:0});
					}
					
					// 自动展示广告
					if(config.footAuto&&_.isFirstShow){
						_.recordShow(9);	//记录广告展示
						InstreetAd.slideOut(_);
						_.isFirstShow=false;
					}
											
				}
				,100);

			},
			checkLocation : function(){		//检察位置是否正确

				var _=this,img=_.image,pos=U.getXY(img),info=_.imageInfo,scrollTop=window.pageYOffset||document.documentElement.scrollTop||0;

				if(typeof info=="undefined"){
					return;
				}

				if(img.clientWidth<=0||img.clientHeight<=0){   //针对原图被删除或者display为none的情况              		
        			var images=document.images;
        			for(var i=images.length;i--;){

        				if(images[i].src==img.src&&images[i].clientWidth>=config.imiw&&images[i].clientHeight>=config.imih){
        					_.image=images[i];
        					_.locate();
        					return;
        				}
        			}
        			_.locate();
        		}else if(typeof img.src!="undefined"&&img.src!=info.src){  //幻灯片，图片src发生变化
   
        			info.src=img.src;
        			removeOldDom(_.insIndex);
        			typeof config.adsLimit=='number'&&config.adsLimit++;
					requestAdsData(img);										
				 
        		}else if(pos.x!==info.x||pos.y!==info.y||scrollTop!==info.scrollTop||img.clientWidth!==info.width||img.clientHeight!==info.height){	   //图片位置或者尺寸发生变化					
					
					_.locate();

				}
			},
   		   recordShow : function(flag){  //统计广告展示次数
   		   		// flag为10表示鼠标mouseover到图片
   		   		// flag为9表示广告展示次数
		       var _=this,data=_.adsData,img=_.image
				   ,ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash
				   ,iu=encodeURIComponent(encodeURIComponent(img.src)),
				   adsId="",adsType="",index=0,mx='',time=new Date().getTime(),w=parseFloat(_.box.lastChild.style.width);
				if(flag==10&&w>0)	//如果广告已经展示则不记录图片mouseover行为
					return;

				var selected=U.$$(_.content,'content-item-selected')[0];
				if(selected){	
					if(selected.className.indexOf('ad-item')!=-1){	//推广
						var app=data.badsSpot[0]; 
						adsId=app.adsId;
						adsType=app.adsType;
						//增加第三方广告展现统计
						app.adViewMonitorUrl&&U.importFile('js',app.adViewMonitorUrl+'?time='+time);
					}else if(selected.className.indexOf('shop-item')!=-1){	//折扣
		
						index=_.getSelectedIndex();
						var app=data.adsSpot[index];
						adsId=app.adsId;
						adsType=app.adsType;						
						mx=app.metrix;
					}else if(flag==9){ //如果展示的不是推广或者折扣并且flag==9，退出
						return;
					}
				}else if(flag==9){  //如果没有应用被展示则不记录广告展示
					return;
				}
				ul+="?pd="+pd+"&mx="+mx+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
				U.importFile('js',ul);
						   
		   },   		   
 	       recordWatch:function(){   	//统计鼠标移动到广告或者微博、百科等内容的用户行为	       

			      var  _=this,data=_.adsData,
			      	   img=_.image,
					   iu=encodeURIComponent(encodeURIComponent(img.src)),
					   pd=data.widgetSid,
					   url=config.murl,
					   mid=data.imageNumId||'',
					   muh=data.imageUrlHash,
					   adData,
					   ad='',
					   at='',
					   tg='',
					   ift=0,
					   tty=1,
					   mx='';
                    var tar=U.$$(_.content,'content-item-selected')[0],cn=tar.className;
                    if(cn.indexOf('shop-item')!=-1){
                       var index=_.getSelectedIndex(),app=data.adsSpot[index];
					   ad=app.adsId;
					   at=app.adsType;
					   mx=app.metrix;
					   tty=0;
					}else if(cn.indexOf('ad-item')!=-1){
					   ad=data.badsSpot[0].adsId;
					   at=data.badsSpot[0].adsType;
					   tty=0;					
					}else if(cn.indexOf('weibo-item')!=-1){
					   ift=2;
					}else if(cn.indexOf('wiki-item')!=-1){
					   ift=4;
					}else if(cn.indexOf('weather-item')!=-1){
					   ift=7;
					}else if(cn.indexOf('news-item')!=-1){
					   ift=5;
					}else{
						return;
					}
					var time=new Date().getTime();  								
					url+="?iu="+iu+"&mx="+mx+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&at="+at+"&tty="+tty+"&ift="+ift+"&time="+time;				
					U.importFile('js',url);				
			},
		    getSelectedIndex : function(){
			   	 var _=this,slider=U.$$(_.content,'slider-nav')[0],selected;
			 	 selected=slider&&U.$$(slider,'selected')[0];
			 	 if(!selected)
			 	 	return 0;
			 	 else
			 	 	return selected.getAttribute("index");

		   }
		});
		

		InstreetAd.slideOut = function(obj){

			var _=obj,box=_.box,wrapper=box.lastChild,borderbox=wrapper.lastChild,w=parseFloat(css.get(wrapper,'width')),W=css.get(borderbox,'width'),H=css.get(borderbox,'height');
			Animate(_.control.firstChild).fadeIn();
			_.share&&Animate(_.share.firstChild).fadeIn();
			if(w<=0){
				css.set(wrapper,'height',H);
				Animate(wrapper).animate({width:W},300,function(){css.set(box.firstChild,'display','block')});
			}

		};
		InstreetAd.slideIn = function(obj){
			var _=obj,box=_.box,wrapper=box.lastChild;
			Animate(_.control.firstChild).animate({opacity:0.7});
			_.share&&Animate(_.share.firstChild).fadeOut();
			Animate(wrapper).animate({width:0},function(){css.set(box.firstChild,'display','none')});

		};

		// 静态属性
		InstreetAd.apps = {
			// 推广
			adApp   : function(obj){

				if(!config.showFootAd||obj.adsData.badsSpot.length==0)
					return;				
				obj.createNavItem('ad','推广');		//创建nav-item

				var data=obj.adsData,app=data.badsSpot[0],ad=U.createElem('div'),redUrl,str="",
					w=sizeList[config.sizeNum*2],h=sizeList[config.sizeNum*2+1];
				ad.className="content-item ad-item";
				//增加第三方点击监控
				if(app.adClickMonitorUrl){
					var monitorUrl=app.adClickMonitorUrl+encodeURIComponent(encodeURIComponent(app.adsLinkUrl||''));
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
			// 折扣
			shopApp : function(obj){
				if(!config.showAd||obj.adsData.adsSpot.length==0)
					return;
				obj.createNavItem('shop','折扣');	 //创建nav-item

				var data=obj.adsData,shop=U.createElem('div'),list=U.createElem('div'),slider=U.createElem('ul'),
					redUrl,title,price,imgUrl,nick,app;						
				shop.className="content-item shop-item";
				list.className="album-list";
				slider.className="slider-nav";
				for(var i=0,len=data.adsSpot.length;i<len;i++){
					var album=U.createElem("a");

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
				}
				shop.appendChild(list);
				shop.appendChild(slider);
				list.firstChild.className+=" selected";
				if(slider.firstChild)
					slider.firstChild.className+=" selected";
				obj.content.appendChild(shop);
				// 为slider-nav绑定事件
				slider.onmouseover=function(e){
					var event=U.getEvent(e),tar=U.getTarget(event),selected=U.$$(this,'selected')[0],
						w=parseFloat(css.get(list.firstChild,'width'));
						
					
					if(tar.className=="switch-trigger"){
						selected.className="switch-trigger";
						tar.className+=" selected";
						var end=-parseInt(tar.getAttribute("index"))*w;
						Animate(list).animate({'left':end},function(){
							obj.recordWatch();
						});
					}
				}
			},
			// 微博
			weiboApp : function(obj){
				if(!config.showWeibo||obj.adsData.weiboSpot.length==0)
					return;
				obj.createNavItem('weibo','微博');
				var data=obj.adsData,weibo=U.createElem("div"),list=U.createElem('ul'),str="",avatar,
					icon,title,article,redUrl,cn='';
				weibo.className="content-item weibo-item";
				list.className="ins-weibo-list";

				for(var i=0,len=data.weiboSpot.length;i<len;i++){
					var app=data.weiboSpot[i],arr=app.avatar.split('/');
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
				}

				list.innerHTML=str;
				weibo.appendChild(list);
				obj.content.appendChild(weibo);				
			},
			// 百科
			wikiApp  : function(obj){

				if(!config.showWiki||obj.adsData.wikiSpot.length==0)
					return;				
				obj.createNavItem('wiki','百科');

				var data=obj.adsData,wiki=U.createElem("div"),list=U.createElem('ul'),str="",avatar,
					title,article,redUrl,cn='';
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
				}

				list.innerHTML=str;
				wiki.appendChild(list);
				obj.content.appendChild(wiki);	

			},
		    // 新闻
		    newsApp  : function(obj){

				if(!config.showNews)
					return;
				obj.createNavItem('news','新闻');
				var data=obj.adsData,news=U.createElem('div'),w=sizeList[config.sizeNum*2],h=sizeList[config.sizeNum*2+1],
				newsUrl=prefix+"news?size="+w+"&pd="+data.widgetSid+"&muh="+data.imageUrlHash;
				news.className="content-item news-item";
				news.innerHTML='<iframe name="weather_inc" src="'+newsUrl+'" width="'+w+'" height="'+h+'" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
				obj.content.appendChild(news);
		    },
		    //天气
		    wheatherApp : function(obj){
				if(!config.showWeather)
					return;
				obj.createNavItem('weather','天气');
				var weather=U.createElem("div"), w=sizeList[config.sizeNum*2],
				weatherUrl="http://www.thinkpage.cn/weather/weather.aspx?uid=&cid=101010100&l=zh-CHS&p=TWC&a=1&u=C&s=1&m=0&x=1&d=3&fc=&bgc=&bc=&ti=1&in=1&li=2&ct=iframe";
		    	weather.className="content-item weather-item";
		    	weather.innerHTML='<iframe name="weather_inc" src="'+weatherUrl+'" width="'+w+'" height="110" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="true" ></iframe>';
		    	obj.content.appendChild(weather);
		    } 

		};

		//  对所有的instreetAd对象重新定位
		var checkLocation = function(){

			var arr=adsObjectArray;
			function loop(){
				for(var i=0;i<arr.length;i++){
					arr[i]&&arr[i].checkLocation();
				}
				setTimeout(loop,400);
			};
			setTimeout(loop,400);

		};
		// mix config 对象
		var mixConfig=function(c){
		   if(c&&typeof c=="object"){

		     for(var i in c){
			    config[i]=c[i];
			 }
		   
		   }else{
		     return;		   
		   }
		
		};
		//插件初始化
		var init=function(){
			// 引入css文件
			var cssUrl=config.cssurl;
			U.importFile('css',cssUrl);
			// 创建container
			container=U.createElem("div");
			container.className="instreet-plugin-container";
			css.set(container,'display','none');
			document.body&&document.body.firstChild&&document.body.insertBefore(container,document.body.firstChild);
			// 获取cookie
			var theme=U.getCookie('instreet_theme');
			config.theme=theme||0;
			// 请求图片关联的广告数据
			var images=document.getElementsByTagName('img');
			for(var i=0,len=images.length;i<len;i++){
		   	  var img=images[i];
		   	  imagesList[i]=img;
		   	  img.ins_index=i;
		   	  img.setAttribute("instreet_img_id",i);
		   	  requestAdsData(img);
			}
			// check location是否反生变化
			checkLocation();
		};

		// 执行init方法
		domReady(function () {
			if(typeof instreet_config!="undefined"){		//mix配置信息
			 	mixConfig(instreet_config);
	     	} 
			init();
		});
})(window);