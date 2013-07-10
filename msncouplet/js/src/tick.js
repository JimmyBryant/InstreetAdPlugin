
	var maxSwitchNumber=5;
	var timerTick=function(arr){
		setInterval(function(){
			for(var i in arr){
				var ad=arr[i];
				if(ad&&ad.isImgChanged()){	//图片发生改变
					if(ad.img.src!=ad.param.prevSrc){
						var img=ad.img;
						if(ad.switchCount==maxSwitchNumber){
							ad.destroy();
							arr[i]=null;
							config.adsLimit++;	//防止广告请求超过限制
							cache.imgLoadHandle(img);	//重新请求广告
							break;
						}
						ad.switchCount++;
					}
				}
			}
		},100);
	};