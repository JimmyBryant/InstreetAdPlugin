// slide.js  has slideUp and slideDown 
var slider=(function(elem,speed){
	var timerId=null,list=[];			
    var slider=function(elem, speed){
	    
		this.elem=elem;
		this.speed=speed||300;			
		this.height=elem.clientHeight;
		elem.style.height=0;  									
	};
	slider.prototype.slideDown=function(callback){
	   var _this=this, elem=_this.elem,speed=_this.speed,
		   start=elem.clientHeight,end=_this.height;

	    elem.style.display ="block"; 
	    _this.fx=new Fx(elem,speed,start,end,callback);
		list.push(_this.fx);			
	};
	slider.prototype.slideUp=function(callback){
	   var _this=this, elem=_this.elem,speed=_this.speed,
		   start=elem.clientHeight,end=0;
		_this.fx=new Fx(elem,speed,start,end,callback);
		list.push(_this.fx);
	};
	slider.prototype.stop=function(){
		this.fx&&this.fx.stop();
	};
	var Fx=function(elem,speed,start,end,callback){
		this.elem=elem;
		this.start=start;
		this.startTime=new Date().getTime();
		this.speed=speed;
		this.end=end;
		this.callback=callback;
			
		if(!list.length&&!timerId){
			timerId=setInterval(function(){
				for(var i=0;i<list.length;i++){							
					list[i].step&&list[i].step();
				}
				if(!list.length){
					clearInterval(timerId);
					timerId=null;
				}
			},13);
		}
	};

 	Fx.prototype.step=function(){
	   var _this=this,start=_this.start,end=_this.end,
	   	   p=(new Date().getTime()-_this.startTime)/_this.speed,
		   swing=(-(Math.cos(p*Math.PI)/2) + 0.5),
		   gap=end-start;
		if(p<1){   
			_this.elem.style.height=start+(gap*swing)+'px';	
		}else{//动画结束					
			_this.elem.style.height=end+'px';
			_this.callback&&_this.callback(); //执行callback
			_this.stop();
		}
	};
	//停止动画
	Fx.prototype.stop=function(){
		var i=0;
		for(;i<list.length;i++){
			if(list[i]===this){
				list.splice(i--,1);//移除动画
			}
		}
	};
	return slider;
})();