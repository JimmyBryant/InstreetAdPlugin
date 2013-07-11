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

	extend({

		constructor:InstreetAd,

		isFirstApp:true,

		init    :function(){
			var _this=this;
			_this.createApps();
			_this.locate();
			_this.bindEvents();
		},

		createApps :function(){
			var _this=this;
			//创建广告容器
			var adWrapper=document.createElement("div"),
			tabWrapper=document.createElement("ul"),
			contentWrapper=document.createElement("ul");
			//根据Position添加不同的class
			if(config.position=="0"){
				adWrapper.className="in-ad-wrapper in-position-right";
			}else if(config.position=="1"){
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
			// 对中国网的特殊处理
			if(config.widgetSid=='2thwQrIEQvQz9mNHUQvr0c'){
				appQuery[0]="shopApp";
				appQuery[1]="adApp";
			}
			for(var i=0,len=appQuery.length;i<len;i++){
				var app=appQuery[i];
				if(typeof InstreetAd.apps[app]=='function'){
					var res=InstreetAd.apps[app](_this);
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
			_this.container.appendChild(adWrapper);
			_this.adWrapper=adWrapper;
			_this.tabs=tabWrapper;
			_this.contents=contentWrapper;

		},
		createSpot :function(app,index){
			var oWidth=app.width,
				metrix=app.metrix,
			    spot=document.createElement("a"),
			    spotContainer=spotBox;
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
			var _this=this,img=_this.img,pos=ev.getXY(img)
			,w=img.offsetWidth
			,left=(pos.x+w)+"px"
			,right=(Math.max(document.body.clientWidth,document.documentElement.clientWidth)-pos.x)+'px'
			,top=pos.y+"px",spotsArray=_this.spotsArray;

			var	slideLeft=_this.isSlideLeft();

			var dis=ev.isVisible(img)&&img.clientWidth>=config.imiw&&img.clientHeight>=config.imih?"block":"none";
			function setFloat(direction){
					if(isIE){
						_this.tabs.style.styleFloat=direction;
						_this.contents.style.styleFloat=direction;
					}else{
						_this.tabs.style.cssFloat=direction;
						_this.contents.style.cssFloat=direction;
					}
			}
			if(config.position=="0"){            //图片右侧
				if(slideLeft){
					setFloat("right");
					_this.contents.className="in-contents-wrapper in-contents-slideleft";
					_this.adWrapper.style.left="auto";
					_this.adWrapper.style.right=(Math.max(document.body.clientWidth,document.documentElement.clientWidth)-pos.x-w-26)+"px";
				}else{
					setFloat("left");
					_this.contents.className="in-contents-wrapper";
					_this.adWrapper.style.right="auto";
					_this.adWrapper.style.left=left;
				}
			}else if(config.position==1){		//图片左侧

				if(slideLeft){
					setFloat("right");
					_this.contents.className="in-contents-wrapper";
					_this.adWrapper.style.right=right;
					_this.adWrapper.style.left="auto";

				}else{
					setFloat("left");
					_this.contents.className="in-contents-wrapper in-contents-slideright";
					_this.adWrapper.style.left=(pos.x-26)+"px";
					_this.adWrapper.style.right="auto";

				}

		    }

			_this.adWrapper.style.top=top;
			_this.adWrapper.style.display=dis;
			// _this.adWrapper.style.cssText="left:"+left+";top:"+top+";display:"+dis;
			// 判断是否自动展现广告
			if(dis=='block'&&config.footAuto&&_this.isFirst!==false){

				_this.isFirst=false;
				_this.showApp();
				_this.recordShow(9);

			}

           if(spotsArray.length>0){              //如果存在spot，同时也对其重定位

				var oWidth=spotsArray[0].imgWidth,
					zoomNum=img.width/oWidth,
					r=15;

				for(var j=spotsArray.length;j--;){
					var  spot=spotsArray[j],
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
			var _this=this,
				list=_this.tabs.children,
				contents=_this.contents.children,
				tab=null,
				content=null,
				sel=null;

			//bind img event
			_this.bindImgEvents(_this.img);
			// _this.findCover();
			_this.tabs.onmouseover=function(){
				clearTimeout(_this.timerId);
			};
			_this.tabs.onmouseout=function(){
				_this.timerId=setTimeout(function(){_this.closeApp();},config.timer);
			};
		   _this.contents.onmouseover=function(){
				clearTimeout(_this.timerId);
			};
			_this.contents.onmouseout=function(){
				_this.timerId=setTimeout(function(){_this.closeApp();},config.timer);
			};
			_this.contents.onclick=function(e){
				var event=ev.getEvent(e),tar=ev.getTarget(event);
				if(tar.className=='in-close'){
					_this.closeApp();
					//防止广告在图片上不能关闭
					if(config.position=="0"&&_this.isLeft||config.position==1&&!_this.isLeft){
						_this.notopen=true;
					}
				}else if(tar.parentNode.className=="in-share-icons"){
					_this.shareImg(tar);
				}
				ev.stopPropagation(event);
			};
			// click shop slider item
			var shopSelector=ev.$(_this.contents,null,'in-shop-selector')[0];
			shopSelector&&each(shopSelector.children,function(index){
				var item=this;
				item.onclick=function(){
					InstreetAd.chooseItem(this,index);
				};
			});
			// click weibo slider item
			var weiboSelector=ev.$(_this.contents,null,'in-weibo-selector')[0];
			weiboSelector&&each(weiboSelector.children,function(index){
				var item=this;
				item.onclick=function(){
					InstreetAd.chooseItem(this,index);
				};
			});

			// click wiki slider item
			var wikiSelector=ev.$(_this.contents,null,'in-wiki-selector')[0];
			wikiSelector&&each(wikiSelector.children,function(index){
				var item=this;
				item.onclick=function(){
					InstreetAd.chooseItem(this,index);
				};
			});
			var tab_mouseover=function(){
				if(this.className.match(" focus")){
					return;
				}
				var type=this.lastChild.className;
				_this.showApp(this);
				if(type=="ad"||type=="shop"){
					_this.recordShow(9);
				}
			},
			content_mouseover=function(e){
				var event=ev.getEvent(e),tar=ev.getRelatedTarget(event);
				show(this);
				if(!this.contains(tar)){
					_this.recordWatch(this);
				}
			};
			for(var i=0,len=list.length;i<len;i++){

				tab=list[i];
				content=contents[i];
				//tab mouseover
				tab.onmouseover=tab_mouseover;
				//tab mouseout
				// tab.onmouseout=function(){


				// };
				//content mouseover
				content.onmouseover=content_mouseover;
				//content mouseout
				// content.onmouseout=function(){

				// };

			}
			//spots event
			var spot_mouseover=function(){
				clearTimeout(_this.timerId);
				switch(this.className){
					case "instreet-shopSpot":
						var isFocus;
						tab=ev.$(_this.tabs,null,'shop')[0].parentNode;
						sel=ev.$(_this.contents,null,'in-shop-selector')[0].children[this.index];
						if(sel){
						    isFocus=sel.className.match(" focus");
						}
						else{
							isFocus=tab.className.match(" focus");
						}
						sel&&InstreetAd.chooseItem(sel,this.index);
						_this.showApp(tab);
						if(!isFocus){
							_this.recordShow(9); //record adShow times
						}
					break;
					case "instreet-weiboSpot":
						tab=ev.$(_this.tabs,null,'weibo')[0].parentNode;
						sel=ev.$(_this.contents,null,'in-weibo-selector')[0].children[this.index];
						sel&&InstreetAd.chooseItem(sel,this.index);
						_this.showApp(tab);
					break;
					case "instreet-wikiSpot":
						tab=ev.$(_this.tabs,null,'wiki')[0].parentNode;
						sel=ev.$(_this.contents,null,'in-wiki-selector')[0].children[this.index];
						sel&&InstreetAd.chooseItem(sel,this.index);
						_this.showApp(tab);
					break;
				}
			};
			for(var j=0,l=_this.spotsArray.length;j<l;j++){
				var spot=_this.spotsArray[j];
				spot.onmouseover=spot_mouseover;
			}

		},
		bindImgEvents  :function(img){           //为图片绑定事件
			var _=this,left,right,i=0;
			var getGalleryBtn=function(obj){
				var container=document.getElementById(obj.containerId)||document;
				var a=ev.$(container,obj.leftClass)[0],
					b=ev.$(container,obj.rightClass)[0];

				if(!a||!b){
					return;
				}
				if(obj.leftTitle&&obj.leftTitle!=a.title||obj.rightTitle&&obj.rightTitle!=b.title){
					return;
				}
				left=a;right=b;
			};
			for(;i<galleryConfig.length;i++){
				var s=galleryConfig[i];
				if(s.widgetSid==config.widgetSid){
					getGalleryBtn(s);
					continue;
				}
			}
			var over=function(){
				clearTimeout(_.timerId);
				if(_.notopen){
					return;
				}
				if(_.contents.offsetWidth===0){
					_.showApp();
					_.recordShow(10);
				}
			},
			out=function(){
				clearTimeout(_.timerId);
					_.timerId=setTimeout(function(){_.closeApp();},config.timer);
					_.notopen=false;        //image mouseout时记得false该属性
			};
			//img mouseover
			ev.bind(img,'mouseover',over);
			left&&ev.bind(left,'mouseover',over);
			left&&ev.bind(left,'mouseout',out);

			//img mouseout
			ev.bind(img,'mouseout',out);
			right&&ev.bind(right,'mouseover',over);
			right&&ev.bind(right,'mouseout',out);
		},

		hideApps:function(){
			var _this=this,list=_this.tabs.children;
			//寻找focus tab
			for(var j=list.length;j--;){
				if(list[j].className.match("focus")){
					list[j].className=list[j].className.replace(" focus","");
				}
			}
			//如果是IE用display:none来隐藏应用
			if(isIE){
				hide(_this.contents.children);
			}else{   //否则用visible:hidden
				each(_this.contents.children,function(){
					this.style.cssText="display:block;visibility:hidden;height:0;overflow:hidden;";
				});
			}
			if(_this.adWrapper.style.width!="auto"){
				_this.adWrapper.style.width="auto";
			}
		},
		closeApp:function(){
			this.hideApps();
			this.contents.style.width=0;
		},
		showApp: function(tab){
			var _this=this,list=_this.tabs.children,type,app,width;
			if(list.length===0){
				return;
			}
			if(!tab){
				tab=list[0];
			}
			type=tab.lastChild.className;
			_this.hideApps();
			if(_this.adWrapper.style.width=="auto"){
				_this.adWrapper.style.width=(config.width+42)+'px';
			}
			tab.className+=" focus";
			//如果是IE用display:block来显示应用
			if(isIE){
				show(ev.$(_this.contents,'li',type));
			}
			else{   //否则用visibility:visible
			   each(ev.$(_this.contents,'li',type),function(){
					this.style.cssText="display:block;visibility:visible;height:auto;";
			   });
			}
			width=(config.width+16)+"px";
			if(css.get(_this.contents,'width')===0){
				animate(_this.contents,{width:width},200,'linear');
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
			var _this=this,picUrl=encodeURIComponent(_this.img.src),
				shareTo=icon.className.replace("-ico",""),
				widgetSid=_this.data.widgetSid,
				time=new Date().getTime(),
				title=encodeURIComponent(document.title),
				url=encodeURIComponent(location.href);
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
			if(config.position=="0"){
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

			var _this=this,
				img=_this.img,
				origin=_this.originInfo,
				ad=_this.adWrapper,
				pos=ev.getXY(img);

			if(img.clientWidth<=0||img.clientHeight<=0){ //针对中新网bbs页面
				var images=document.images;
				for(var i=images.length;i--;){
					if(images[i].src==img.src&&images[i].clientWidth>=config.imiw&&images[i].clientHeight>=config.imih){
						if(img.insId==images[i].getAttribute('instreet_img_id')){
							images[i].insId=img.insId;
							_this.img=images[i];
							origin.pos=pos;       //修改原来的pos值
							_this.bindImgEvents(_this.img);
							_this.locate();
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
				_this.locate();

			}


		}
	},InstreetAd.prototype);


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

       for(var i in adsArray){

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
