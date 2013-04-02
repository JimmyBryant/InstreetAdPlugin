/*************************************
*
* 尚街广告插件 instreet.ifeng.js v0.1.1
*    
* add 可以控制广告显示在图片上或者图片外
*	  @outPosition 0 自动 1图片上 2图片外		
*
*************************************/
(function(window,undefined){
        
		if (typeof window.InstreetWidget!="undefined"||window.InstreetWidget != null){
			return null;
		} else {

			window.InstreetWidget = {
				version : "@REVISION@",
		        name    : "InstreetWidget"
			}; 

		}

	   var document = window.document,
		   navigator = window.navigator,
		   location = window.location,
		   imgs=[],
		   outFlag,
           readylist=[],
		   leftPad=-331,
		   rightPad=28,
		   isFirst=true,
		   wait=false;

        
		/********************************
		*Config对象
		*********************************/
		var prefix="http://push.instreet.cn/";
		var config = {

						cssurl 	:	"http://static.instreet.cn/widgets/push/css/instreet.ifeng.min.css",
						// cssurl 	:	"css/instreet.ifeng.css",
						redurl	:	prefix+"click.action",
					callbackurl	:	prefix+"push.action",
						murl	:	prefix+"tracker.action",
						iurl    :	prefix+"tracker90.action",
						ourl	:	prefix+"loadImage.action",
						surl    :   prefix+"share/weiboshare",						
						imih	:	290,
						imiw	:	290,
						timer   :   1000
						// ,
					 	// adsLimit :  null,
						// widgetSid:"4z9rxazql3QnEikIZVMWf6",
						// showAd:true,
						// showFootAd:true,
						// showWeibo:true,
						// showWiki:true,
						// showShareButton:true,
						// showWeather:true,
						// showNews:true,
						// showMeiding  :true,
					 	// footAuto:  false,
					    // position: 0       //0为图片右侧 1为图片左侧

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
				   var parent=parentNode||document;
				   if(document.getElementsByClassName) return parent.getElementsByClassName(className);
				   var arr=[];
				   var tag=tagName||'*';
				   tag=tag.toUpperCase();
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
				 var ele;
				 switch(type){
				   case "js": 
				   ele=document.createElement('script');ele.src=name;ele.charset="utf-8";ele.type="text/javascript";
				   break;
				   case "css":
				   ele = document.createElement("link");ele.type = "text/css";ele.rel = "stylesheet";ele.href=name;
				   break;					   
				 }
				 var head=document.getElementsByTagName('head')[0];
				 head.appendChild(ele);
	        }
		};
        
        var $=function(id){return document.getElementById(id);},
            hide=function(elem){elem.style.display="none"},
            show=function(elem){elem.style.display="block"} ;
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
		document.DomReady = function (fn){  
                var isIE = !!window.ActiveXObject;
                if(document.readyState==="complete") {readylist.push(fn);run();return;}				
				if (readylist.push(fn) > 1) return; 	
				if (document.addEventListener)  			
				return document.addEventListener('DOMContentLoaded', run, false);   

				if (isIE) {   
                     doScrollCheck();
			    }  
						  

		}; 
			
        /*********************************
        *cache对象，加载广告数据
        **********************************/
		var cache={
			avaImages  :[],
			adsArray   :[],
	        initData   :function(){
		   	   var images=document.getElementsByTagName('img');
			   for(var i=0,len=images.length;i<len;i++){
			   	  var img=images[i];
			   	  imgs[i]=img;
			   	  img.insId=i;img.setAttribute("instreet_img_id",i);
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
			   	 if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih){
			   	 	  InstreetAd.recordImage(clientImg);	
				   	  if(typeof config.adsLimit=="number"&&config.adsLimit<=0){	
				   	  	return;
				   	  }	
					   		   
					   cache.createJsonp(clientImg);
					   config.adsLimit&&config.adsLimit--;
				   	  
			   	  }
			   }
			},
			createJsonp  :function(img){
			   var width=300,height=250;
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp&w="+width+"&h="+height;
			   ev.importFile('js',url);
			}
		
		};

        window['insjsonp']=function(data){

			    if(data){
				  var index=data.index,img=imgs[index];
				  img.setAttribute('instreet_data_ready',true);
				  instreet.reLocateAd();        //重新定位已经显示的广告
				  var ad=new InstreetAd(data);
				  cache.adsArray[index]=ad;
				  instreet.autoShow(ad);
				}
				
		};
		
		
        /*****************************
        *instreet对象
        *****************************/
		
		var instreet={
		    container   :   null,
			spotBox     :   null,
		    init        :  function(data){

			   var cssUrl=config.cssurl;
			   //var cssUrl="css/instreet.ifeng.css";
			   ev.importFile('css',cssUrl);
		       instreet.createContainer();
			   this.bindBodyEvent();

			},
			createContainer: function(){						//创建广告容器
		       var container=document.createElement('div'),           
			       spotBox=document.createElement('div');
			   container.id="INSTREET_CONTAINER";
			   spotBox.id="INSTREET_SPOTBOX";
			   instreet.container=container;
			   instreet.spotBox=spotBox;
			   container.appendChild(spotBox);
			   document.body.insertBefore(container,document.body.firstChild);				
			},
			bindBodyEvent  :function(){                      //创建事件委托
			
			    var eventDelegate=function(eve){
			      var event=ev.getEvent(eve),
					  tar=ev.getTarget(event),
					  type=event.type;
                  switch(type){
				    
					case "mouseover":
					/*
					if(tar.tagName=='A'&&tar.className=='instreet_other_close'){
					   var parent=tar.parentNode;
					   if(parent.className==='instreet_other_title'){
					     	parent.id="instreet_other_close";
					   }
					}else
					*/
					//鼠标over到分享按钮
					if(tar.tagName=='A'&&tar.className=='instreet_share_button'){
					    var next,
						    parent;
						   instreet.closeActiveAd();						   

						   parent=tar.parentNode;
						   next=tar.nextSibling;
						   hide(tar);
						   parent.id="INSTREET_AD_ACTIVE";
						   show(next);
						   next.onmouseover=null;
						   next.onmouseout=null;
						   next.onmouseover=function(){
						   	  clearTimeout(outFlag);
						      parent.id="INSTREET_AD_ACTIVE";
                              show(this);
							  hide(tar);
						  };
						  next.onmouseout=function(){
                              parent.id='';
							  hide(this);
							  show(tar);

						  };
					}
					
					break;
					/*
					case "mouseout":
					if(tar.tagName=='A'&&tar.className=='instreet_other_close'){              
					   var parent=tar.parentNode;if(parent.className==='instreet_other_title'){
					     parent.id="";
					   }
					}
					break;
					*/
					//关闭按钮点击事件
					case "click":
					if(tar.tagName=='A'&&tar.className=='instreet_other_close'){
					     var parent=tar.parentNode;if(parent.className==='instreet_other_title'){
						     var adbox=parent.parentNode;
							 hide(adbox);
							 adbox.parentNode.id='';
						  wait=true;
					   }
					}
					//分享按钮点击事件
					else if(tar.className=='instreet_sina'||tar.className=='instreet_renren'||tar.className=='instreet_tx'){
					   var other=tar.parentNode.parentNode.parentNode;
					   var index=other.getAttribute('instreet_img_id');
					   var picUrl=imgs[index].src,shareTo=tar.className.replace("instreet_",""),widgetSid=cache.adsArray[index].dataPackage.widgetSid;
					   var recordUrl=config.surl+"?content=''&imgUrl="+encodeURIComponent(picUrl)+"&widgetSid="+widgetSid+"&pageUrl="+encodeURIComponent(location.href)+"&shareTo="+shareTo;
					   ev.importFile('js',recordUrl);
					   switch(tar.className){
						    case "instreet_sina": 
							window.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(document.URL)+'&pic='+encodeURIComponent(picUrl),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500");
	                        break;
	                        case "instreet_renren":
							window.open('http://share.renren.com/share/buttonshare.do?link='+encodeURIComponent(document.URL),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=570, height=326");
							break;
	                        case "instreet_tx"   :
							window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+encodeURI(document.title+'\n\n')+'&url='+encodeURI(document.URL)+'&pic='+encodeURIComponent(picUrl),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500");
							break;						
					    }
					}
					break;
				  
				  }
				  
			   };

			   ev.bind(instreet.container,'mouseover',eventDelegate);
			  // ev.bind(document.body,'mouseout',eventDelegate);
			   ev.bind(instreet.container,'click',eventDelegate);
			
			},


			closeActiveAd :	function (){	             //关闭当前显示的广告		

				 var active_box=$('INSTREET_AD_ACTIVE');
				 if(active_box){
					 active_box.id="";					 
					 active_box.firstChild.className=='instreet_share_button'&&show(active_box.firstChild);						 
					 active_box.children.length>1&& hide(active_box.lastChild);					    					 
				 }
			},
			reLocateAd  :function(){                   //重新定位广告

               var adsArray=cache.adsArray;
               
               for(i in adsArray){

                  var adObj=adsArray[i];
                  adObj.locateAd&&adObj.locateAd();
			 
			    }
			},
			autoShow  :function(ad){                  //自动展示第一个加载成功的广告

				if(config.footAuto&&isFirst){

					var side=ad.sideWrapper,li=side.firstChild;
					if(li&&li.children.length>1){
						if(!$("INSTREET_AD_ACTIVE")){          //判断是否已经有广告被显示
							li.id="INSTREET_AD_ACTIVE";
							show(li.lastChild);
							if(li.className=="instreet_aditem"){
								ad.recordShow(9);
							}
						}
					}

				}
				isFirst=false;

			}
			/*
			,
			search   :function(){                     //搜索未被发现的图片

				var images=document.getElementsByTagName("img");
				
				for(var i=0;i<images.length;i++){
					var img=images[i],len=imgs.length;
					if(img.insId==undefined){
						imgs[len]=img;
						img.insId=len;
						img.setAttribute("instreet_img_id",len);
						cache.onImgLoad(img);
					}
				}

			}
			*/

		};
        
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
	             },1000);
	    	};
	    })();


        /********************************
        *InstreetAd 类
        ********************************/
        var InstreetAd=function(data){

             var img=imgs[data.index];
             this.dataPackage=data;           
             this.img=img;
             this.originInfo={width:img.clientWidth,height:img.clientHeight,src:img.src};
             this.spotsArray=[];
             this.init();
        };

        InstreetAd.prototype={

        	constructor:InstreetAd,
            init  :function(){

		   	   var _this=this,
		   	   	   data=_this.dataPackage,
		   	   	   index=data.index,
		   	   	   img=_this.img,
			       pos=ev.getXY(img),
				   str='';
			   var side=document.createElement('ul');
			   if(config.position==1){
			   	side.className="instreet_other in_position_left";
			   }else{
			   	side.className="instreet_other in_position_right";
			   }
			   side.setAttribute("instreet_img_id",index);
			   this.sideWrapper=side;
			   this.chooseLeft();                           //判断广告放置在图片左侧或者右侧
			  
			   for(i in InstreetAd.modual){

			     var lis=InstreetAd.modual[i](data,_this);
			     
			     for(var len=lis.length,i=0;i<len;i++){
			     	side.appendChild(lis[i]);
			     }
			    			     	
			   }

			   this.addTipEvent();
			   this.addImgEvent();
			   this.locateAd();
			   instreet.container.appendChild(side);

			},
			chooseLeft    :function(){						//判断广告放置在图片左侧还是右侧
				var img=this.img,pos=ev.getXY(img);
				//判断内容在左侧或者右侧显示
				if(config.position==0){
					// 判断广告显示在图片上或者图片外
					if(config.outPosition==1){
						this.isLeft=true;
					}else if(config.outPosition==2){
						this.isLeft=false;
					}else{
						this.isLeft=pos.x+img.offsetWidth+360>(Math.max(document.body.clientWidth,document.documentElement.clientWidth))?true:false;
					}
				}else if(config.position==1){
					// 判断广告显示在图片上或者图片外
					if(config.outPosition==1){
						this.isLeft=true;
					}else if(config.outPosition==2){
						this.isLeft=false;
					}else{
						this.isLeft=360<=pos.x?false:true;
					}
				}
				return this.isLeft;    
			},
			createSpot:function(spotData){
			   var _this=this, 
			       img=_this.img,
			       w=spotData.width,
			       metrix=spotData.metrix;

			   var spot=document.createElement('a');
			   if(spotData.adsType)
			      spot.className="instreet_ad_spot";
			   else if(spotData.type.toString()=="1"||spotData.type.toString()=="2")  
			      spot.className="instreet_weibo_spot";
			   else if(spotData.type.toString()=="4")
  			      spot.className="instreet_wiki_spot";
			   spot.href="javascript:;";
			   spot.metrix=metrix;
			   spot.imgWidth=w;
			   instreet.spotBox.appendChild(spot);
			   this.addSpotEvent(spot);
			   this.spotsArray.push(spot);
			},
			addSpotEvent  :function(spot){
				var _this=this,
					insId=_this.dataPackage.index,
					side=_this.sideWrapper;		   				
				spot.onmouseover=function(){
											    
						var boxes,box,
							metrix=this.metrix,
						    items;
						   
                        if(spot.className=='instreet_ad_spot'){ 
							boxes=ev.$(side,null,'instreet_aditem');
						   for(var i=0,len=boxes.length;i<len;i++){

						      if(boxes[i].getAttribute('metrix')==metrix){
							    clearTimeout(outFlag);		
							    if(!boxes[i].id){	
							    	instreet.closeActiveAd();				    
								    boxes[i].id="INSTREET_AD_ACTIVE";
									show(boxes[i].lastChild);
									_this.recordShow(9);
								}
							  }
						   }

						 }
						 else{
							instreet.closeActiveAd();
							if(spot.className=='instreet_weibo_spot'){
								box=ev.$(side,null,'instreet_weibo')[0];
								items=ev.$(box,null,'other_weibo_box');
							}									
							else if(spot.className=='instreet_wiki_spot'){	
								box=ev.$(side,null,'instreet_wiki')[0];
								items=ev.$(box,null,'other_wiki_box');
							}
								
							for(var i=0,len=items.length;i<len;i++){
							   var item=items[i];
							   if(item.getAttribute('metrix')==metrix){
								 item.id="instreet_box_focus";
							   }else{							     
								 item.id="";
							   }
							}
							clearTimeout(outFlag);	
							box.id="INSTREET_AD_ACTIVE";	
                            show(box.lastChild);							
						 
						 }
					     
				};
				spot.onmouseout=function(){

					var	item=$('instreet_box_focus');
					if(item){
							item.id='';	
					}										
				
				};
										
			},
			addTipEvent :function(){	                    //为tip绑定鼠标事件
                			
			     var _this=this, 
			     	lis=_this.sideWrapper.children;
  
                 for(var i=lis.length;i--;){

                    var tip=lis[i].firstChild,
                    	adItem=lis[i].lastChild;
                    tip.onmouseover=function(e){
                       var parent=this.parentNode,adItem=this.nextSibling;
					   clearTimeout(outFlag);
					   if(parent.id!="INSTREET_AD_ACTIVE"){
						   instreet.closeActiveAd();
						   parent.id='INSTREET_AD_ACTIVE';
						   show(adItem);
						   if(parent.className=='instreet_aditem'){
						   	 _this.recordShow(9); 
						   }
						}                 
					};
					
					tip.onmouseout=function(){
					  outFlag=setTimeout(instreet.closeActiveAd,config.timer);					   
					};
					
					adItem.onmouseover=function(e){

					   clearTimeout(outFlag);
					   this.parentNode.id="INSTREET_AD_ACTIVE";
					   show(this);

					};	
					
					adItem.onmouseout=function(){
					   outFlag=setTimeout(instreet.closeActiveAd,config.timer);	
					};

					var children=adItem.children;
					for(var j=1,len=children.length;j<len;j++){     //记录鼠标mouseover到广告和app上的行为   
						children[j].onmouseover=function(e){
					      var event=ev.getEvent(e),
					  		 rela=ev.getRelatedTarget(event);
	                       if(!this.contains(rela)){
	                       	 _this.recordWatch(this);	
	                       }
						}
					 }								 		 

		  		}
		  },
		  addImgEvent  :function(){
		  	   var _this=this,img=this.img,side=_this.sideWrapper;
		  	   ev.bind(img,'mouseover',function(){
		  	   	    clearTimeout(outFlag);
		  	   	    var active=$("INSTREET_AD_ACTIVE");
		  	   	    if(side.contains(active)&&active.className!="instreet_imeiding"){
		  	   	    	return;
		  	   	    }else{
		  	   	    	var li=side.firstChild,children=li.children;
		  	   	    	if(_this.isLeft&&wait){		  	   	    		
		  	   	    		return;
		  	   	    	}
		  	   	    	else if(children&&children.length>1){
		  	   			   instreet.closeActiveAd();
		  	   			   li.id="INSTREET_AD_ACTIVE";
		  	   			   show(li.lastChild);
		  	   			   _this.recordShow(10);
		  	   			}
		  	   		}

               });
   		  	   ev.bind(img,'mouseout',function(){
					outFlag=setTimeout(instreet.closeActiveAd,config.timer);
					wait=false;
               });

		  },
		  //鼠标移动到图片的时候发送展现记录
		  recordShow: function(flag){  

		       var _this=this,data=_this.dataPackage,img=_this.img,
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src)),
				   li=$('INSTREET_AD_ACTIVE');
				var adsId="",adsType="",mx="";

				if(li.className=="instreet_aditem"){ 
				   var children=li.lastChild.children,
				    	idArr=[],typeArr=[]; 
					for(var i=1,len=children.length;i<len;i++){
						var child=children[i];
						var id=child.getAttribute("adsid"),type="";

						if(id){                      //存在id则是匹配广告，否则是底部广告						
							for(var j=0,length=data.adsSpot.length;j<length;j++){
								if(id==data.adsSpot[j].adsId){
									type=data.adsSpot[j].adsType;
									mx=data.adsSpot[j].metrix;
									break;
								}
							}

						}else{
							var app=data.badsSpot[0];
							id=app.adsId;
							type=app.adsType;
						}
						idArr.push(id);
						typeArr.push(type);
					}
					adsId=idArr.join(",");adsType=typeArr.join(",");
				}
				var time=new Date().getTime();  
				ul+="?pd="+pd+"&mx="+mx+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
				ev.importFile('js',ul);
				//增加第三方广告展现统计
				data.badsSpot[0]&&data.badsSpot[0].adViewMonitorUrl&&ev.importFile('js',data.badsSpot[0].adViewMonitorUrl+"?time="+time);		   
		  },
	       //鼠标移动到广告或者微博、百科上发送行为记录
 	      recordWatch:function(tar){   		       

			      var  _this=this,data=_this.dataPackage,
			      	   img=_this.img,
					   iu=encodeURIComponent(encodeURIComponent(img.src)),
					   pd=data.widgetSid,
					   ul=config.murl,
					   mid=data.imageNumId||'',
					   mx='',
					   muh=data.imageUrlHash,
					   adData,
					   ad='',
					   at='',
					   tg='',
					   ift=0,
					   tty=1,adReg=/other_ad_box/,weiboReg=/other_weibo_box/,wikiReg=/other_wiki_box/,footReg=/other_foot_ad/,
					   weatherReg=/other_weather_box/,newsReg=/other_news_box/;
                    var className=tar.className;
                    if(adReg.test(className)){
					   ad=tar.getAttribute('adsid');
						for(var j=0,length=data.adsSpot.length;j<length;j++){
							if(ad==data.adsSpot[j].adsId){
								at=data.adsSpot[j].adsType;
								mx=data.adsSpot[j].metrix;
								break;
							}
						}
					   tty=0;
					}else if(weiboReg.test(className)){
					   ift=2;
					   mx=tar.getAttribute("metrix");
					  
					}else if(wikiReg.test(className)){
					   ift=4;
					   mx=tar.getAttribute("metrix");
					}else if(weatherReg.test(className)){
					   ift=7;
					}else if(newsReg.test(className)){
					   ift=5;
					}else if(footReg.test(className)){
					   ad=data.badsSpot[0].adsId;
					   at=data.badsSpot[0].adsType;
					   tty=0;
					}else{
						return;
					}
													
					var time=new Date().getTime();  								
					ul+="?iu="+iu+"&mx="+mx+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&at="+at+"&tty="+tty+"&ift="+ift+"&time="+time;				
					ev.importFile('js',ul);				
			},
			locateAd :function(){                    //定位广告

                  var _this=this,
                      side=_this.sideWrapper,
                      spotsArray=_this.spotsArray,
                      img=_this.img,
                      dis=img.clientWidth>=config.imiw&&img.clientHeight>=config.imih?"block":"none",
                      pos=ev.getXY(img);
                   //根据position进行定位   
                   if(config.position==0){
                   	  var left=(pos.x+img.offsetWidth);
                   	  side.style.cssText="top:"+pos.y+"px;left:"+left+"px;margin-top:5px;display:"+dis+";";
                   }else if(config.position==1){
					  var right=Math.max(document.body.clientWidth,document.documentElement.clientWidth)-pos.x;
                      side.style.cssText="top:"+pos.y+"px;left:auto;right:"+right+"px;margin-top:5px;display:"+dis+";";
                   }
                   
                   lis=side.children;
                   for(var j=lis.length;j--;){
                   	   if(lis[j].children.length>1){
                   		var box=lis[j].lastChild;
                   		if(box.className!="instreet_share_icons"){
                   		    //根据position对content box定位
                   		    dir=_this.chooseLeft()?leftPad+"px":rightPad+"px";
                   		    if(config.position==0){
                   		    	box.style.left=dir;
                   		    }else if(config.position==1){
                   		    	box.style.right=dir;
                   		    }
	                   		
                   		 }
                   	   } 
                   }

                   if(spotsArray.length>0){              //如果存在spot，同时也对其重定位


                     var w=spotsArray[0].imgWidth,
                     	 zoomNum=img.width/w,
					 	 r=17;
                      
	                  for(var j=spotsArray.length;j--;){
	                  	   var  spot=spotsArray[j];				      
					       metrix=spot.metrix,
						   ox=metrix%3000,
						   oy=Math.round(metrix/3000),					  
						   x=ox*zoomNum,
						   y=oy*zoomNum;
	 					  spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;"

	                   }

                    }  
			},
			detect   :function(){                     //每隔一段时间开始检测图片对象是否change

                var _this=this,img=_this.img,origin=_this.originInfo,
                	side=_this.sideWrapper;

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
                					_this.img=images[i];
                				}
                			}
                		}
                		_this.locateAd();
                }
                

			}
			


        };

        /****************************************
        *页面加载时向服务器返回符合要求的图片信息
        ****************************************/
        InstreetAd.recordImage=function(img){

	       var iu=encodeURIComponent(encodeURIComponent(img.src)),
		       pd=config.widgetSid,
			   t=encodeURIComponent(encodeURIComponent(document.title)),
			   ul=config.ourl;

			var time=new Date().getTime();   
			  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
			  ev.importFile('js',ul);
		   
	    };




		/*****************************
		*插件应用模块
		*****************************/
		InstreetAd.modual={
			createAdBox :function(data,obj){
			   var str='',
				   arr=[],
				   liArray=[],
				   aMetrix=[],
				   img=obj.img,
				   len=data.adsSpot.length,
				   footData=data.badsSpot[0],
				   left=obj.isLeft,id='',dis='',
				   createAd=function(data,metrix){                    //创建metrix值相同的精准匹配广告节点
						var str='',
					        len=data.adsSpot.length,
					        ad,
					        redUrl,
					        adData=null;  
					   
						for(var j=0;j<len;j++){
							if(data.adsSpot[j].metrix===metrix){
							  ad=data.adsSpot[j];
							  redUrl=config.redurl+"?tty=0&muh="+data.imageUrlHash+"&pd="+ad.widgetSid+"&ift=&at="+ad.adsType+"&ad="+ad.adsId+"&mx="+ad.metrix+"&rurl="+encodeURIComponent(encodeURIComponent(ad.adsLinkUrl));
							  var className="other_ad_box no_border";
							  str+="<div adsid='"+ad.adsId+"' class='"+className+"'>";
					          str+="<table><tbody><tr><td class='td1'><a class='imgbox' href='"+redUrl+"'><img src='"+ad.adsPicUrl+"' alt='' /></a></td>";                                							  
							  str+="<td class='td2'><p class='other_ad_title'><a href='"+redUrl+"' title='' target='_blank'>"+ad.adsTitle+"</a></p>";
							  str+="<p class='other_ad_new'><b>宝贝价：<span class='other_ad_price'>"+(ad.adsDiscount||ad.adsPrice)+"</span>元</b></p><p class='other_ad_buy'><a target='_blank' href='"+redUrl+"'></a></p></td></tr></tbody></table></div>";
							  if(!adData){
								adData=ad;
							  }
							
							}
						}
						obj.createSpot(adData);	
						return str;		  
					},
					createFootAd=function(footData){	                 //创建底部广告节点	
					   var 	str='',redUrl='';
					   if(!footData){     
						  return str;
					   }else{
						  str="<div class='other_foot_ad'>";
						  
		  				  //增加第三方点击监控
						  if(footData.adClickMonitorUrl){
							var monitorUrl=footData.adClickMonitorUrl+encodeURIComponent(encodeURIComponent(footData.adsLinkUrl||''));
							redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(footData.adsType||'')+"&ad="+(footData.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(monitorUrl));
						  }else{
							redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(footData.adsType||'')+"&ad="+(footData.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(footData.adsLinkUrl||''));
						  }
						  
						  if(footData.adsType==3){
							 str+="<a href='"+redUrl+"'><img src='"+footData.adsPicUrl+"' alt=''/></a>";
						  }else if(footData.adsType==9){              //flash广告
						  	  str+='<object id="afg-adloader" width="300" height="250"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
							  str+='<param value="always" name="allowScriptAccess"/><param value="'+footData.adsPicUrl+'" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality"><param value="#F1F1F1" name="bgcolor"/>';
							  str+='<embed width="300" height="250" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="footDatalication/x-shockwave-flash" allowscriptaccess="always" wmode="opaque"  bgcolor="#F1F1F1" quality="high" src="'+footData.adsPicUrl+'"></object>';
						  	  str+='<a class="flash-cover" href="'+redUrl+'" target="_blank"></a>';						  
						  }else if(!footData.adsLinkUrl&&footData.description){						  	
							 var fra='<iframe src="'+footData.description+'" scrolling="no" height="'+footData.adsHeight+'" width="'+footData.adsWidth+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
							 str+="<i class='small-info'></i>"+fra;
						  }
						  str+="</div>";
						  return str;
					   }
					   					
					};

                 var footAd=createFootAd(footData);
               			    
			
                if(!config.showAd&&!config.showFootAd){
			      return str;
			    }

                var createLI=function(index){       //创建LI

	   		      	var li=document.createElement("li");
			      	li.setAttribute("instreet_ad_id",index);
			      	li.className="instreet_aditem";
			      	return li;
				};

			   if(len<=0||!config.showAd){                   //只有底部广告
			      if(footData&&config.showFootAd){
	   		      	var li=createLI(0);
			      	var str="<div class='instreet_tip'><span class='tip_top'></span><p>热门信息</p><span class='tip_bottom'></span></div>";
					str+="<div class='instreet_other_box'><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>热门信息</div>";
					li.innerHTML=str+footAd;
					liArray.push(li);
				 }
			   }
			   else if(config.showAd&&len>0){              //存在图片匹配广告
			   
				   while(len--){
					arr.push(data.adsSpot[len].metrix);
				   }
				   aMetrix=ev.aTrim(arr);

			   for(var i=0,len=aMetrix.length;i<len;i++){   
   		   
			      var ad,tipId='';
				  switch (i){
					 case 0:tipId="一";break;
					 case 1:tipId="二";break;
					 case 2:tipId="三";break;
					 case 3:tipId="四";break;
					 case 4:tipId="五";break;
					 case 5:tipId="六";break;
				   }

				  var li=createLI(i);
				  li.setAttribute("metrix",aMetrix[i]);
				  str="<div class='instreet_tip'><span class='tip_top'></span><p>相似商品"+tipId+"</p><span class='tip_bottom'></span></div>";
				  str+="<div class='instreet_other_box' ><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相似商品</div>";
				  str+=createAd(data,aMetrix[i]);	 //广告html	  
				  if(config.showFootAd){
                      str+=footAd;                   //底部广告html                 
				  }
			      li.innerHTML=str+"</div>";    
			      liArray.push(li);      
			   }
			  }
			   return liArray;

			},

			createWeibo: function(data,obj){
			   var str="",
				   left=obj.isLeft,
				   liArray=[],
				   img=obj.img;

			   if(data.weiboSpot.length>0&&config.showWeibo){
			   	   var li=document.createElement("li");
			   	   	li.className="instreet_weibo";   
			   
			       str="<a href='javascript:;' class='instreet_tip instreet_weibo_button'></a><div class='instreet_weibo_box'>";		
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关微博</div>";
				   for(var len=data.weiboSpot.length,i=0;i<len;i++){
				      var weibo=data.weiboSpot[i],
					      nickName=weibo.nickName,
						  icon=weibo.icon,
						  avatar=weibo.avatar,
						  latestStatus=weibo.latestStatus,
						  title=weibo.title,
						  metrix=weibo.metrix,
						  userUrl=config.redurl+"?tty=1&mx="+metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+weibo.type+"&at=&ad=&rurl="+encodeURIComponent(encodeURIComponent(weibo.userUrl)),						  
						  s="";
						if(i==len-1)  
							s="<div class='other_weibo_box no_border' metrix='"+metrix+"'>";
						else
						    s="<div class='other_weibo_box' metrix='"+metrix+"'>";
						s+="<table><tr><td class='td1'><a href='"+userUrl+"' target='_blank'><img src='"+avatar+"'/></a></td><td class='td2'><p><a target='_blank' class='name' href='"+userUrl+"'>"+nickName+"</a></p><p class='cont'>"+latestStatus+"</p><p class='icon'><a href='"+userUrl+"' title='微博'><img src='"+icon+"'/></a></p></td></tr></table></div>";  
				        str+=s;
						obj.createSpot(weibo);
				   }
				   str+="</div>";
				   li.innerHTML=str;
				   liArray.push(li);
			   
			   }
			    return liArray;

			
			},			
			createWiki:function(data,obj){
			   var str="",
			   	   left=obj.isLeft,
			   	   img=obj.img,
			   	   liArray=[];
			   if(data.wikiSpot.length>0&&config.showWiki){

   			   	    var li=document.createElement("li");
			   	   	
			   	   	li.className="instreet_wiki";   

			       str="<a href='javascript:;' class='instreet_tip instreet_wiki_button'></a><div class='instreet_wiki_box'>";
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关互动百科</div>";
				   for(var len=data.wikiSpot.length,i=0;i<len;i++){
				      var wiki=data.wikiSpot[i],
					      title=wiki.title,
						  firstimg=wiki.firstimg,
						  isexist=wiki.isexist,
						  summary=wiki.summary,
						  metrix=wiki.metrix,
						  url=config.redurl+"?tty=1&mx="+metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+wiki.type+"&at=&ad=&rurl="+encodeURIComponent(encodeURIComponent(wiki.url)),						  
						  s="";
						if(i==len-1)   
							s="<div class='other_wiki_box no_border' metrix='"+metrix+"'>";
						else
						    s="<div class='other_wiki_box' metrix='"+metrix+"'>";
						s+="<table><tr><td class='td1'><a href='"+url+"' target='_blank'><img src='"+firstimg+"'/></a></td><td class='td2'><p><a target='_blank' class='name' href='"+url+"'>"+title+"</a></p><p class='cont'>"+summary+"</p><p class='icon'><a href='"+url+"' title='互动百科'><img src='http://static.instreet.cn/widgets/push/images/icon_baike.png'/></a></p></td></tr></table></div>";  
				        str+=s;
						obj.createSpot(wiki);
				    }
				    str+="</div>";	
				    li.innerHTML=str;
				    liArray.push(li);		   
			   }
			   return liArray;
			   			
			},
			createNews  :function(data,obj){		  
			   var str="",
			      newsUrl=prefix+"news?size=300&pd="+data.widgetSid+"&muh="+data.imageUrlHash,
			   	  liArray=[];
			   	  
			   if(config.showNews){

   			   	   var li=document.createElement("li");	   	   	   
			   	   li.className="instreet_news";  
			       str="<a href='javascript:;' class='instreet_tip instreet_news_button'></a><div class='instreet_news_box'>";
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关新闻讯息</div><div class='other_news_box no_border'>";					
				   str+='<iframe frameborder="0" width="300" height="250" marginwidth="0" marginheight="0" src="'+newsUrl+'"></iframe>';
				   str+='</div></div>';			   
			   	   li.innerHTML=str;
				   liArray.push(li);
			   }
			   return liArray;
			},
			createWheather:function(data,obj){
			    
			    var str="",liArray=[],
					left=obj.isLeft,
					url="http://www.instreet.cn/weather?location=&callback=showWeather_"+data.index;
				if(config.showWeather){
		   	      var li=document.createElement("li");
			   	   	   
			   	  li.className="instreet_weather"; 
				  str="<a href='javascript:;' class='instreet_tip instreet_weather_button'></a><div class='instreet_weather_box'>";
				  str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关天气讯息</div>";
				  str+="<div class='other_weather_box no_border'><iframe name='weather_inc' src='http://tianqi.xixik.com/cframe/2' width='290' height='70' frameborder='0' marginwidth='0' marginheight='0' scrolling='no'></iframe></div></div>";
			   	  li.innerHTML=str;
				  liArray.push(li);
				}
				return liArray;
			
			},
			createShare :function(){
			   var str='',liArray=[];
			   if(config.showShareButton){
		   	      var li=document.createElement("li");
			   	  li.className="instreet_share"; 
			   	  str="<a class='instreet_share_button' title='分享图片'></a><div class='instreet_share_icons'><a class='instreet_sina'  title='新浪微博'></a><a class='instreet_renren' title='人人网' ></a><a class='instreet_tx' title='腾讯微博'></a></div>";
  			   	  li.innerHTML=str;
				  liArray.push(li);
			   }
			   
			   return liArray;
			},
			createMD   :function(){
			   var str='',liArray=[];
			   if(config.showMeiding){
			   	  var li=document.createElement("li");
			   	  li.className="instreet_imeiding"; 
				  str="<a class='share_button' href='http://www.imeiding.com?ufrom=ad' target='_blank' title='每叮网'></a>";
			   	  li.innerHTML=str;
				  liArray.push(li);
			   }             
			   return liArray;
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
		
		};
		

		/************************* 
		*init function
		*************************/
		function init(){

			 typeof instreet_config!='undefined'&&mixConfig(instreet_config);                  //组合配置信息
		     instreet.init();
			 cache.initData();
			 ev.bind(window,'load',function(){
			 	instreet.reLocateAd();		 		
			 });	
			 ev.bind(window,'resize',function(){instreet.reLocateAd();}); 
			 //dom ready后搜索是否有新的图片
			 // document.DomReady(function(){
			 // 		instreet.search()
			 // });
			 //定时检测图片是否变化
             TimerTick(cache.adsArray);

		};
		
		
		document.DomReady(function(){
        	//插件初始化
        	init();
    	});

        
    })(window);