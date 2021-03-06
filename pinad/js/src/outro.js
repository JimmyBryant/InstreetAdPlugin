	// load image action的回调
	window.ins_image_jsonp=function(data){
		if(data&&data.image_context_sensi===true){
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
	//jsonp callback
	window.insjsonp=function(data){
		if(data){
			var index=data.index,
				img=imgs[index];
			img.setAttribute('instreet-data-ready',true);
			cache.adsArray[index]=new InstreetAd(data);
			if(config.footAuto){
				var ad=cache.adsArray[index];
				ad.showAd();
				ad.ad&&ad.recordShow(9,null);
			}
		}
	};

	//TimerTick 方法
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
	//插件初始化
	var init=function(){

		if(typeof instreet_config!="undefined"){		//extend config
			extendConfig(instreet_config);
		}
		instreet.init();
		cache.initData();
		ev.bind(window,'resize',function(){InstreetAd.reLocate();});
		//dom ready后搜索是否有新的图片
		// document.DomReady(function(){
		// 		instreet.search()
		// });
		//定时检测图片是否变化
		TimerTick(cache.adsArray);
	};
	DOMReady(function(){
		init();
	});
})(window);
