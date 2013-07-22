
	var cache={	//广告数据cache对象

		adsArray   :[],
        requestAd   :function(){

			var images=document.getElementsByTagName('img');
			for(var i=0,len=images.length;i<len;i++){
				var img=images[i];
				imgs[i]=img;
				img.insId=i;
				img.setAttribute("instreet_img_id",i);
				cache.imgLoadHandle(img);
			}

	    },
	    imgLoadHandle  :function(img){
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
				};
			}
	    },
		loadData     :function(img){
			var index=img.insId,clientImg=imgs[index];
			if(img.width>=config.imiw&&img.height>=config.imih){
				if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih||(clientImg.clientWidth===0&&clientImg.clientHeight===0)){
				if(typeof config.adsLimit=="number"&&config.adsLimit<=0){
					return;
				}
				clientImg.setAttribute('instreet_data_loading',true);
				clientImg.insDataLoading	= true;		//标记正在请求数据
				// InstreetAd.recordImage(clientImg);	 //loadImage action
				cache.createJsonp(clientImg);
				config.adsLimit&&config.adsLimit--;
				}
			}
		},
		createJsonp  :function(img){
		   var w=config.width||250,h=config.height||250;
		   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
		   ev.importFile('js',url);
		}

	};