	var css = (function(window){

		var css=function(elem){

			this.get=function(name){	//获取单个dom元素css属性值

				var core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,//用于匹配数字
					rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
					rposition = /^(top|right|bottom|left)$/,
					ropacity = /opacity=([^)]*)/,
				    rmargin = /^margin/;

				if(typeof name!='string'){
					return '';
				}
				name=name.replace(/\-(\w)/g, function(){return arguments[1].toUpperCase();});
				var getWidthOrHeight=function(elem,name){	//用于获取elem的width和height

					var ret=name==="width"?elem.clientWidth:elem.clientHeight
						,pt=parseFloat(new css(elem).get('paddingTop'))
						,pb=parseFloat(new css(elem).get('paddingBottom'))
						,pl=parseFloat(new css(elem).get('paddingLeft'))
						,pr=parseFloat(new css(elem).get('paddingRight'));

					ret=(name==="width"?ret-pl-pr:ret-pt-pb)+'px';
					return ret;

				};
				var ret,style,computed;
				//标准浏览器
				if(window.getComputedStyle){
					var width,
						minWidth,
						maxWidth;

					computed = window.getComputedStyle( elem, null );
					style = elem.style;
					name=name==="float"?"cssFloat":name;  //cssFloat获取float

					if ( computed ) {
						ret = computed[ name ];
						// A tribute to the "awesome hack by Dean Edwards"
						// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
						// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
						// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
						if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
							width = style.width;
							minWidth = style.minWidth;
							maxWidth = style.maxWidth;

							style.minWidth = style.maxWidth = style.width = ret;
							ret = computed.width;

							style.width = width;
							style.minWidth = minWidth;
							style.maxWidth = maxWidth;
						}
					}

					return ret;
				}else if(document.documentElement.currentStyle){       //IE浏览器

					var left,
						rsLeft;

					style = elem.style;
					ret = elem.currentStyle && elem.currentStyle[ name ];
					name=name==="float"?"styleFloat":name;//styleFloat获取float
					if(name==='opacity'){

						return ropacity.test( (elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?( 0.01 * parseFloat( RegExp.$1 ) ) + "" : 1;

					}else if(name==="width"||name==="height"){

						if(elem.currentStyle[name]==="auto"){    //如果未设置width,height默认返回auto
							ret=getWidthOrHeight(elem,name);
							return ret;
						}

					}

					// Avoid setting ret to empty string here
					// so we don't default to auto
					if ( ret === null && style && style[ name ] ) {
						ret = style[ name ];
					}

					// From the awesome hack by Dean Edwards
					// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

					// If we're not dealing with a regular pixel number
					// but a number that has a weird ending, we need to convert it to pixels
					// but not position css attributes, as those are proportional to the parent element instead
					// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
					if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

						// Remember the original values
						left = style.left;
						rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

						// Put in the new values to get a computed value out
						if ( rsLeft ) {
							elem.runtimeStyle.left = elem.currentStyle.left;
						}
						style.left = name === "fontSize" ? "1em" : ret;
						ret = style.pixelLeft + "px";

						// Revert the changed values
						style.left = left;
						if ( rsLeft ) {
							elem.runtimeStyle.left = rsLeft;
						}
					}

					return ret === "" ? "auto" : ret;

				}else{
					return elem.style[name];
				}
			};
			this.set=function(name,value){	//设置css属性
				// 一次设置多个css属性
				if(name&&typeof name=="object"&&value===undefined){
					var tmpStyle='';
					for(var pro in name){
						if(!window.getComputedStyle&&pro=='opacity'){
							tmpStyle+="filter:alpha(opacity="+100*name[pro]+");";
						}else{
							tmpStyle+=pro+':'+name[pro]+";";
						}
					}
					elem.style.cssText+=";"+tmpStyle;
					return;
				}
				//设置单个css 属性
				name=name.replace(/-([\w])/,function(){return arguments[1].toUpperCase();});
				if(window.getComputedStyle){
					name=name==="float"?"cssFloat":name;
				}else{
					name=name==="float"?"styleFloat":name;
					if(name==="opacity"){
						elem.style.filter="alpha(opacity="+100*value+")";
					}
				}
				elem.style[name]=value;
			};
			return this;
		};

		return function(elem){	//省去调用过程使用new
			return new css(elem);
		};

	})(window);

