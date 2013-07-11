
    window.insjsonp=function(data){	//jsonp回调方法

	    if(data){
			var index=data.index,
				img=imgs[index];
			img.insDataLoaded=true;
			img.setAttribute('instreet_data_loaded',true);
			var couplet=new msnCouplet(container,data);	//实例一个msnCouplet对象
			cache.adsArray[index]=couplet;	//缓存msnCouplet对象
		}

	};

	function init(){	//初始化插件

		 if(typeof instreet_config!="undefined"){		//mix配置信息
			extend(instreet_config,config);
			config.width=120;
			config.height=600;
		 }
		 if((container=createContainer())){
			config.cssurl&&ev.importFile('css',config.cssurl);
			cache.requestAd();
			ev.bind(window,'resize',function(){msnCouplet.relocate();});
			timerTick(cache.adsArray);	//定时检测图片是否切换
		 }


	}

	DOMReady(function(){	//dom ready后开始执行init
		init();	//插件初始化
	});

})(window);