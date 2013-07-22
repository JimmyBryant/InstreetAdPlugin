
	var requestAdsData = function(img){	// 请求图片的广告数据

		var loadImage = function(img,callback){	// 预加载图片

			 var image=new Image();
			 if(typeof img.src=="undefined")        //没有src属性则退出
				return;
			 image.src=img.src;
			 image.insIndex=img.insIndex;
			 if(image.complete){
			    callback&&callback(image);
			 }else{
				 image.onload=function(){
				   var obj=this;
				   obj.onload=null;
				   callback&&callback(image);
				 };
		     }

		};

		var loadHandle = function(img){	// 用于图片onload回调

			var index=img.insIndex,
				clientImg=imagesList[index];
			if(img.width>=config.imiw&&img.height>=config.imih){
				if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih||(clientImg.clientWidth===0&&clientImg.clientHeight===0)){

					if(typeof config.adsLimit=="number"&&config.adsLimit<=0){
						return;
					}

					clientImg.setAttribute('instreet_data_loading',true);//标记正在请求数据
					clientImg.insDataLoading	= true;
					// 为不支持naturalWidth的浏览器增加naturalWidth
					if(typeof clientImg.naturalWidth=="undefined"||typeof clientImg.naturalHeight=="undefined"){
							clientImg.naturalWidth=img.width;
							clientImg.naturalHeight=img.height;
					}
					recordImage(clientImg);	//loadImage action
					createJsonp(clientImg);	//请求广告数据
					config.adsLimit&&config.adsLimit--;
				}
			}

		};

		var createJsonp = function(img){	// createJsonp 跨域请求广告数据

			var w=250,
				h=250;
			if(typeof config.sizeNum=="number"){
				w=sizeList[config.sizeNum*2];
				h=sizeList[config.sizeNum*2+1];
			}
			var iu=encodeURIComponent(encodeURIComponent(img.src)),
			url=config.callbackurl+"?index="+img.insIndex+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
			ev.importFile('js',url);

		};

		loadImage(img,loadHandle);

	};