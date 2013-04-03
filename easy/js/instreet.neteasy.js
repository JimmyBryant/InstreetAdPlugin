/*
	instreet.neteasy.js v0.0.1

	网易合作订制的广告形式
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
   config = instreet_config,
   tipWidth=25,
   sizeList=[300,195,125,250,200,300],   //广告尺寸数组，w=config.style*2 ,h=config.style*2+1
   firstImage = null,
   isArticle = false,
   netEasyObj = null,
   container,
   timer=2000 ; 

   var provinceList={
   		'北京':['北京'],
   		'上海':['上海'],
   		'江西':["南昌市","景德镇市","萍乡市","九江市","新余市","鹰潭市","赣州市","吉安市","宜春市","抚州市","上饶市"],
   		'重庆':['重庆'],
   		'天津':['天津'],
   		'河北':["石家庄市","唐山市","秦皇岛市","邯郸市","邢台市","保定市","张家口市","承德市","沧州市","廊坊市","衡水市"],
   		"浙江":["杭州市","宁波市","温州市","嘉兴市","湖州市","绍兴市","金华市","衢州市","舟山市","台州市","丽水市"],
   		"安徽":["合肥市","芜湖市","蚌埠市","淮南市","马鞍山市","淮北市","铜陵市","安庆市","黄山市","滁州市","阜阳市","宿州市","巢湖市","六安市","亳州市","池州市","宣城市"],
   		"福建":["福州市","厦门市","莆田市","三明市","泉州市","漳州市","南平市","龙岩市","宁德市"],
   		"山东":["济南市","青岛市","淄博市","枣庄市","东营市","烟台市","潍坊市","济宁市","泰安市","威海市","日照市","莱芜市","临沂市","德州市","聊城市","滨州市","荷泽市"],
   		"河南":["郑州市","开封市","洛阳市","平顶山市","安阳市","鹤壁市","新乡市","焦作市","濮阳市","许昌市","漯河市","三门峡市","南阳市","商丘市","信阳市","周口市","驻马店市"],
   		"湖北":["武汉市","黄石市","十堰市","宜昌市","襄樊市","鄂州市","荆门市","孝感市","荆州市","黄冈市","咸宁市","随州市","恩施土家族苗族自治州","仙桃市","潜江市","天门市","神农架林区"],
   		"湖南":["长沙市","株洲市","湘潭市","衡阳市","邵阳市","岳阳市","常德市","张家界市","益阳市","郴州市","永州市","怀化市","娄底市","湘西土家族苗族自治州"],
   		"广东":["广州市","深圳市","珠海市","汕头市","韶关市","佛山市","江门市","湛江市","茂名市","肇庆市","惠州市","梅州市","汕尾市","河源市","阳江市","清远市","东莞市","中山市","潮州市","揭阳市","云浮市"]
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
				   var parent=document,tag='*';
				   if(arguments.length==1){
				   		className=parentNode;
				   }else{
				   		parent=parentNode||document;
					    if(arguments.length==2){  				   		
				   	    	className=tagName;
				  		 }else{
					    	tag=tagName||'*';
				   		}
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
				 head=document.getElementsByTagName( "head" )[0] || document.documentElement;
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

		// 获取页面第一张图片
		var getFirstImage = function(){

			var endText = document.getElementById('endText'),
				photoarea = U.$$('photoarea')[0],
				images;

			if(endText!=null&&typeof endText!='undefined'){ //文章页
				isArticle = true;
				images=endText.getElementsByTagName('img');

				for(var i=0,len=images.length;i<len;i++){
					if(images[i].parentNode.className.indexOf('f_center')!=-1){
						firstImage=images[i];
						reloadImage(firstImage);
						return;
					}
				}
			}else if(photoarea){	//图库页

				images = photoarea.getElementsByTagName('img');
				console.log(photoarea.className)
				for(var i=0,len=images.length;i<len;i++){
					console.log(images[i].parentNode)
				}
			}
		};
		// 图像加载后的处理函数
		var imageHandler = function(img){
			var w=img.width,h=img.height,W=sizeList[config.style*2],H=sizeList[config.style*2]+1;
			if(parseInt(config.style)<3){
				if(w>=W&&h>=H&&firstImage.clientWidth>=W&&firstImage.clientHeight){
					firstImage.setAttribute('instreet_image',true);
					netEasyObj = new NetEasyTip(firstImage,config.style);
				}
			}
		};
		//重加载图片，获取图片的尺寸
		var reloadImage = function(img){

			var image = new Image();
		 	if(typeof img.src=="undefined")        //没有src属性则退出
			 	return;
			 image.src=img.src;
			 image.ins_index=img.ins_index;
			 if(image.complete){
			    imageHandler&&imageHandler(image);
			 }else{
				 image.onload=function(){					   
				   var obj=this;
				   obj.onload=null;
				   imageHandler&&imageHandler(image);  
				 }				 
		     }
		};
		// 简单的extend 方法
		var extend = function  (base,ext) {			
			for(var i in ext){
				base[i] = ext[i];
			}
		};
		// NetEasyTip类
		var NetEasyTip = function(img,style){
			this.image = img;
			this.style = style;
			this.timer = null;
			this.timerSlider=null;
			this.init();
		};
		NetEasyTip.fn=NetEasyTip.prototype;
		extend(NetEasyTip.fn,{
			init :function(){
				var _=this;
				_.create();
				_.locate();
				_.bindEvents();
				U.bind(window,'resize',function(){_.locate();});
			},
			create :function(){
				var _=this,tipImageSrc='images/tip1.jpg',tipLink='#',
					contImageSrc=config.style==1?'images/car4.jpg':'images/car3.jpg',contLink='#',slogan='新轩逸-首付2.38万元起》';

				var box = U.createElem('div'),
					wrap = U.createElem('div'),
					nav = U.createElem('div'),
					cont = U.createElem('div');
				box.className="instreet-plugin-box";
				wrap.className="ins-wrapper ins-style"+config.style;
				nav.className="ins-main-nav";
				cont.className="ins-main-content";
				nav.innerHTML='<a class="ins-tab" target="_blank" href="'+tipLink+'"><img src="'+tipImageSrc+'"></a><div class="ins-btn-close" title="关闭广告"><span>×</span>关闭</div>'
				cont.innerHTML='<div class="ins-content-item ins-ad-item"><div class="ins-content-wrapper"><a class="ad-thumb" target="_blank" title="" href="'+contLink+'"><img src="'+contImageSrc+'"></a></div></div>';
				if(_.style==2){
					cont.innerHTML+='<div class="ins-form"><div class="ins-control-group"><label class="control-label">省份：</label><div class="ins-controls"><select class="ins-select ins-province"></select></div></div><div class="ins-control-group"><label class="control-label">城市：</label><div class="ins-controls"><select class="ins-select ins-city"><option>北京</option></select></div></div><div class="ins-control-group"><label class="control-label">姓名：</label><div class="ins-controls"><input type="text" value="请输入您的姓名" class="ins-text ins-text-tip ins-name"/><dl class="ins-error-tip"><dt><em class="ins-arrow-outer"></em><em class="ins-arrow-inner"></em></dt><dd>请输入您的姓名</dd></dl></div></div><div class="ins-control-group"><label class="control-label">手机：</label><div class="ins-controls"><input type="text" maxlength="11" value="请输入您的手机号码" class="ins-text ins-phone ins-text-tip"/><dl class="ins-error-tip"><dt><em class="ins-arrow-outer"></em><em class="ins-arrow-inner"></em></dt><dd>请输入11位手机号码</dd></dl></div></div><div class="ins-control-group"><label class="control-label"></label><div class="ins-controls"><a href="javascript:;"class="ins-btn-submit">预约试驾</a></div></div></div><p class="ins-brand-slogan"><a href="#" target="_blank">'+slogan+'</a></p>';					
				}
				cont.innerHTML+='<div class="ins-content-footer"><div title="关闭" class="ins-btn-close">×</div></div>';
				// 将dom插入页面
				wrap.appendChild(nav);wrap.appendChild(cont);
				box.appendChild(wrap);
				container.appendChild(box);

				var fillProvince = function(){
					var pro=U.$$(_.cont,'ins-province')[0],str='';
					for(var p in provinceList){
						str+='<option>'+p+'</option>'
					}
					pro.innerHTML=str;
				};
				if(_.style==2){
					fillProvince();
				}
				_.box=box;
				_.nav=nav;
				_.cont=cont;
			},
			locate :function(){
				var _=this,timer=5000;
				clearTimeout(_.timer);
				_timer = setTimeout(function(){

					var image=_.image;
					var pos=U.getXY(image),W=sizeList[config.style*2],H=sizeList[config.style*2]+1,
						screenW=Math.max(document.body.clientWidth,document.documentElement.clientWidth);
					_.imageInfo={width:image.clientWidth,height:image.clientHeight,x:pos.x,y:pos.y,src:image.src};
					if(U.isVisible(image)&&image.clientWidth>=W&&image.clientHeight>=H){
						var top=pos.y+'px',left,right;
						if(config.outPosition==1){
							left=(pos.x+image.offsetWidth)+'px';right='auto';
						}else if(config.outPosition==2){
							left='auto';right=(screenW-pos.x-tipWidth-image.offsetWidth)+'px';
						}
						_.box.style.cssText="visibility:visible;top:"+top+";left:"+left+";right:"+right;
					}
					if(config.autoShow&&_.firstShow!=false){
						_.slideOut();
						_.firstShow = false;
	
						setTimeout( function(){
							_.slideIn();
						},timer);
						
					}

				},100);	

			},	
			bindEvents : function(){
				var _ = this,image = _.image;
				var over = function(){
					clearTimeout(_.timerSlider);
					if(_.allowShow!=false){
						_.slideOut();
					}
				},
				out = function(){
					clearTimeout(_.timerSlider);
					_.timerSlider = setTimeout(function(){_.slideIn();},timer);
				};
				U.bind(_.nav,'mouseover',over);
				U.bind(_.nav,'mouseout',out);
				U.bind(_.cont,'mouseover',over);
				U.bind(_.cont,'mouseout',out);
				U.bind(_.image,'mouseover',over);
				U.bind(_.image,'mouseout',function(){out();_.allowShow=true;});

				// 隐藏广告
				var close=_.cont.lastChild.lastChild;
				close.onclick = function(){
					_.slideIn();
					if(config.outPosition==2){
						_.allowShow=false;
					}
				};
				// 移除广告
				var destroy=_.nav.lastChild;
				destroy.onclick = function(){
					// _.box.style.display="none";
					container.removeChild(_.box);
				};
				if(_.style==2){ 
					// 省市联动
					var pro=U.$$(_.cont,'ins-province')[0],
						city=U.$$(_.cont,'ins-city')[0],
						name=U.$$(_.cont,'ins-name')[0],
						tip1=name.value,
						phone=U.$$(_.cont,'ins-phone')[0],
						tip2=phone.value,
						submit=U.$$(_.cont,'ins-btn-submit')[0];
					pro.onchange = function(){
						var p=this.value,str='',provinces=provinceList[p];
						for(var i=0,len=provinces.length;i<len;i++){
							str+='<option value="'+i+'">'+provinces[i]+'</option>'
						}
						city.innerHTML=str;
					};

					name.onfocus = phone.onfocus= function(){
						var tip = this.className.indexOf('ins-name')!=-1?tip1:tip2,
							val=  this.value.replace(/(^\s*)|(\s*$)/g,'');
						if(tip==val){
							this.value="";
							this.className=this.className.replace(' ins-text-tip','');
						}
						this.nextSibling.style.display='none';
					};

					name.onblur = phone.onblur= function(){

						var tip = this.className.indexOf('ins-name')!=-1?tip1:tip2;
						var val=  this.value.replace(/(^\s*)|(\s*$)/g,'');
						if(val==''||val==tip){
							this.value=tip;
							this.className+=' ins-text-tip';
						}
						
					};

					submit.onclick = function(){

						var val = name.value.replace(/(^\s*)|(\s*$)/g,'');
						if(val==''||val==tip1){
							name.nextSibling.style.display='block';
							return;
						}
						val = phone.value.replace(/(^\s*)|(\s*$)/g,'');
						if(val==''||val==tip2||/^1[3|4|5|8][0-9]\d{8}$/.test(val)==false){
							phone.nextSibling.style.display='block';
							return;
						}
					}

				}
			},		
			checkLocation : function(){		//检察位置是否正确

				var _=this,img=_.image,pos=U.getXY(img),info=_.imageInfo;

				if(typeof info=="undefined"){
					return;
				}

				if(typeof img.src!="undefined"&&img.src!=info.src){  //幻灯片，图片src发生变化
   
        			_.locate();									
				 
        		}else if(pos.x!==info.x||pos.y!==info.y||img.clientWidth!==info.width||img.clientHeight!==info.height){	   //图片位置或者尺寸发生变化					
					
					_.locate();

				}
			},
			slideOut : function(){

				var _=this, width = sizeList[config.style*2]+'px';				
				if(parseFloat(css.get(_.cont,'width'))==0){
					Animate(_.cont).stop().animate({width:width});
				}
				
			},
			slideIn : function(){

				var _=this;				
				if(parseFloat(css.get(_.cont,'width'))>0){
					Animate(_.cont).stop().animate({width:0});
				}
			}

		});

		//  对所有的instreetAd对象重新定位
		var checkLocation = function(){

			function loop(){
				netEasyObj&&netEasyObj.checkLocation();
				setTimeout(loop,400);
			};
			setTimeout(loop,400);

		};
		// 初始化方法
		var init = function(){
			// 加载css文件
			var cssUrl = 'css/instreet.neteasy.css';
			U.importFile('css',cssUrl);
			// 创建容器
			container = U.createElem('div');
			container.id="instreet-plugin-container";
			container.style.display="none";
			document.body.firstChild&&document.body.insertBefore(container,document.body.firstChild);
			// 获取页面首张图片
			getFirstImage();
			// 检察定位
			checkLocation();

		};
		
		// dom ready后执行
		domReady(function(){
			init();
		});
})(window);	