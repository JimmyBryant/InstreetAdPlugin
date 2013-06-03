var document = window.document,
	navigator = window.navigator,
	location = window.location,
	imgs=[];
//cache对象，加载广告数据
var cache={
	adsArray   :[],
    initData   :function(){
		var images=document.getElementsByTagName('img');
		for(var i=0,len=images.length;i<len;i++){
			var img=images[i];
			imgs[i]=img;
			img.insId=i;
			img.setAttribute("instreet-img-id",i);
			cache.onImgLoad(img);
		}
    },
    onImgLoad	:function(img){
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
	loadData	:function(img){
		var index=img.insId,
			clientImg=imgs[index];
		if(img.width>=config.imiw&&img.height>=config.imih){
			if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih){
				instreet.recordImage(clientImg);
				if(typeof config.adsLimit=="number"&&config.adsLimit<=0){
					return;
				}
				cache.createJsonp(clientImg);
				config.adsLimit&&config.adsLimit--;
			}
		}
	},
	createJsonp	:function(img){
		var w=img.clientWidth,h=0;
		var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp&w="+w+"&h="+h;
		ev.importFile('js',url);
	}

};