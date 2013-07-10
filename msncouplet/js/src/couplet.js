
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
				this.param.prevSrc=this.param.initSrc;
				this.param.initSrc=img.src;
				return true;
			}
			return false;
		}
	},msnCouplet.prototype);