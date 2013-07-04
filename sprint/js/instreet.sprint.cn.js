/*********************************************
*
* instreet.sprint.cn.js v0.1.5
*
*	add 增加图片屏蔽
*
**********************************************/
(function(window,undefined){

		if (typeof window.InstreetWidget!="undefined"||window.InstreetWidget != null){
			return null;
		} else {

			window.InstreetWidget = {
				version : "@REVISION@",
		        type    : "InstreetImageWidget"
			};

		}

	   var document = window.document,
		   navigator = window.navigator,
		   location = window.location,
		   isIE=!!window.ActiveXObject,
		   imgs=[],
	       readylist=[],
		   isFirst=true;

   		/********************************
		*Config对象
		*********************************/
		var prefix="http://push.instreet.cn/";
		var config = {
						redurl	:	prefix+"click.action",
					callbackurl	:	prefix+"push.action",
						murl	:	prefix+"tracker.action",
						iurl    :	prefix+"tracker90.action",
						ourl	:	prefix+"loadImage.action",
						surl    :   prefix+"share/weiboshare",
						cssurl  :	'http://static.instreet.cn/widgets/push/css/instreet.sprint.min.css',
						// cssurl	: 	'css/instreet.sprint.css',
						imih	:	300,
						imiw	:	300,
						timer   :   1000,
						width   :   250,
						height	:   250
		};


        /****************************
        *常用方法对象
        ****************************/
		var ev = {
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
		    $:  function(parentNode,tagName,className){
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
		   importFile  :function(type,name){
				 var link,script,
				 head=document.getElementsByTagName( "head" )[0] || document.documentElement;
				 switch(type){
				   case "js":
				   script=document.createElement('script');
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
				   link = document.createElement("link");link.type = "text/css";link.rel = "stylesheet";
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

			    return ev.isVisible(obj.parentNode);
			}
		};

        var $=function(id){return document.getElementById(id);}
        	,
            each=function(arrs,handler){
            	if(arrs.length){
            		for(var i=0,len=arrs.length;i<len;i++){
            			handler.call(arrs[i],i);
            		}
            	}else{
            		handler.call(arrs,0);
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


        /*********************************
        *扩展DomReady方法
        **********************************/
        var readylist=[];
		var run = function () {
				for (var i = 0; i < readylist.length; i++) readylist[i]&&readylist[i]();
		};
		var doScrollCheck=function(){
			  try {
					document.documentElement.doScroll('left');

			  }catch (err){
					setTimeout(doScrollCheck, 1);
                    return;
			  }
			  run();
	    };

		var DomReady = function (fn){

                var isIE = !!window.ActiveXObject;
                if(document.readyState==="complete") {readylist.push(fn);run();return;}
				if (readylist.push(fn) > 1) return;
				if (document.addEventListener)
				return document.addEventListener('DOMContentLoaded', run, false);

				if (isIE) {
                     doScrollCheck();
			    }

		};

	var css={                                //css对象，用于设置样式或者获取样式

		   get:function(elem,style){

			   var value;
			   if(style == "float"){
				 document.defaultView ? style = 'cssFloat': style='styleFloat';
			   }
			   if(style=="opacity"){
				 document.defaultView ? style = 'opacity': style='filter';
			   }

			   if (document.defaultView && document.defaultView.getComputedStyle) {
				 var value=document.defaultView.getComputedStyle(elem, null)[style];

			   }else if (elem.currentStyle){

					value = elem.currentStyle[style];
					if(style=="filter"){

						if(value.match("alpha")){

							value=parseFloat(value.match(/\d+/)[0])/100;

						}else if(!value){

							value=1;
						}
					}

			   }

			   typeof value=="string"&&value.match("px")?value=parseInt(value.replace("px","")):value;          //如果value包含px则转换成num
			   style=="opacity"?value=parseInt(value):value;
			   return value;

		   },
		   set:function(elem,style,value){

			  if(style=="float"){
				document.defaultView ? style = 'cssFloat': style='styleFloat';
			  }
			  if(style=="opacity"){
				elem.style.filter="alpha(opacity="+value*100+")";
				elem.style.zoom=1;
			  }
				elem.style[style]=value;
		   }



		};
	/**************************
	*animate方法
	*************************/
	var animate=(function(){

	    var timers=[],       //用于存放Fx对象
			timerId;         //全局计时器


		var isEmptyObject=function(obj){            //判断对象是否为空

				for ( var name in obj ) {
					return false;
				}
				return true;

		};

	    var Animate= function	(elem,property, duration, easing, callback){               //js动画入口API

		   var options=Animate.getOpt(duration, easing, callback);                     //修正参数

		   if(elem&&elem.nodeType==1){

			    var start,to;
			    if(property&&typeof property=="object"){

					if(isEmptyObject(property)){             //如果property为空直接执行callback

					    callback.call(elem);

					}else{

					   for(var name in property){

					      var fx=new FX(elem,options,name);
						  start=css.get(elem,name);
						  end=parseFloat(property[name]);
					      fx.custom(start, end);

					   }


					}

				}

		   }

		 };

		Animate.getOpt=function(duration, easing, callback){       // 修正参数

			 var options ={duration:duration||200,easing:easing||"linear"};
			 options.callback=function(){callback&&callback();};
			 return options;

		};

	    Animate.stop=function(elem,end){                               //停止某个dom元素的动画  end为true则会把动画进行到最后一帧 false则停止到当前帧
		    end=end||false;
			for(var i=timers.length;i--;){
			   var fx=timers[i];
			   if(fx.elem===elem){
			    if(end){
				  fx.update(fx.name,fx.end);
				}
			    timers.splice(i,1);
			   }

			}

		};

		var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象

			this.elem=elem;
			this.options=options;
			this.name=name;

		};
		FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

			this.startTime = new Date().getTime();
			this.start = from;
			this.end = end;

			timers.push(this);
			FX.tick();

		};
		FX.prototype.step=function(){
		    var now=new Date().getTime(),
				nowPos;

			if(now>this.options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
			   nowPos=this.end;
			   this.options.callback.call(this.elem);
			   this.stop();
			}else{
			    var n = now - this.startTime;
	            var state = n / this.options.duration;
	            var pos =Easing[this.options.easing](state, 0, 1, this.options.duration);
	            nowPos = this.start + ((this.end - this.start) * pos);
	        }

	        this.update(this.name,nowPos);
		};

		FX.prototype.stop=function(){

			for(var i=timers.length;i--;){

				if(timers[i]===this){
					timers.splice(i,1);
				}
			}

		};

		FX.prototype.update=function(name,value){

			if(name!="opacity")
			{
				value+="px";
			}

			css.set(this.elem,name,value);

		};


		FX.tick = function(){
	        if (timerId) return;                                   //如果计时器已经在走则退出

	        timerId = setInterval(function(){
	            for (var i = 0,len=timers.length;i<len;i++){
	                timers[i]&&timers[i].step();
	            }
	            if (!timers.length){
	                FX.stop();
	            }
	        }, 13);
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

		return Animate;

	})();




     /**********************************
     *TimerTick 方法
     ***********************************/
    var TimerTick=(function(){
    	var timerId=null;   //全局时间函数计时器
    	return function(arr){
             timerId=setInterval(function(){
	         	 for(var i=0;i<arr.length;i++){
					arr[i]&&arr[i].detect();
	         	 }
             },500);
    	};
    })();


    /*********************************
    *cache对象，加载广告数据
    **********************************/
		var cache={

			adsArray   :[],
	        initData   :function(){

			   var images=document.getElementsByTagName('img');
			   for(var i=0,len=images.length;i<len;i++){
			   	  var img=images[i];
			   	  imgs[i]=img;
			   	  img.insId=i;
			   	  img.setAttribute("instreet_img_id",i);
			   	  cache.onImgLoad(img);
			   }

		    },
		    onImgLoad  :function(img){
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
					 }
			    }
		    },
			loadData     :function(img){
			   var index=img.insId,clientImg=imgs[index];
			   if(img.width>=config.imiw&&img.height>=config.imih){
			   	 if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih||(clientImg.clientWidth==0&&clientImg.clientHeight==0)){
				   	   InstreetAd.recordImage(clientImg);	 //loadImage action
			   	    }
			    }
			},
			createJsonp  :function(img){
			   var w=config.width||250,h=config.height||250;
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
			   ev.importFile('js',url);
			}

		};
		// load image action的回调
		window['ins_image_jsonp']=function(data){
			if(data&&data.image_context_sensi==true){
				return;
			}
			var clientImg=imgs[data.index];
			if(typeof config.adsLimit=="number"&&config.adsLimit<=0){
   	  			return;
			}
			clientImg.setAttribute('instreet_data_loading',true);	//标记开始请求该图片的广告数据
			clientImg.insDataLoading= true;
			cache.createJsonp(clientImg);
			config.adsLimit&&config.adsLimit--;
		};
        window['insjsonp']=function(data){

		    if(data){
			  var index=data.index,img=imgs[index];
			  img.insDataLoaded=true;
			  img.setAttribute('instreet_data_loaded',true);
			  var ad=new InstreetAd(data,instreet.container);
			  removeOld(index); //删除旧的dom对象
			  cache.adsArray[index]=ad;
			  // InstreetAd.autoShow(ad);
			}

		};
		// 移除旧的dom对象
		var removeOld = function(index){

			var insAd=cache.adsArray[index];
			if(insAd&&insAd.adWrapper){
				var ad=insAd.adWrapper,
	                parent=ad.parentNode;
                parent&&parent.removeChild(ad);
                // 移除spots
                for(var i=0,len=insAd.spotsArray.length;i<len;i++){
                	var p=insAd.spotsArray[i].parentNode;
                	p&&p.removeChild(insAd.spotsArray[i]);
                }
			}

		};

		/***************************************
		*instreet 对象
		****************************************/
		var instreet={

			init :function(){

				var cssurl=config.cssurl;
				ev.importFile('css',cssurl);
				instreet.createContainer();

			},
			createContainer: function(){						//创建广告容器
		       var container=document.createElement('div'),
			       spotBox=document.createElement('div');
			   container.id="instreet-plugin-container";
			   spotBox.id="instreet-plugin-spotbox";
			   instreet.container=container;
			   instreet.spotBox=spotBox;
			   container.appendChild(spotBox);
			   document.body.children&&document.body.insertBefore(container,document.body.firstChild);
			}


		};



		/***********************************
		*InstreetAd类
		************************************/
		var InstreetAd=function(data,container){
			var img=imgs[data.index];
			this.data=data;
			this.container=container;
			this.img=img;
			this.originInfo={width:img.clientWidth,height:img.clientHeight,src:img.src,pos:ev.getXY(img)};
			this.spotsArray=[];
			this.timerId=null;
			this.init();
		};

		InstreetAd.prototype={

			constructor:InstreetAd,

			isFirstApp:true,

			init    :function(){
				var _=this;
				_.createApps();
				_.locate();
				_.bindEvents();
			},

			createApps :function(){
				var _=this;
				//创建广告容器
				var adWrapper=document.createElement("div"),
				tabWrapper=document.createElement("ul"),
				contentWrapper=document.createElement("ul");
				//根据Position添加不同的class
				if(config.position==0){
					adWrapper.className="in-ad-wrapper in-position-right";
				}else if(config.position==1){
					adWrapper.className="in-ad-wrapper in-position-left";
				}
				// 根据颜色添加不同的class
				if(config.color){
					adWrapper.className+=" in-"+config.color+"style";
				}
				// 根据尺寸添加不同的class
				if(config.width){
					adWrapper.className+=" in-size"+config.width;
				}
				tabWrapper.className="in-tabs-wrapper";
				contentWrapper.className="in-contents-wrapper";
				contentWrapper.style.width="0";
				//创建文档碎片
				var tabFrag=document.createDocumentFragment(),
				contFrag=document.createDocumentFragment();
				for(i in InstreetAd.modules){

					if(typeof InstreetAd.modules[i]=='function'){
						var res=InstreetAd.modules[i](_);
						if(res){
						res.tab&&tabFrag.appendChild(res.tab);
						res.cont&&contFrag.appendChild(res.cont);
						}
					}
				}
				tabWrapper.appendChild(tabFrag);
				contentWrapper.appendChild(contFrag);
				adWrapper.appendChild(tabWrapper);
				adWrapper.appendChild(contentWrapper);
				_.container.appendChild(adWrapper);
				_.adWrapper=adWrapper;
				_.tabs=tabWrapper;
				_.contents=contentWrapper;

			},
			createSpot :function(app,index){
				var oWidth=app.width,metrix=app.metrix,
				    spot=document.createElement("a"),spotContainer=$("instreet-plugin-spotbox");
			    spot.href="javascript:;";
			    spot.index=index;
			    spot.target="_self";
				spot.metrix=metrix;
				spot.imgWidth=oWidth;
			    if(app.adsType)
			      spot.className="instreet-shopSpot";
			    else if(app.type.toString()=="1"||app.type.toString()=="2")
			      spot.className="instreet-weiboSpot";
			    else if(app.type.toString()=="4")
				  spot.className="instreet-wikiSpot";
				this.spotsArray.push(spot);
				spotContainer.appendChild(spot);
			},
			locate   :function(){                            //定位广告
				var _=this,img=_.img,pos=ev.getXY(img)
				,w=img.offsetWidth
				,left=(pos.x+w)+"px"
				,right=(Math.max(document.body.clientWidth,document.documentElement.clientWidth)-pos.x)+'px'
				,top=pos.y+"px",spotsArray=_.spotsArray;

				var	slideLeft=_.isSlideLeft();

				var dis=ev.isVisible(img)&&img.clientWidth>=config.imiw&&img.clientHeight>=config.imih?"block":"none";
				function setFloat(direction){
						if(isIE){
							_.tabs.style.styleFloat=direction;
							_.contents.style.styleFloat=direction;
						}else{
							_.tabs.style.cssFloat=direction;
							_.contents.style.cssFloat=direction;
						}
				};
				if(config.position==0){            //图片右侧
					if(slideLeft){
						setFloat("right");
						_.contents.className="in-contents-wrapper in-contents-slideleft";
						_.adWrapper.style.left="auto";
						_.adWrapper.style.right=(Math.max(document.body.clientWidth,document.documentElement.clientWidth)-pos.x-w-26)+"px";
					}else{
						setFloat("left");
						_.contents.className="in-contents-wrapper";
						_.adWrapper.style.right="auto";
						_.adWrapper.style.left=left;
					}
				}else if(config.position==1){		//图片左侧

					if(slideLeft){
						setFloat("right");
						_.contents.className="in-contents-wrapper";
						_.adWrapper.style.right=right;
						_.adWrapper.style.left="auto";

					}else{
						setFloat("left");
						_.contents.className="in-contents-wrapper in-contents-slideright";
						_.adWrapper.style.left=(pos.x-26)+"px";
						_.adWrapper.style.right="auto";

					}

			    }

				_.adWrapper.style.top=top;
				_.adWrapper.style.display=dis;
				// _.adWrapper.style.cssText="left:"+left+";top:"+top+";display:"+dis;
				// 判断是否自动展现广告
				if(dis=='block'&&config.footAuto&&_.isFirst!=false){

					_.isFirst=false;
					_.showApp();
					_.recordShow(9);

				}

               if(spotsArray.length>0){              //如果存在spot，同时也对其重定位

                     var oWidth=spotsArray[0].imgWidth,
                     	 zoomNum=img.width/oWidth,
					 	 r=15;

	                  for(var j=spotsArray.length;j--;){
	                  	   var  spot=spotsArray[j];
					       metrix=spot.metrix,
						   ox=metrix%3000,
						   oy=Math.round(metrix/3000),
						   x=ox*zoomNum,
						   y=oy*zoomNum;
	 					  spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;display:"+dis;

	                   }

                }
			},
			bindEvents :function(){
				var _=this,list=_.tabs.children,contents=_.contents.children;

				//bind img event
				_.bindImgEvents(_.img);
				// _.findCover();
				_.tabs.onmouseover=function(){
					clearTimeout(_.timerId);
				};
				_.tabs.onmouseout=function(){
					_.timerId=setTimeout(function(){_.closeApp()},config.timer);
				};
			   _.contents.onmouseover=function(){
					clearTimeout(_.timerId);
				};
				_.contents.onmouseout=function(){
					_.timerId=setTimeout(function(){_.closeApp()},config.timer);
				};
				_.contents.onclick=function(e){
					var event=ev.getEvent(e),tar=ev.getTarget(event);
					if(tar.className=='in-close'){
						_.closeApp();
						//防止广告在图片上不能关闭
						if(config.position==0&&_.isLeft||config.position==1&&!_.isLeft){
							_.notopen=true;
						}
						_.cantShow=true;
					}else if(tar.parentNode.className=="in-share-icons"){
						_.shareImg(tar);
					}
					ev.stopPropagation(event);
				};
				// click shop slider item
				var shopSelector=ev.$(_.contents,null,'in-shop-selector')[0];
				shopSelector&&each(shopSelector.children,function(index){
					var item=this;
					item.onclick=function(){
						InstreetAd.chooseItem(this,index);
					};
				});
				// click weibo slider item
				var weiboSelector=ev.$(_.contents,null,'in-weibo-selector')[0];
				weiboSelector&&each(weiboSelector.children,function(index){
					var item=this;
					item.onclick=function(){
						InstreetAd.chooseItem(this,index);
					};
				});

				// click wiki slider item
				var wikiSelector=ev.$(_.contents,null,'in-wiki-selector')[0];
				wikiSelector&&each(wikiSelector.children,function(index){
					var item=this;
					item.onclick=function(){
						InstreetAd.chooseItem(this,index);
					};
				});
				for(var i=0,len=list.length;i<len;i++){

					var tab=list[i],content=contents[i];
					//tab mouseover
					tab.onmouseover=function(){
						if(this.className.match(" focus")){
							return;
						}
						var type=this.lastChild.className;
						_.showApp(this);
						if(type=="ad"||type=="shop"){
							_.recordShow(9);
						}


					};
					//tab mouseout
					// tab.onmouseout=function(){


					// };
					//content mouseover
					content.onmouseover=function(e){
						var event=ev.getEvent(e),tar=ev.getRelatedTarget(event);
						show(this);
						if(!this.contains(tar)){
							_.recordWatch(this);
						}
					};
					//content mouseout
					// content.onmouseout=function(){

					// };

				}
				//spots event
				for(var j=0,l=_.spotsArray.length;j<l;j++){
					var spot=_.spotsArray[j];
					spot.onmouseover=function(){
						clearTimeout(_.timerId);
						switch(this.className){
							case "instreet-shopSpot":
							var tab=ev.$(_.tabs,null,'shop')[0].parentNode,
								sel=ev.$(_.contents,null,'in-shop-selector')[0].children[this.index];
							var isFocus;
							if(sel){
							    isFocus=sel.className.match(" focus");
							}
							else{
								isFocus=tab.className.match(" focus");
							}
							sel&&InstreetAd.chooseItem(sel,this.index);
							_.showApp(tab);
							if(!isFocus){
								_.recordShow(9); //record adShow times
							}
							break;
							case "instreet-weiboSpot":
							var tab=ev.$(_.tabs,null,'weibo')[0].parentNode,
							sel=ev.$(_.contents,null,'in-weibo-selector')[0].children[this.index];
							sel&&InstreetAd.chooseItem(sel,this.index);
							_.showApp(tab);
							break;
							case "instreet-wikiSpot":
							var tab=ev.$(_.tabs,null,'wiki')[0].parentNode;
							sel=ev.$(_.contents,null,'in-wiki-selector')[0].children[this.index];
							sel&&InstreetAd.chooseItem(sel,this.index);
							_.showApp(tab);
							break;
						}
					}
				}

			},
			bindImgEvents  :function(img){           //为图片绑定事件
				var _=this,ap1=$('apDiv1'),ap2=$('apDiv2');
				var over = function () {
					clearTimeout(_.timerId);
					if(_.notopen||_.cantShow){
						return;
					}
					if(_.contents.offsetWidth==0){
						_.showApp();
						_.recordShow(10);
					}
				},
				out = function(){
					clearTimeout(_.timerId);
 					_.timerId=setTimeout(function(){_.closeApp()},config.timer);
 					_.notopen=false;        //image mouseout时记得false该属性
				};
				//img mouseover
				ev.bind(img,'mouseover',over);
				ap1&&ev.bind(ap1,'mouseover',over);
				ap2&&ev.bind(ap2,'mouseover',over);
				//img mouseout
				ev.bind(img,'mouseout',out);
				ap1&&ev.bind(ap1,'mouseout',out);
				ap2&&ev.bind(ap2,'mouseout',out);
			},

			hideApps:function(){
				var _=this,list=_.tabs.children;
				//寻找focus tab
				for(var j=list.length;j--;){
					if(list[j].className.match("focus")){
						list[j].className=list[j].className.replace(" focus","");
					}
				}
				//如果是IE用display:none来隐藏应用
				if(isIE){
					hide(_.contents.children);
				}else{   //否则用visible:hidden
					each(_.contents.children,function(){
						this.style.cssText="display:block;visibility:hidden;height:0;overflow:hidden;"
					});
				}
				if(_.adWrapper.style.width!="auto"){
					_.adWrapper.style.width="auto";
				}
			},
			closeApp:function(){
				this.hideApps();
				this.contents.style.width=0;
			},
			showApp: function(tab){
				var _=this,list=_.tabs.children,type,app,width;
				if(list.length==0){
					return;
				}
				if(!tab){
					tab=list[0];
				}
				type=tab.lastChild.className;
				_.hideApps();
				if(_.adWrapper.style.width=="auto"){
					_.adWrapper.style.width=(config.width+42)+'px';
				}
				tab.className+=" focus";
				//如果是IE用display:block来显示应用
				if(isIE){
					show(ev.$(_.contents,'li',type));
				}
				else{   //否则用visibility:visible
				   each(ev.$(_.contents,'li',type),function(){
						this.style.cssText="display:block;visibility:visible;height:auto;"
				   });
				}
				width=(config.width+16)+"px";
				if(css.get(_.contents,'width')==0){
					animate(_.contents,{width:width},200,'linear');
				}

			},
			getSelectedIndex:function(type){

               var cn='in-'+type+'-selector', sels=ev.$(this.contents,null,cn)[0]?ev.$(this.contents,null,cn)[0].children:[];
               for(var j=0,len=sels.length;j<len;j++){
               		if(sels[j].className.match(" focus")){
               			return j;
               		}
               }
               return 0;
			},
			shareImg :function(icon){
				var _=this,picUrl=encodeURIComponent(_.img.src),shareTo=icon.className.replace("-ico",""),widgetSid=_.data.widgetSid,time=new Date().getTime(),
					title=encodeURIComponent(document.title),url=encodeURIComponent(location.href);
			    var recordUrl=config.surl+"?content=''&imgUrl="+encodeURIComponent(picUrl)+"&widgetSid="+widgetSid+"&pageUrl="+encodeURIComponent(location.href)+"&shareTo="+shareTo+"&time="+time;
				var winStr="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500";
			   switch(icon.className){
				    case "sina-ico":
					window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
                    break;
                    case "renren-ico":
					window.open('http://share.renren.com/share/buttonshare.do?link='+url,"_blank",winStr);
					break;
                    case "tx-ico"   :
					window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
					break;
					case "qzone-ico" :
					window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?showcount=1&url='+url+'&title='+title+'&pics='+picUrl+'&summary=','_blank',winStr);
					break;
					case "sohu-ico"  :
					window.open('http://t.sohu.com/third/post.jsp?url='+url+'&title='+title+'&content=&pic='+picUrl,'_blank',winStr);
					break;
					case "kaixin-ico"  :
					window.open('http://www.kaixin001.com/login/open_login.php?flag=1&url='+url+'&pic='+picUrl+'&content='+title,'_blank',winStr);
					break;
					case "wangyi-ico"  :
					window.open('http://t.163.com/article/user/checkLogin.do?link='+location.host+'source=&info='+title+url+'&images='+picUrl,'_blank',winStr);
			    	break;
			    	case "douban-ico" :
			    	window.open('http://shuo.douban.com/!service/share?image='+picUrl+'&href='+url+'&name='+title,'_blank',winStr);
			    	break;
			    }
			    ev.importFile('js',recordUrl);     //记录分享行为
			},
			isSlideLeft    :function(){						//获取广告slide方向
				var img=this.img,pos=ev.getXY(img),w=config.width+42;
				//判断广告内容显示在图片左侧或者右侧
				if(config.position==0){
					if(config.outPosition==1){
						this.isLeft=true;
					}else if(config.outPosition==2){
						this.isLeft=false;
					}else{
						this.isLeft=pos.x+img.offsetWidth+w>(Math.max(document.body.clientWidth,document.documentElement.clientWidth))?true:false;
					}
				}else if(config.position==1){

					if(config.outPosition==1){
						this.isLeft=false;
					}else if(config.outPosition==2){
						this.isLeft=true;
					}else{
						this.isLeft=w<=pos.x?true:false;
					}
				}
				return this.isLeft;
			},
			detect   :function(){                     //每隔一段时间开始检测图片对象是否change

                var _=this,img=_.img,origin=_.originInfo,
                	ad=_.adWrapper,pos=ev.getXY(img);


                if(img.clientWidth<=0||img.clientHeight<=0){ //针对中新网bbs页面

        			var images=document.images;
        			for(var i=images.length;i--;){
        				if(images[i].src==img.src&&images[i].clientWidth>=config.imiw&&images[i].clientHeight>=config.imih){
        					if(img.insId==images[i].getAttribute('instreet_img_id')){
	        					images[i].insId=img.insId;
	        					_.img=images[i];
	        					origin.pos=pos;       //修改原来的pos值
	        					_.bindImgEvents(_.img);
            					_.locate();
	        					break;
        					}
        				}
        			}

                }

                if(img.src&&img.src!=origin.src){          //针对幻灯图集页面

                    removeOld(img.insId); //删除旧的dom对象
                	isFirst=true;
                	origin.src=img.src;
  					typeof config.adsLimit=='number'&&config.adsLimit++;
                    cache.onImgLoad(img);

                }else if(pos.x!==origin.pos.x||pos.y!==origin.pos.y||img.clientWidth!=origin.width||img.clientHeight!=origin.height){   //针对图片位置发生变化的情况

            	    origin.pos=pos;
            	    origin.width=img.clientWidth;
            	    origin.height=img.clientHeight;
					_.locate();

                }


			},

		   //鼠标移动到图片的时候发送展现记录
		   recordShow: function(flag){

		       var _=this,data=_.data,img=_.img
				   ,ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash
				   ,iu=encodeURIComponent(encodeURIComponent(img.src)),focus=ev.$(_.tabs,null,'focus')[0];
				var adsId="",adsType="",index=0,mx=''
				,time=new Date().getTime();

				if(focus){
					if(focus.lastChild.className=="ad"){
						var app=data.badsSpot[0];
						adsId=app.adsId;
						adsType=app.adsType;
						//增加第三方广告展现统计
						app.adViewMonitorUrl&&ev.importFile('js',app.adViewMonitorUrl+'?time='+time);

					}else if(focus.lastChild.className=="shop"){
						index=_.getSelectedIndex("shop");
						adsId=data.adsSpot[index].adsId;
						adsType=data.adsSpot[index].adsType;
						mx=data.adsSpot[index].metrix;
					}
				}
				ul+="?pd="+pd+"&mx="+mx+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
				ev.importFile('js',ul);

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
                    var cn=tar.className,index=_.getSelectedIndex(cn);
                    if(cn=="shop"){

					   ad=data.adsSpot[index].adsId;
					   at=data.adsSpot[index].adsType;
					   mx=data.adsSpot[index].metrix;
					   tty=0;
					}else if(cn=="weibo"){
					   ift=2;
					   mx=data.weiboSpot[index].metrix||'';
					}else if(cn=="wiki"){
					   ift=4;
					   mx=data.wikiSpot[index].metrix||'';
					}else if(cn=="weather"){
					   ift=7;
					}else if(cn=="news"){
					   ift=5;
					}else if(cn=="ad"){
					   ad=data.badsSpot[0].adsId;
					   at=data.badsSpot[0].adsType;
					   tty=0;
					}else{
						return;
					}
					var time=new Date().getTime();
					ul+="?iu="+iu+"&mx="+mx+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&at="+at+"&tty="+tty+"&ift="+ift+"&time="+time;
					ev.importFile('js',ul);
			}

		};


		/*****************************
		*InstreetAd static method
		*****************************/
		InstreetAd.createTab =function(type,text,flag){
			var tab=document.createElement("li");
			tab.className="clearfix tab";
			tab.className+=flag?" "+flag:"";
			tab.innerHTML="<a class='"+type+"' href='javascript:;' target='_self'><span></span><em>"+text+"</em></a>";
			return tab;
		};

		InstreetAd.chooseItem =function(sel,nth){
			if(sel.className.match(" focus")){
				return;
			}
			var selector=sel.parentNode,container=selector.previousSibling,fi=ev.$(container,null,'focus')[0],
				fs=ev.$(selector,null,'focus')[0],next=container.children[nth];

			fi.className=fi.className.replace(" focus","");
			fs.className=fs.className.replace(" focus","");
			next.className+=" focus";
			sel.className+=" focus";
		};
		InstreetAd.reLocate =function(){                   //重新定位广告

           var adsArray=cache.adsArray;

           for(i in adsArray){

              var adObj=adsArray[i];
              adObj.locate&&adObj.locate();

		    }
		};
		// InstreetAd.autoShow=function(ad){
		// 	if(config.footAuto&&isFirst){
		// 		ad.showApp();
		// 		ad.recordShow(9);
		// 	}
		// 	isFirst=false;
		// };


    	/****************************************
        *页面加载时向服务器返回符合要求的图片信息
        ****************************************/
        InstreetAd.recordImage=function(img){
	       var iu=encodeURIComponent(encodeURIComponent(img.src)),
		       pd=config.widgetSid,
			   pu=encodeURIComponent(encodeURIComponent(window.location.href)),
			   t=encodeURIComponent(encodeURIComponent(document.title)),
			   ul=config.ourl,
			   index=img.insId;
			var time=new Date().getTime();
			  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&index="+index+"&time="+time;
			  ev.importFile('js',ul);

	    };

		/*******************************
		*InstreetAd Apps generator
		*******************************/
		InstreetAd.modules={


			adApp  :function(obj){
				if(!config.showFootAd||obj.data.badsSpot.length==0)
					return;
				var tab,cont,data,app,redUrl,w=config.width;
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
				if(!config.showAd||obj.data.adsSpot.length==0)
					return;

				var tab,cont,str,data,app,redUrl,imgUrl,title,price,focus,
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
					focus=i==0?" focus":"";
					app=data.adsSpot[i];
					obj.createSpot(app,i);        //创建spot
					redUrl=config.redurl+"?tty=0&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
					title=app.adsTitle;
					price=app.adsDiscount||app.adsPrice;
					imgUrl=app.adsPicUrl.replace("160x160",config.width+"x"+config.width);
					str+='<a target="_blank" class="pro-box'+focus+'" href="'+redUrl+'"><img src="'+imgUrl+'"/><span class="pro-info"><span class="pro-name">'+title+'</span><span class="pro-tobuy"><em>进入商店</em></span><span class="pro-price">¥'+price+'</span></span></a>';
					if(len>1)selectStr+='<a href="javascript:;" target="_self" class="select-item'+focus+'"></a>';
				}
	 			str+='</div>'+selectStr+'</div></div>';
				cont.innerHTML=str;
				return {tab:tab,cont:cont};
			},
			weiboApp:function(obj){
				if(!config.showWeibo||obj.data.weiboSpot.length==0)
					return;
				var tab,cont,data,app,title,redUrl,article,avatar,str="",focus="",
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
				str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>相关微博</h3><div class="main-cont">';
				str+='<div class="in-slider-container">';
				for(var i=0,len=data.weiboSpot.length;i<len;i++){
					focus=i==0?" focus":"";
					app=data.weiboSpot[i];
					obj.createSpot(app,i);        //创建spot
					avatar=app.avatar;
					icon=app.icon;
					title=app.title;
					article=app.latestStatus;
					redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&rurl="+encodeURIComponent(encodeURIComponent(app.userUrl));
					str+='<div class="weibo-item'+focus+'"><div class="left"><a href="'+redUrl+'" target="_blank" title="'+title+'"><img src="'+avatar+'"/></a></div><div class="right"><h3><a href="'+redUrl+'" target="_blank">'+title+'</a></h3><p><em class="arrow-one"></em><em class="arrow-two"></em>'+article+'</p><div class="icon-section"><a href="'+redUrl+'" target="_blank"><img src="'+icon+'"/></a></div></div></div>';
					if(len>1)selectStr+='<a href="javascript:;" target="_self" class="select-item'+focus+'"></a>';
				}
	 			str+='</div>'+selectStr+'</div></div>';
				cont.innerHTML=str;
				return {tab:tab,cont:cont};

			},
			wikiApp:function(obj){
				if(!config.showWiki||obj.data.wikiSpot.length==0)
					return;
				var tab,cont,data,app,title,redUrl,article,avatar,str="",focus="",
					selectStr='<div class="in-wiki-selector">';;
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
					focus=i==0?" focus":"";
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
			newsApp:function(obj){
				if(!config.showNews)
					return;
				var tab,cont,data=obj.data,w=config.width,h=config.height,
				    newsUrl=prefix+"news?size="+w+"&pd="+data.widgetSid+"&muh="+data.imageUrlHash;

				if(obj.isFirstApp){
					tab=InstreetAd.createTab('news','新闻','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('news','新闻');
				}

   			   	var cont=document.createElement("li");
		   	    cont.className="news";
		        str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>热点新闻</h3><div class="main-cont">';
			    str+='<iframe name="weather_inc" src="'+newsUrl+'" width="'+w+'" height="'+h+'" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
			    str+='</div>';
		   	    cont.innerHTML=str;

				return {tab:tab,cont:cont};
			},
			weatherApp:function(obj){
				if(!config.showWeather)
					return;
				var tab,cont,
					w=config.width,
					weatherUrl="http://www.thinkpage.cn/weather/weather.aspx?uid=&cid=101010100&l=zh-CHS&p=TWC&a=1&u=C&s=1&m=0&x=1&d=3&fc=&bgc=&bc=&ti=1&in=1&li=2&ct=iframe";
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('weather','天气','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('weather','天气');
				}
   			   	var cont=document.createElement("li");
		   	    cont.className="weather";
		        str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>天气预报</h3><div class="main-cont">';
			    str+='<iframe name="weather_inc" src="'+weatherUrl+'" width="'+w+'" height="110" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="true" ></iframe>';
			    str+='</div>';
		   	    cont.innerHTML=str;
				return {tab:tab,cont:cont};
			},
			shareApp:function(obj){
				if(!config.showShareButton)
					return;
				var tab,cont;
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('share','分享','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('share','分享');
				}
				var cont=document.createElement("li");
		   	    cont.className="share";
		   	    str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" target="_self" class="in-close">×</a>图片分享</h3><div class="main-cont">';
				str+='<div class="in-share-icons"><a title="新浪微博" class="sina-ico" href="javascript:;" target="_self"></a><a title="腾讯微博" class="tx-ico" href="javascript:;" target="_self"></a><a title="QQ空间" class="qzone-ico" href="javascript:;" target="_self"></a><a title="人人网" class="renren-ico" href="javascript:;" target="_self"></a><a title="搜狐微博" class="sohu-ico" href="javascript:;" target="_self"></a><a title="网易微博" class="wangyi-ico" href="javascript:;" target="_self"></a><a title="豆瓣" class="douban-ico" href="javascript:;" target="_self"></a><a title="开心网" class="kaixin-ico" href="javascript:;" target="_self"></a>';
				str+='</div></div>';
				cont.innerHTML=str;
				return {tab:tab,cont:cont};
			}

		};


		// 用于window onload时对图片重新过滤
		var refilter = function(count){
			count=count||0;
			var images = document.getElementsByTagName('img');
			for(var i=0,len=images.length;i<len;i++){
				var img=images[i];
				if(img.insDataLoading==true||img.getAttribute('instreet_data_loading')||img.insDataLoaded==true||img.getAttribute('instreet_data_loaded')){
					continue;
				}
				if(typeof img.insId=='undefined'){
					img.insId = imgs.length;
				}
				img.setAttribute('instreet_img_id',img.insId);
				imgs[img.insId]=img;
				cache.onImgLoad(img);
			}
			// 递归执行4次
			if(count<5){
				setTimeout(function(){refilter(++count)},1000);
			}
		};




		/*****************************
		*Mix config
		*****************************/
		var mixConfig=function(c){
		   if(c&&typeof c=="object"){

		     for(var i in c){
			    config[i]=c[i];
			 }

		   }else{
		     return;
		   }
		   config.color = config.color&&config.color.toLowerCase();
		};


		/*************************
		*init function
		*************************/
		function init(){

			 if(typeof instreet_config!="undefined"){		//mix配置信息
				 mixConfig(instreet_config);
			 }
		     instreet.init();
			 cache.initData();
			 ev.bind(window,'load',function(){InstreetAd.reLocate();refilter();});
			 ev.bind(window,'resize',function(){InstreetAd.reLocate();});
			 //定时检测图片是否变化
             TimerTick(cache.adsArray);

		};


		/******************************
		*dom ready then init ad plugin
		*******************************/
		DomReady(function(){
        	//插件初始化
        	init();
    	});

})(window);