
    recordImage=function(img){	//页面加载时向服务器返回符合要求的图片信息
       var iu=encodeURIComponent(encodeURIComponent(img.src)),
	       pd=config.widgetSid,
		   pu=encodeURIComponent(encodeURIComponent(window.location.href)),
		   t=encodeURIComponent(encodeURIComponent(document.title)),
		   ul=config.ourl;
		var time=new Date().getTime();
		  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
		  ev.importFile('js',ul);

    };

    extend(InstreetAd.prototype,{
		recordShow : function(flag){	//统计广告展示次数,flag为10表示鼠标mouseover到图片,flag为9表示广告展示次数
			var _=this,
				data=_.adsData,
				img=_.image,
				ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				iu=encodeURIComponent(encodeURIComponent(img.src)),
				adsId="",
				adsType="",
				index=0,
				mx='',
				time=new Date().getTime(),
				w=parseFloat(_.box.lastChild.style.width);
			if(flag==10&&w>0)	//如果广告已经展示则不记录图片mouseover行为
				return;

			var app=null,
				selected=ev.$(_.content,'content-item-selected')[0];
			if(selected){
			if(selected.className.indexOf('ad-item')!=-1){	//推广
				app=data.badsSpot[0];
				adsId=app.adsId;
				adsType=app.adsType;
				app.adViewMonitorUrl&&ev.importFile('js',app.adViewMonitorUrl+'?time='+time);	//增加第三方广告展现统计
			}else if(selected.className.indexOf('shop-item')!=-1){	//折扣
				index=_.getSelectedIndex();
				app=data.adsSpot[index];
				adsId=app.adsId;
				adsType=app.adsType;
				mx=app.metrix;
			}else if(flag==9){ //如果展示的不是推广或者折扣并且flag==9，退出
				return;
			}
			}else if(flag==9){  //如果没有应用被展示则不记录广告展示
				return;
			}
			ul+="?pd="+pd+"&mx="+mx+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
			ev.importFile('js',ul);

		},
		recordWatch:function(){	//统计鼠标移动到广告或者微博、百科等内容的用户行为
			var  _=this,
				data=_.adsData,
				img=_.image,
				iu=encodeURIComponent(encodeURIComponent(img.src)),
				pd=data.widgetSid,
				url=config.murl,
				mid=data.imageNumId||'',
				muh=data.imageUrlHash,
				adData,
				ad='',
				at='',
				tg='',
				ift=0,
				tty=1,
				mx='';
			var tar=ev.$(_.content,'content-item-selected')[0],cn=tar.className;
			if(cn.indexOf('shop-item')!=-1){
				var index=_.getSelectedIndex(),
					app=data.adsSpot[index];
				ad=app.adsId;
				at=app.adsType;
				mx=app.metrix;
				tty=0;
			}else if(cn.indexOf('ad-item')!=-1){
				ad=data.badsSpot[0].adsId;
				at=data.badsSpot[0].adsType;
				tty=0;
			}else if(cn.indexOf('weibo-item')!=-1){
				ift=2;
			}else if(cn.indexOf('wiki-item')!=-1){
				ift=4;
			}else if(cn.indexOf('weather-item')!=-1){
				ift=7;
			}else if(cn.indexOf('news-item')!=-1){
				ift=5;
			}else{
				return;
			}
			var time=new Date().getTime();
			url+="?iu="+iu+"&mx="+mx+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&at="+at+"&tty="+tty+"&ift="+ift+"&time="+time;
			ev.importFile('js',url);
		}
	});