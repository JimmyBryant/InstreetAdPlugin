/*
	instreet.metro.js v0.0.4
*/
(function(window,undefined){

	if (window.InstreetWidget&&typeof window.InstreetWidget=='object'){
		return;
	} else {

		window.InstreetWidget = {
			version : "@REVISION@",
	        type    : "InstreetImageWidget",
	        name	: "metro"
		};

	}

	var document = window.document,
		navigator = window.navigator,
		location = window.location,
		host = location.hostname,
		isIE=!!window.ActiveXObject,
		isFirst=true,
		adsObjectArray=[],       //存放广告数据
		imagesList=[],
		sizeList=[250,250],   //广告尺寸数组，w=config.sizeNum*2 ,h=config.sizeNum*2+1
		container=null,
		spotBox=null;

	var createContainer=function(){	//创建容器

		var c=document.createElement("div"),
			s=document.createElement("div"),
			body=document.getElementsByTagName('body')[0]||document.documentElement;
		c.id=c.className="instreet-plugin-container";
		s.id=s.className="ins-spotbox-"+config.color.toLowerCase();
		spotBox=s;
		c.appendChild(s);
		if(body&&body.firstChild){
			body.insertBefore(c,body.firstChild);
			return c;
		}
		return null;

	};

	var prefix="http://push.instreet.cn/";
	var themeList=['red','yellow','green','blue','purple','brown'];
	var config = {	//config对象
			redurl	:	prefix+"click.action",
		callbackurl	:	prefix+"push.action",
			murl	:	prefix+"tracker.action",
			iurl    :	prefix+"tracker90.action",
			ourl	:	prefix+"loadImage.action",
			surl    :   prefix+"share/weiboshare",
			cssurl	:   "http://static.instreet.cn/widgets/push/css/instreet.metro.min.css",
			// cssurl	:   "css/instreet.metro.css",
			imih	:   300,
			imiw	:	300,
			width	:   250,
			height	:   250,
			timer   :   5000,
			sizeNum	:   0,
			color	:   'RED',
			appQuery:   ["adApp","shopApp","weiboApp","wikiApp","newsApp","weatherApp","musicApp","videoApp","shareApp"]	//指定显示的app以及顺序
	};

	var	ev = {	//function util
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
			if(document.getElementsByClassName&&parent.getElementsByClassName) return parent.getElementsByClassName(className);
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
		    var LargeExpDate=null;
		    if(expires!==null)
		    {
		        LargeExpDate = new Date ();
		        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
		    }
		    document.cookie = name + "=" + escape (value)+((expires === null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
		}
	};

	var $=function(id){return document.getElementById(id);}	//simplify document.getElementById
		,
		each=function(arrs,handler){
			if(!arrs){
				return;
			}
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

	var extend=function(obj,add){	//extend object
		if(add){
			if(typeof add=="object"){
				for(var i in add){
					obj[i]=add[i];
				}
			}else if(typeof add=='function'){
				obj[add]=add;
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
	var css = (function(window){

		var css=function(elem){

			this.get=function(name){	//获取单个dom元素css属性值

				var core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,//用于匹配数字
					rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
					rposition = /^(top|right|bottom|left)$/,
					ropacity = /opacity=([^)]*)/,
				    rmargin = /^margin/;

				if(typeof name!='string'){
					return '';
				}
				name=name.replace(/\-(\w)/g, function(){return arguments[1].toUpperCase();});
				var getWidthOrHeight=function(elem,name){	//用于获取elem的width和height

					var ret=name==="width"?elem.clientWidth:elem.clientHeight
						,pt=parseFloat(new css(elem).get('paddingTop'))
						,pb=parseFloat(new css(elem).get('paddingBottom'))
						,pl=parseFloat(new css(elem).get('paddingLeft'))
						,pr=parseFloat(new css(elem).get('paddingRight'));

					ret=(name==="width"?ret-pl-pr:ret-pt-pb)+'px';
					return ret;

				};
				var ret,style,computed;
				//标准浏览器
				if(window.getComputedStyle){
					var width,
						minWidth,
						maxWidth;

					computed = window.getComputedStyle( elem, null );
					style = elem.style;
					name=name==="float"?"cssFloat":name;  //cssFloat获取float

					if ( computed ) {
						ret = computed[ name ];
						// A tribute to the "awesome hack by Dean Edwards"
						// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
						// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
						// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
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

					var left,
						rsLeft;

					style = elem.style;
					ret = elem.currentStyle && elem.currentStyle[ name ];
					name=name==="float"?"styleFloat":name;//styleFloat获取float
					if(name==='opacity'){

						return ropacity.test( (elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?( 0.01 * parseFloat( RegExp.$1 ) ) + "" : 1;

					}else if(name==="width"||name==="height"){

						if(elem.currentStyle[name]==="auto"){    //如果未设置width,height默认返回auto
							ret=getWidthOrHeight(elem,name);
							return ret;
						}

					}

					// Avoid setting ret to empty string here
					// so we don't default to auto
					if ( ret === null && style && style[ name ] ) {
						ret = style[ name ];
					}

					// From the awesome hack by Dean Edwards
					// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

					// If we're not dealing with a regular pixel number
					// but a number that has a weird ending, we need to convert it to pixels
					// but not position css attributes, as those are proportional to the parent element instead
					// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
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
			};
			this.set=function(name,value){	//设置css属性
				// 一次设置多个css属性
				if(name&&typeof name=="object"&&value===undefined){
					var tmpStyle='';
					for(var pro in name){
						if(!window.getComputedStyle&&pro=='opacity'){
							tmpStyle+="filter:alpha(opacity="+100*name[pro]+");";
						}else{
							tmpStyle+=pro+':'+name[pro]+";";
						}
					}
					elem.style.cssText+=";"+tmpStyle;
					return;
				}
				//设置单个css 属性
				name=name.replace(/-([\w])/,function(){return arguments[1].toUpperCase();});
				if(window.getComputedStyle){
					name=name==="float"?"cssFloat":name;
				}else{
					name=name==="float"?"styleFloat":name;
					if(name==="opacity"){
						elem.style.filter="alpha(opacity="+100*value+")";
					}
				}
				elem.style[name]=value;
			};
			return this;
		};

		return function(elem){	//省去调用过程使用new
			return new css(elem);
		};

	})(window);



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
							start=parseFloat(css(elem).get(name));
							end=parseFloat(property[name]);
							fx.custom(start, end);

						}


					}

				}

			}

		};

		Animate.prototype.fadeIn=function(duration, easing, callback){	// fadeIn方法
			var _=this,elem=_.elem;
			if(css(elem).get('display')=='none'){
				css(elem).set({opacity:0,display:'block'});
			}
			_.animate({opacity:1},duration, easing, callback);
		};

		Animate.prototype.fadeOut=function(duration, easing, callback){	// fadeOut方法
			var _=this,elem=_.elem;
			duration=duration||400;
			easing=easing||'swing';
			_.animate({opacity:0},duration,easing,function(){css(elem).set('display','none');callback&&callback();});
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

			var raf,
				self=this;
			this.startTime = new Date().getTime();
			this.start = from;
			this.end = end;

			function t( gotoEnd ) {
				return self.step(gotoEnd);
			}
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
				for (var i in options.animatedProperties ) {
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

			if(name!="opacity"){
				value+="px";
			}
			css(this.elem).set(name,value);

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

	var requestAdsData = function(img){	// 请求图片的广告数据

		var loadImage = function(img,callback){	// 预加载图片

			 var image=new Image();
			 if(typeof img.src=="undefined")        //没有src属性则退出
				return;
			 image.src=img.src;
			 image.insIndex=img.insIndex;
			 if(image.complete){
			    callback&&callback(image);
			 }else{
				 image.onload=function(){
				   var obj=this;
				   obj.onload=null;
				   callback&&callback(image);
				 };
		     }

		};

		var loadHandle = function(img){	// 用于图片onload回调

			var index=img.insIndex,
				clientImg=imagesList[index];
			if(img.width>=config.imiw&&img.height>=config.imih){
				if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih||(clientImg.clientWidth===0&&clientImg.clientHeight===0)){

					if(typeof config.adsLimit=="number"&&config.adsLimit<=0){
						return;
					}

					clientImg.setAttribute('instreet_data_loading',true);//标记正在请求数据
					clientImg.insDataLoading	= true;
					// 为不支持naturalWidth的浏览器增加naturalWidth
					if(typeof clientImg.naturalWidth=="undefined"||typeof clientImg.naturalHeight=="undefined"){
							clientImg.naturalWidth=img.width;
							clientImg.naturalHeight=img.height;
					}
					recordImage(clientImg);	//loadImage action
					createJsonp(clientImg);	//请求广告数据
					config.adsLimit&&config.adsLimit--;
				}
			}

		};

		var createJsonp = function(img){	// createJsonp 跨域请求广告数据

			var w=250,
				h=250;
			if(typeof config.sizeNum=="number"){
				w=sizeList[config.sizeNum*2];
				h=sizeList[config.sizeNum*2+1];
			}
			var iu=encodeURIComponent(encodeURIComponent(img.src)),
			url=config.callbackurl+"?index="+img.insIndex+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
			ev.importFile('js',url);

		};

		loadImage(img,loadHandle);

	};

	var InstreetAd = function(data,container){	// InstreetAd对象

		var img=imagesList[data.index];
		this.insIndex=data.index;
		this.adsData=data;
		this.container=container;
		this.image=img;
		this.spotsArray=[];
		this.param={color:config.color.toLowerCase(),width:config.width||250,height:config.height||250};
		this.timer=null;		//该计时器用于locate函数
		this.timerApp=null;     //该计时器用于应用展示
		this.isFirstShow=true;	//用于标记广告是否是第一次展示
		this.isOn=true;			//标记是否启动尚街

		this.init();	// 初始化对象
	};

	InstreetAd.fn=InstreetAd.prototype;

	extend(InstreetAd.fn,{

		init:	function () {
			var _=this;
			// this.createController();
			this.createContainer();
			this.createApps();
			this.locate();
			this.bindEvent();
		},
		createController : function(){		//创建controller按钮
			var _=this,
				box=document.createElement('div'),
				theme=document.createElement('div'),
				control=document.createElement('div'),
				share,
				str='';
			box.className='instreet-plugin-control';
			theme.className='ins-'+_.param.color+'style';
			control.className="ins-control";
			css(box).set('display','none');
			str+='<a href="javascript:;" target="_self" class="ins-icon ins-icon-control"></a><div class="ins-bubble"><dl><dt><em class="ins-arrow-top"></em></dt><dd><p>尚街已开启</p></dd></dl></div>';
			control.innerHTML=str;
			theme.appendChild(control);

			var overHandler = function(e){	// 事件处理函数
				var event=ev.getEvent(e),rel=ev.getRelatedTarget(event);
				if(!this.contains(rel)){
					this.timer&&clearTimeout(this.timer);
					Animate(this.lastChild).stop().fadeIn();
				}
			};
			var outHandler = function(e){
				var event=ev.getEvent(e),rel=ev.getRelatedTarget(event);
				if(!this.contains(rel)){
					var btn=this;
					btn.timer=setTimeout(function(){Animate(btn.lastChild).fadeOut();},500);
				}
			};
			// 根据配置控制是否显示分享按钮
			if(config.showShareButton){
				share=document.createElement('div');
				share.className='ins-share';
				share.innerHTML='<a href="javascript:;" target="_self" title="分享图片" class="ins-icon ins-icon-share"></a><div class="ins-bubble"><dl><dt><em class="ins-arrow-top"></em></dt><dd><a href="javascript:;" target="_self" class="ins-share-sina" title="新浪微博"></a><a href="javascript:;" target="_self" class="ins-share-tx" title="腾讯微博"></a><a href="javascript:;" target="_self" class="ins-share-qz" title="QQ空间"></a><a href="javascript:;" target="_self" class="ins-share-renren" title="人人网"></a></dd></dl></div>';
				theme.appendChild(share);
				_.share=share;
				// 绑定事件
				share.onmouseover=overHandler;
				share.onmouseout=outHandler;
				share.onclick=function(e){
					var event=ev.getEvent(e),tar=ev.getTarget(event);
					if(tar.tagName!='A'||tar.className.indexOf('ins-share-')==-1)
						return;
					var picUrl=encodeURIComponent(_.image.src),
						shareTo=tar.className.replace("ins-share-",""),
						widgetSid=_.adsData.widgetSid,time=new Date().getTime(),
						title=encodeURIComponent(document.title),
						url=encodeURIComponent(location.href),
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
					ev.importFile('js',recordUrl);     //记录分享行为
				};
			}

			box.appendChild(theme);
			_.container.appendChild(box);
			_.controlBox=box;
			_.control=control;

			// 绑定事件
			control.onmouseover=overHandler;
			control.onmouseout=outHandler;
			ev.bind(control.firstChild,'click',function(){
				var p=control.getElementsByTagName('p')[0];
				if(_.isOn===true){
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
			var _=this,
				w=_.param.width,
				pluginBox=document.createElement('div'),
			    wrapper=document.createElement('div'),
			    fragment=document.createDocumentFragment(),
			    shangIcon=document.createElement('a'),
			    line=document.createElement('div'),
			    borderBox=document.createElement('div'),
			    nav=document.createElement('ul'),
			    content=document.createElement('div'),
			    footer=_.createFooter();
			pluginBox.className="instreet-plugin-box";
			wrapper.className="ins-wrapper ins-"+_.param.color+"style ins-size"+w;
			// css.set(box,'visibility','hidden');
			css(pluginBox).set('display','none');
			css(wrapper).set('width',0);
			shangIcon.className="ins-shang-icon ins-icon-"+_.param.color;
			shangIcon.innerHTML="尚";
			line.className="ins-colorline clearfix";
			borderBox.className="ins-borderbox";
			nav.className="ins-main-nav";
			content.className="ins-main-content";
			fragment.appendChild(line);
			fragment.appendChild(nav);
			fragment.appendChild(content);
			fragment.appendChild(footer);

			borderBox.appendChild(fragment);
			wrapper.appendChild(borderBox);
			pluginBox.appendChild(shangIcon);
			pluginBox.appendChild(wrapper);
			_.container.appendChild(pluginBox);
			// 添加属性
			_.shangIcon=shangIcon;
			_.nav=nav;
			_.content=content;
			_.footer=footer;
			_.box=pluginBox;
		},
		createApps   : function(){

			var _ = this,
				timer=null,
				box=_.box;
			var fillLine = function(){
				var line=ev.$(_.box,'ins-colorline')[0],len=_.nav.children.length;
				line.className+=" ins-column"+len,str="";
				len=len==5?len:len==4?len:6;
				for(var i=0;i<len;i++){
					str+='<span class="'+themeList[i]+'"></span>';
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
			var appQuery=config.appQuery;
			for(var i=0,len=appQuery.length;i<len;i++){	// 创建apps
				var app=appQuery[i];
				insApp[app]&&insApp[app](_);
			}

			fillLine();	// 填充clolorline

			ev.bind(_.image,'mouseover',function(){overHandler();_.showSpots();});
			ev.bind(_.image,'mouseout',function(){outHandler();_.hideSpots();});

			ev.bind(_.box,'mouseover',overHandler);
			ev.bind(_.box,'mouseout',outHandler);

			_.content.onmouseover = function(e){
				var event=ev.getEvent(e),rel=ev.getRelatedTarget(event);
				if(!this.contains(rel)){
					_.recordWatch();
				}
			};
			// 为controller绑定mouseover事件
			// ev.bind(_.controlBox,'mouseover',function(){clearTimeout(timer);});
			_.nav.className+=' ins-nav'+_.nav.children.length;
			_.content.firstChild.className+=" content-item-selected";
		},
		createNavItem : function(type,text){
			var _=this,
				li=document.createElement('li');
			li.className=_.nav.children.length?'nav-item nav-item-'+type:'nav-item nav-item-'+type+' first selected';
			li.innerHTML='<div><em class="icon-'+type+'"></em><span>'+text+'</span></div>';
			_.nav.appendChild(li);
			// 为nav-item绑定事件
			var timer=null;
			li.onmouseover=function(){
				if(_.couldSwitchApp!==false){
					switchApp(_,type);
				}
			};
			li.onmouseout=function(){
				clearTimeout(_.timerApp);	// 清除定时器
				_.timerApp=null;
			};
		},
		createFooter : function(){
			var _=this,
				footer=document.createElement('div');
			footer.className="ins-footer";
			footer.innerHTML='<div><a title="关闭" class="ins-btn-close">×</a>Powered by <a target="_blank" href="http://www.instreet.cn" title="尚街网">Instreet</a></div>';
			return footer;
		},
		locate   :  function(){     //定位instreet-plugin-box

			var _=this;
			clearTimeout(_.timer);

			_.timer=setTimeout(function(){
				var img=_.image,
					pos=ev.getXY(img),
					w=_.param.width+18,
					h=parseFloat(css(_.box).get('height')),
					top=pos.y+"px",
					maxTop=pos.y+img.clientHeight-h,
					W=Math.max(document.body.clientWidth,
					document.documentElement.clientWidth),
					scrollTop=window.pageYOffset||document.documentElement.scrollTop||0,
					zoom=img.width/img.naturalWidth;
				_.imageInfo={width:img.clientWidth,height:img.clientHeight,x:pos.x,y:pos.y,scrollTop:scrollTop,src:img.src};

				//如果图片不符合要求则隐藏广告
				if(!ev.isVisible(img)||img.clientWidth<config.imiw||img.clientHeight<config.imih){
					css(_.controlBox).set('display','none');
					css(_.box).set('display','none');
					return;
				}
				for(var i=_.spotsArray.length;i--;){	//locate spot
					var spot=_.spotsArray[i],
						r=spotDiameter/2,
						x=(pos.x+spot.metrix%3000*zoom-r)+'px',
						y=(pos.y+Math.round(spot.metrix/3000)-r)*zoom+'px';
					css(spot).set({left:x,top:y});
				}
				if(config.scroll===true){	//设置scroll后广告才会滚动
					if(scrollTop>maxTop){
						top=maxTop+"px";
					}else if(pos.y<scrollTop&&scrollTop<=maxTop){
						top=scrollTop+"px";
					}
				}

				// 设置广告显示在图片上还是图片外侧
				var setInner = function(){
					var right=(W-pos.x-img.clientWidth)+"px";
					css(_.box).set({'top':top,'right':right,'left':'auto'});
					// css(_.box.lastChild.lastChild).set({left:0,right:'auto'});
				};
				var setOut = function(){
					var left=(pos.x+img.offsetWidth)+"px";
					css(_.box).set({'top':top,'left':left,'right':'auto'});
					// css(_.box.lastChild.lastChild).set({left:'auto',right:0});
				};
				if(config.outPosition==1){
					setInner();
				}else if(config.outPosition==2){
					setOut();
				}else{
					// 判断图片右侧空间是否充足
					if(W<(pos.x+img.clientWidth+w)){
						setInner();
					}else{
						setOut();
					}
				}

				//如果图片符合要求则展现广告
				if(ev.isVisible(img)&&img.clientWidth>=config.imiw&&img.clientHeight>=config.imih){
					// 定位control
					// css(_.controlBox).set({top:(pos.y+5)+'px',left:(pos.x+5)+'px','display':'block'});
					// 显示instreet-plugin-box
					css(_.box).set('display','block');
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

			var _=this,
				img=_.image,
				pos=ev.getXY(img),
				info=_.imageInfo,
				scrollTop=window.pageYOffset||document.documentElement.scrollTop||0;

			if(typeof info=="undefined"){
				return;
			}

			if(img.clientWidth<=0||img.clientHeight<=0){   //针对中新网bbs页面
				var images=document.images;
				for(var i=images.length;i--;){
					if(images[i].src==img.src&&images[i].clientWidth>=config.imiw&&images[i].clientHeight>=config.imih){
						if(img.insIndex==images[i].getAttribute('instreet_img_id')){
							images[i].insIndex=img.insIndex;
							_.image=images[i];
							_.locate();
							return;
						}
					}
				}

			}
			if(typeof img.src!="undefined"&&img.src!=info.src){  //幻灯片，图片src发生变化

				info.src=img.src;
				removeOldDom(_.insIndex);
				typeof config.adsLimit=='number'&&config.adsLimit++;
				requestAdsData(img);

			}else if(pos.x!==info.x||pos.y!==info.y||scrollTop!==info.scrollTop||img.clientWidth!==info.width||img.clientHeight!==info.height){	   //图片位置或者尺寸发生变化
				_.locate();
			}
		},
		getSelectedIndex : function(){
			var _=this,
				slider=ev.$(_.content,'slider-nav')[0],
				selected;
			selected=slider&&ev.$(slider,'selected')[0];
			if(!selected)
				return 0;
			else
				return selected.getAttribute("index");
		},
		showSpots:function(){
			var _=this,
				spots=_.spotsArray;
			for(var n=spots.length;n--;){
				var spot=spots[n];
				css(spot).set({'display':'block','opacity':'0.5'});
			}
		},
		hideSpots:function(){
			var _=this,
				spots=_.spotsArray;
			for(var n=spots.length;n--;){
				var spot=spots[n];
				css(spot).set({'display':'none','opacity':'0'});
			}
		},
		bindEvent:function(){
			var	_=this,
				shang=_.shangIcon,
				btn_close=ev.$(this.footer,'ins-btn-close')[0];

			var spot_handle=function(e){
				var event=ev.getEvent(e),
					tar=ev.getTarget(event);
				if(tar.tagName=='A'){
					switch(event.type){
						case "mouseover":
							css(tar).set({'display':'block','opacity':'1'});
							switchApp(_,tar.appType);
							if(tar.type=='shop'){
								slideTo(tar);
							}
						break;
						case "mouseout":
							css(tar).set({'display':'block','opacity':'0.5'});
						break;
					}
				}
			};

			ev.bind(btn_close,'click',function(){
				InstreetAd.slideIn(_);
			});
			ev.bind(spotBox,'mouseover',function(e){
				spot_handle(e);
			});
			ev.bind(spotBox,'mouseout',function(e){
				spot_handle(e);
			});
			ev.bind(shang,'mouseover',function(e){
				var event=ev.getEvent(e);
				ev.stopPropagation(event);
				_.couldSwitchApp=false;
				InstreetAd.slideOut(_,function(){
					_.couldSwitchApp=true;
				});
			});
			ev.bind(window,'resize',function(){_.locate();});
		},
		destroy:function(){

		}
	});


	InstreetAd.slideOut = function(obj,callback){

		var _=obj,
			box=_.box,
			wrapper=box.lastChild,
			borderbox=wrapper.lastChild,
			w=parseFloat(css(wrapper).get('width')),
			W=css(borderbox).get('width'),
			H=css(borderbox).get('height');
		// Animate(_.control.firstChild).fadeIn();
		// _.share&&Animate(_.share.firstChild).fadeIn();
		if(w<=0){
			css(_.shangIcon).set('display','none');
			css(wrapper).set('height',H);	//必须给容器设置高度，否则广告无法显示
			Animate(wrapper).animate({width:W},300,function(){callback&&callback();});
			// Animate(wrapper).animate({width:W},300,function(){css(box.firstChild).set('display','block');});
		}

	};
	InstreetAd.slideIn = function(obj){

		var _=obj,
			box=_.box,
			wrapper=box.lastChild;
		// Animate(_.control.firstChild).animate({opacity:0.7});
		// _.share&&Animate(_.share.firstChild).fadeOut();
		Animate(wrapper).animate({width:0},function(){css(_.shangIcon).set('display','block');});
	};

	switchApp = function(metroAd,appType){	//更换要显示的App

		var	_=metroAd,
			type=appType||'',
			li=ev.$(_.nav,'nav-item-'+type)[0]||_.nav.getElementsByTagName('li')[0];

		if(li.className.indexOf('selected')==-1){
			if(_.couldSwitchApp!==false){
				clearTimeout(_.timerApp);
				_.timerApp = setTimeout(function(){
					_.couldSwitchApp=false;
					var nav=ev.$(_.nav,'selected')[0],
						content=ev.$(_.content,'content-item-selected')[0],
						next=ev.$(_.content,type+'-item')[0],
						borderbox=_.nav.parentNode,
						wrapper=borderbox.parentNode;
					nav.className=nav.className.replace(" selected","");
					li.className+=" selected";
					Animate(content).stop(true).animate({'opacity':0},200,function(){
						_.couldSwitchApp=true;
						this.className=this.className.replace(" content-item-selected","");
						next.className+=" content-item-selected";
						css(next).set({'opacity':1});
						css(wrapper).set('height',css(borderbox).get('height'));
						_.recordShow(9); //记录广告展现
					});

				},200);
			}
		}
	};

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

    recordImage=function(img){	//页面加载时向服务器返回符合要求的图片信息
       var iu=encodeURIComponent(encodeURIComponent(img.src)),
	       pd=config.widgetSid,
		   pu=encodeURIComponent(encodeURIComponent(window.location.href)),
		   t=encodeURIComponent(encodeURIComponent(document.title)),
		   ul=config.ourl;
		var time=new Date().getTime();
		  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
		  ev.importFile('js',ul);

    };

    extend(InstreetAd.prototype,{
		recordShow : function(flag){	//统计广告展示次数,flag为10表示鼠标mouseover到图片,flag为9表示广告展示次数
			var _=this,
				data=_.adsData,
				img=_.image,
				ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				iu=encodeURIComponent(encodeURIComponent(img.src)),
				adsId="",
				adsType="",
				index=0,
				mx='',
				time=new Date().getTime(),
				w=parseFloat(_.box.lastChild.style.width);
			if(flag==10&&w>0)	//如果广告已经展示则不记录图片mouseover行为
				return;

			var app=null,
				selected=ev.$(_.content,'content-item-selected')[0];
			if(selected){
			if(selected.className.indexOf('ad-item')!=-1){	//推广
				app=data.badsSpot[0];
				adsId=app.adsId;
				adsType=app.adsType;
				app.adViewMonitorUrl&&ev.importFile('js',app.adViewMonitorUrl+'?time='+time);	//增加第三方广告展现统计
			}else if(selected.className.indexOf('shop-item')!=-1){	//折扣
				index=_.getSelectedIndex();
				app=data.adsSpot[index];
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
			ev.importFile('js',ul);

		},
		recordWatch:function(){	//统计鼠标移动到广告或者微博、百科等内容的用户行为
			var  _=this,
				data=_.adsData,
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
			var tar=ev.$(_.content,'content-item-selected')[0],cn=tar.className;
			if(cn.indexOf('shop-item')!=-1){
				var index=_.getSelectedIndex(),
					app=data.adsSpot[index];
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
			ev.importFile('js',url);
		}
	});

	var removeOldDom = function(index){	// 移除旧的InstreetAd对象的dom元素
		if(adsObjectArray[index]){
			var _=adsObjectArray[index],
				parent=_.box.parentNode,
				p=_.controlBox.parentNode;
			parent&&parent.removeChild(_.box);
			p&&p.removeChild(_.controlBox);
		}
	};

	var checkLocation = function(){	//  对所有的instreetAd对象重新定位

		var arr=adsObjectArray;
		function loop(){
			for(var i=0;i<arr.length;i++){
				arr[i]&&arr[i].checkLocation();
			}
			setTimeout(loop,400);
		}
		setTimeout(loop,400);

	};

	var refilter = function(count){	// 用于window onload时对图片重新过滤
		count=count||0;
		var images = document.getElementsByTagName('img');
		for(var i=0,len=images.length;i<len;i++){
			var img=images[i];
			if(img.insDataLoading===true||img.getAttribute('instreet_data_loading')||img.insDataLoaded===true||img.getAttribute('instreet_data_loaded')){	// 如果已经请求数据则跳过
				continue;
			}
			if(typeof img.insIndex=='undefined'){
				img.insIndex = imagesList.length;
				imagesList.push(img);
			}
			requestAdsData(img);
		}
		// 递归执行4次
		if(count<5){
			setTimeout(function(){refilter(++count);},1000);
		}
	};

    window.insjsonp = function(data){	// 用于jsonp的回调函数

	    if(data){
			var index=data.index,
				img=imagesList[index];
			img.setAttribute('instreet_data_ready',true);
			img.insDataReady=true;
			removeOldDom(index);
			var ad=new InstreetAd(data,container);
			adsObjectArray[index]=ad;
		}

	};

	function init(){	//初始化插件

		 if(typeof instreet_config!="undefined"){		//extend config
			extend(config,instreet_config);
		 }
		 if((container=createContainer())){
			config.cssurl&&ev.importFile('css',config.cssurl);
			var images=document.getElementsByTagName('img');	// 请求图片关联的广告数据
			for(var i=0,len=images.length;i<len;i++){
			var img=images[i];
				imagesList[i]=img;
				img.insIndex=i;
				img.setAttribute("instreet_img_id",i);
				requestAdsData(img);
			}
			checkLocation();	// check location是否反生变化
			ev.bind(window,'load',function(){refilter();});
			// ev.bind(window,'resize',function(){msnCouplet.relocate();});
			// timerTick(cache.adsArray);	//定时检测图片是否切换
		 }

	}

	DOMReady(function(){	//dom ready后开始执行init
		init();	//插件初始化
	});

})(window);