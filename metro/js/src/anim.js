
	//	动画类
	var Animate=function(elem){


	    var timers=[],       //用于存放Fx对象
			timerId;         //全局计时器

	    var requestAnimationFrame = window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame;

		var isEmptyObject=function(obj){            //判断对象是否为空

				for ( var name in obj ) {
					return false;
				}
				return true;

		};

		var Animate=function(elem){

			this.elem=elem;
			return this;

		};

	    Animate.prototype.animate=function(property, duration, easing, callback){               //js动画入口API

			var elem=this.elem;
			var options=Animate.getOpt(duration, easing, callback);                     //修正参数

			if(elem&&elem.nodeType==1){

				var start,to;
				if(property&&typeof property=="object"){

					if(isEmptyObject(property)){             //如果property为空直接执行callback

						options.callback.call(elem);

					}else{

						options.animatedProperties={};
						for(var pro in property){
							options.animatedProperties[pro]=false;    //用于标记该属性的动画是否执行完毕
						}

						for(var name in property){

							var fx=new FX(elem,options,name);
							start=parseFloat(css(elem).get(name));
							end=parseFloat(property[name]);
							fx.custom(start, end);

						}


					}

				}

			}

		};

		Animate.prototype.fadeIn=function(duration, easing, callback){	// fadeIn方法
			var _=this,elem=_.elem;
			if(css(elem).get('display')=='none'){
				css(elem).set({opacity:0,display:'block'});
			}
			_.animate({opacity:1},duration, easing, callback);
		};

		Animate.prototype.fadeOut=function(duration, easing, callback){	// fadeOut方法
			var _=this,elem=_.elem;
			duration=duration||400;
			easing=easing||'swing';
			_.animate({opacity:0},duration,easing,function(){css(elem).set('display','none');callback&&callback();});
		};

	    Animate.prototype.stop=function(end){  //停止某个dom元素的动画  end为true则会把动画进行到最后一帧 false则停止到当前帧
			var elem=this.elem;
			end=end||false;
			for(var i=0;i<timers.length;i--){

			   var fx=timers[i];
			   if(fx.elem===elem){
			    if(end){
				  fx.update(fx.name,fx.end);
				}
			    timers.splice(i--,1); //移除fx要将i减1
			   }

			}
			return this;

		};

		Animate.getOpt=function(duration, easing, callback){       // 修正参数
			var opt={};
			opt.duration=duration;
			opt.callback=callback||easing||duration;
			opt.old=opt.callback;
			opt.easing=callback&&easing||easing||duration;
			opt.callback=function(){
				if(typeof opt.old=="function"){
					opt.old.call(this);
				}
			};

			opt.duration=typeof opt.duration=="number"?opt.duration:400;
			opt.easing=typeof opt.easing=="string"?opt.easing:"swing";
			return opt;

		};

		var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象

			this.elem=elem;
			this.options=options;
			this.name=name;

		};

		FX.interval=13;

		FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

			var raf,
				self=this;
			this.startTime = new Date().getTime();
			this.start = from;
			this.end = end;

			function t( gotoEnd ) {
				return self.step(gotoEnd);
			}
			t.elem = this.elem;
			if ( t() && timers.push(t) && !timerId ) {
				// 如果可以的话使用requestAnimationFrame代替setInterval
				if ( requestAnimationFrame ) {
					timerId = true;
					raf = function() {
						// 当timerId设为null，动画停止
						if ( timerId ) {
							requestAnimationFrame( raf );
							FX.tick();
						}
					};
					requestAnimationFrame( raf );
				} else {
					timerId = setInterval( FX.tick, FX.interval );
				}
			}

		};

		FX.prototype.step=function(){
		    var now=new Date().getTime(),
				nowPos,
				done=true,
				options=this.options;

			if(now>options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
			   nowPos=this.end;
			   options.animatedProperties[ this.name ] = true;
				for (var i in options.animatedProperties ) {
					if ( options.animatedProperties[i] !== true ) {
						done = false;
					}
				}
			   done&&options.callback.call(this.elem);  //所有动画结束执行回调函数
			   this.update(this.name,nowPos);
			   return false;
			}else{
			    var n = now - this.startTime;
	            var state = n / options.duration;
	            var pos =Easing[options.easing](state, 0, 1, options.duration);
	            nowPos = this.start + ((this.end - this.start) * pos);
	        }

	        this.update(this.name,nowPos);
	        return true;
		};

		FX.prototype.update=function(name,value){

			if(name!="opacity"){
				value+="px";
			}
			css(this.elem).set(name,value);

		};

		FX.tick = function(){                //用于计时器中执行动画队列

			for ( var  i = 0 ; i < timers.length ; ++i ) {
				if ( !timers[i]() ) {
					timers.splice(i--, 1);
				}
			}
	        if (!timers.length){
	            FX.stop();
	        }

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

		return new Animate(elem);

	};