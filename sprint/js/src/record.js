
    InstreetAd.prototype.recordShow=function(flag){	//鼠标移动到图片的时候发送展现记录

		var _this=this,
			data=_this.data,
			img=_this.img,
			ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
			iu=encodeURIComponent(encodeURIComponent(img.src)),
			focus=ev.$(_this.tabs,null,'focus')[0],
			adsId="",
			adsType="",
			index=0,
			mx='',
			time=new Date().getTime();

		if(focus){
			if(focus.lastChild.className=="ad"){
				var app=data.badsSpot[0];
				adsId=app.adsId;
				adsType=app.adsType;
				//增加第三方广告展现统计
				app.adViewMonitorUrl&&ev.importFile('js',app.adViewMonitorUrl+'?time='+time);

			}else if(focus.lastChild.className=="shop"){
				index=_this.getSelectedIndex("shop");
				adsId=data.adsSpot[index].adsId;
				adsType=data.adsSpot[index].adsType;
				mx=data.adsSpot[index].metrix;
			}
		}
		ul+="?pd="+pd+"&mx="+mx+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
		ev.importFile('js',ul);

	};
    InstreetAd.prototype.recordWatch=function(tar){	//鼠标移动到广告或者微博、百科上发送行为记录

		var  _this=this,data=_this.data,
			img=_this.img,
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
			cn=tar.className,
			index=_this.getSelectedIndex(cn);
		if(cn=="shop"){

			ad=data.adsSpot[index].adsId;
			at=data.adsSpot[index].adsType;
			mx=data.adsSpot[index].metrix;
			tty=0;
		}else if(cn=="weibo"){
			ift=2;
			mx=data.weiboSpot[index].metrix||'';
		}else if(cn=="wiki"){
			ift=4;
			mx=data.wikiSpot[index].metrix||'';
		}else if(cn=="weather"){
			ift=7;
		}else if(cn=="news"){
			ift=5;
		}else if(cn=="ad"){
			ad=data.badsSpot[0].adsId;
			at=data.badsSpot[0].adsType;
			tty=0;
		}else{
			return;
		}
		var time=new Date().getTime();
		ul+="?iu="+iu+"&mx="+mx+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&at="+at+"&tty="+tty+"&ift="+ift+"&time="+time;
		ev.importFile('js',ul);
	};

    InstreetAd.recordImage=function(img){	//页面加载时向服务器返回符合要求的图片信息
		var iu=encodeURIComponent(encodeURIComponent(img.src)),
			pd=config.widgetSid,
			pu=encodeURIComponent(encodeURIComponent(window.location.href)),
			t=encodeURIComponent(encodeURIComponent(document.title)),
			ul=config.ourl;
		var time=new Date().getTime();
		ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
		ev.importFile('js',ul);
    };