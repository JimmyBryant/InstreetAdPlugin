	var css={	//css对象，用于设置样式或者获取样式

	   get:function(elem,style){

			var value;
			if(style == "float"){
			document.defaultView ? style = 'cssFloat': style='styleFloat';
			}
			if(style=="opacity"){
			document.defaultView ? style = 'opacity': style='filter';
			}

			if (document.defaultView && document.defaultView.getComputedStyle) {
			value=document.defaultView.getComputedStyle(elem, null)[style];

			}else if (elem.currentStyle){

				value = elem.currentStyle[style];
				if(style=="filter"){

					if(value.match("alpha")){

						value=parseFloat(value.match(/\d+/)[0])/100;

					}else if(!value){

						value=1;
					}
				}

			}

			typeof value=="string"&&value.match("px")?value=parseInt(value.replace("px",""),10):value;          //如果value包含px则转换成num
			style=="opacity"?value=parseInt(value,10):value;
			return value;

		},
		set:function(elem,style,value){

			if(style=="float"){
			document.defaultView ? style = 'cssFloat': style='styleFloat';
			}
			if(style=="opacity"){
			elem.style.filter="alpha(opacity="+value*100+")";
			elem.style.zoom=1;
			}
			elem.style[style]=value;

		}



	};