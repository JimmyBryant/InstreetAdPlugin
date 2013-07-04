//鼠标移动到图片的时候发送展现记录
InstreetAd.prototype.recordShow= function(flag,spot){
	var _=this,
		data=_.data,
		img=_.img,
		ul=config.iurl,
		pd=data.widgetSid,
		muh=data.imageUrlHash,
		iu=encodeURIComponent(encodeURIComponent(img.src)),
		adsId="",
		adsType="",
		mx="",
		app=null;
	if(flag==9&&spot){
		var metrix=spot.metrix;
		for(var i=0,len=data.adsSpot.length;i<len;i++){
			app=data.adsSpot[i];
			if(app.metrix==metrix){
				adsId+=adsId===""?app.adsId:","+app.adsId;
				adsType+=adsType===""?app.adsType:","+app.adsType;
				mx=app.metrix;
			}
		}
	}else if(flag==10&&_.ad){
		app=data.badsSpot[0];
		adsId=app.adsId;
		adsType=app.adsType;
	}

	var time=new Date().getTime();
	ul+="?pd="+pd+"&muh="+muh+"&mx="+mx+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
	ev.importFile('js',ul);
	//增加第三方广告展现统计
	!spot&&data.badsSpot[0]&&data.badsSpot[0].adViewMonitorUrl&&ev.importFile('js',data.badsSpot[0].adViewMonitorUrl+"?time="+time);

};
//鼠标移动到广告或者微博、百科上发送行为记录
InstreetAd.prototype.recordWatch=function(tar){
	var _=this,data=_.data,
		img=_.img,
		iu=encodeURIComponent(encodeURIComponent(img.src)),
		pd=data.widgetSid,
		ul=config.murl,
		mid=data.imageNumId||'',
		muh=data.imageUrlHash,
		adData,
		ad='',
		at='',
		tg='',
		ift=0,
		tty=1,
		mx='',
		i=0,
		len=0,
		app=null,
		metrix;
    var cn=tar.className.replace("-holder","");

    if(cn=="shop"){
		metrix=instreet.shop.metrix;
		len=data.adsSpot.length;
		for(i=0;i<len;i++){
			app=data.adsSpot[i];
			if(app.metrix==metrix){
				ad+=ad===""?app.adsId:","+app.adsId;
				at+=at===""?app.adsType:","+app.adsType;
			}
		}
		tty=0;
		mx=metrix;
	}else if(cn=="weibo"){
		ift=2;
		metrix=instreet.weibo.metrix;
		len=data.weiboSpot.length;
		for(i=0;i<len;i++){
			app=data.weiboSpot[i];
			mx=metrix;
			// if(app.metrix==metrix){
			// 	 tg=app.title||'';
			// 	 break;
			// }
		}
	}else if(cn=="wiki"){
		ift=4;
		metrix=instreet.wiki.metrix;
		len=data.wikiSpot.length;
		for(i=0;i<len;i++){
			app=data.wikiSpot[i];
			mx=metrix;
			// if(app.metrix==metrix){
			// 	 tg=app.title||'';
			// 	 break;
			// }
		}
	}else if(cn=="ad"){
		ad=data.badsSpot[0].adsId;
		at=data.badsSpot[0].adsType;
		tty=0;
	}else{
		return;
	}
	var time=new Date().getTime();
	ul+="?iu="+iu+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&mid="+mid+"&at="+at+"&tty="+tty+"&ift="+ift+"&mx="+mx+"&time="+time;
	ev.importFile('js',ul);
};