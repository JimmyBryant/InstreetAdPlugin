	var animate=(function(){	//animate方法

	    var timers=[],       //用于存放Fx对象
			timerId;         //全局计时器


		var isEmptyObject=function(obj){            //判断对象是否为空

				for ( var name in obj ) {
					return false;
				}
				return true;

		};

	    var Animate= function	(elem,property, duration, easing, callback){               //js动画入口API

		   var options=Animate.getOpt(duration, easing, callback);                     //修正参数

		   if(elem&&elem.nodeType==1){

			    var start,to;
			    if(property&&typeof property=="object"){

					if(isEmptyObject(property)){             //如果property为空直接执行callback

					    callback.call(elem);

					}else{

					   for(var name in property){

					      var fx=new FX(elem,options,name);
						  start=css.get(elem,name);
						  end=parseFloat(property[name]);
					      fx.custom(start, end);

					   }


					}

				}

		   }

		 };

		Animate.getOpt=function(duration, easing, callback){       // 修正参数

			 var options ={duration:duration||200,easing:easing||"linear"};
			 options.callback=function(){callback&&callback();};
			 return options;

		};

	    Animate.stop=function(elem,end){                               //停止某个dom元素的动画  end为true则会把动画进行到最后一帧 false则停止到当前帧
		    end=end||false;
			for(var i=timers.length;i--;){
			   var fx=timers[i];
			   if(fx.elem===elem){
			    if(end){
				  fx.update(fx.name,fx.end);
				}
			    timers.splice(i,1);
			   }

			}

		};

		var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象

			this.elem=elem;
			this.options=options;
			this.name=name;

		};
		FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

			this.startTime = new Date().getTime();
			this.start = from;
			this.end = end;

			timers.push(this);
			FX.tick();

		};
		FX.prototype.step=function(){
		    var now=new Date().getTime(),
				nowPos;

			if(now>this.options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
			   nowPos=this.end;
			   this.options.callback.call(this.elem);
			   this.stop();
			}else{
			    var n = now - this.startTime;
	            var state = n / this.options.duration;
	            var pos =Easing[this.options.easing](state, 0, 1, this.options.duration);
	            nowPos = this.start + ((this.end - this.start) * pos);
	        }

	        this.update(this.name,nowPos);
		};

		FX.prototype.stop=function(){

			for(var i=timers.length;i--;){

				if(timers[i]===this){
					timers.splice(i,1);
				}
			}

		};

		FX.prototype.update=function(name,value){

			if(name!="opacity")
			{
				value+="px";
			}

			css.set(this.elem,name,value);

		};


		FX.tick = function(){
	        if (timerId) return;                                   //如果计时器已经在走则退出

	        timerId = setInterval(function(){
	            for (var i = 0,len=timers.length;i<len;i++){
	                timers[i]&&timers[i].step();
	            }
	            if (!timers.length){
	                FX.stop();
	            }
	        }, 13);
	    };

		FX.stop = function(){                                  //清除全局计时器 停止所有动画
	        clearInterval(timerId);
	        timerId = null;
	    };

	    var Easing={                                         //easing对象

			linear: function( p ) {
				return p;
			},
			swing: function( p ) {
				return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
			}

		};

		return Animate;

	})();