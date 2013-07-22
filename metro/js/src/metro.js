
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
		    ev.bind(window,'resize',function(){_.locate();});
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
			// 填充clolorline
			fillLine();
			// 为图片绑定mouseover、mouseout事件
			ev.bind(_.image,'mouseover',overHandler);
			ev.bind(_.image,'mouseout',outHandler);
			// 为plugin-box绑定mouseover、mouseout事件
			ev.bind(_.box,'mouseover',overHandler);
			ev.bind(_.box,'mouseout',outHandler);
			// 统计鼠标mouseover到广告内容的行为
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
			var _=this,li=document.createElement('li');
			li.className=_.nav.children.length?'nav-item':'nav-item first selected';
			li.innerHTML='<div><em class="icon-'+type+'"></em><span>'+text+'</span></div>';
			_.nav.appendChild(li);
			// 为nav-item绑定事件
			var timer=null;
			li.onmouseover=function(){

				if(this.className.indexOf('selected')==-1){
					var li=this;

					timer = setTimeout(function(){

						var nav=ev.$(_.nav,'selected')[0],content=ev.$(_.content,'content-item-selected')[0],
							next=ev.$(_.content,type+'-item')[0],borderbox=_.nav.parentNode,wrapper=borderbox.parentNode;
						nav.className=nav.className.replace(" selected","");
						li.className+=" selected";
						Animate(content).stop(true).animate({'opacity':0},200,function(){
							this.className=this.className.replace(" content-item-selected","");
							next.className+=" content-item-selected";
							css(next).set({'opacity':1});
							css(wrapper).set('height',css(borderbox).get('height'));
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
						r=12.5,
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
		bindEvent:function(){
			var	_=this,
				btn_close=ev.$(this.footer,'ins-btn-close')[0];
			ev.bind(btn_close,'click',function(){InstreetAd.slideIn(_);});
		},
		destroy:function(){

		}
	});


	InstreetAd.slideOut = function(obj){

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
			Animate(wrapper).animate({width:W},300);
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