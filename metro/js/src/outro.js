
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