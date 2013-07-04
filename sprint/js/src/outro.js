	var removeOld = function(index){	// 移除旧的dom对象

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

	var refilter = function(count){	// 用于window onload时对图片重新过滤
		count=count||0;
		var images = document.getElementsByTagName('img');
		for(var i=0,len=images.length;i<len;i++){
			var img=images[i];
			// 记得要判断图片是否来自我们的折扣
			if(img.className.indexOf('ins-shop-image')!=-1||img.insDataLoading===true||img.getAttribute('instreet_data_loading')||img.insDataLoaded===true||img.getAttribute('instreet_data_loaded')){
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
			setTimeout(function(){refilter(++count);},1000);
		}
	};

    window.insjsonp=function(data){	//jsonp回调方法

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

	function init(){	//初始化插件

		 if(typeof instreet_config!="undefined"){		//mix配置信息
			 extendConfig(instreet_config);
		 }
	     instreet.init();
		 cache.requestAd();
		 ev.bind(window,'load',function(){InstreetAd.reLocate();refilter();});
		 ev.bind(window,'resize',function(){InstreetAd.reLocate();});
		 //定时检测图片是否变化
         TimerTick(cache.adsArray);

	}

	DOMReady(function(){	//dom ready后开始执行init
		init();	//插件初始化
	});

})(window);