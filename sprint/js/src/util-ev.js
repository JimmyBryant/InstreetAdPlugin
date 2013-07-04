	//function util
	var	ev = {
		bind : function(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false);
			}else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
			}else{
				element["on"+type] = handler;
			}
		},
		remove : function(element,type,handler){
			if(element.removeEventListener){
				element.removeEventListener(type,handler,false);
			}else if(element.datachEvent){
				element.datachEvent("on"+type,handler);
			}else{
				element["on"+type] = null;
			}
		},
		getEvent : function(event){
			return event ? event : window.event;
		},
		getTarget : function(event){
			return event.target || event.srcElement;
		},
		stopPropagation : function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			}
		},
		getRelatedTarget : function(event){
			if(event.relatedTarget){
				return event.relatedTarget;
			}else if(event.type == "mouseover"){
				return event.fromElement;
			}else if(event.type == "mouseout"){
				return event.toElement;
			}else{
				return null;
			}
		},
		getXY :function (obj){
			var x = 0, y = 0;
			if (obj.getBoundingClientRect) {
				var box = obj.getBoundingClientRect();
				var D = document.documentElement;
				x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
				y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
			} else {
				for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {  }
			}
			return {  x: x,  y: y };
		},
		aTrim	:function(arr){
			var array=[];
			arr.sort(sortNum);
			var len=arr.length,flag=0;
			for(var i=0;i<len;i++){
				if(arr[i]!=arr[i+1]){
					array[flag]=arr[i];
					flag++;
				}
			}
			return array;
			function sortNum(a,b){return a-b;}
		},
		$	:function(parentNode,tagName,className){
			var parent=parentNode||document,
				tag;
			if(arguments.length==2){
				className=tagName;
				tag="*";
			}else{
				tag=tagName||'*';
			}
			if(document.getElementsByClassName) return parent.getElementsByClassName(className);
			var arr=[];
			var elements=parent.getElementsByTagName(tag);
			for(var l=elements.length,i=l;i--;){
			   var ele=elements[i];
			   if(ele.className){
				 var cn=ele.className.replace(/\s/g,'|').split('|');
				 for(var len=cn.length,j=len;j--;){
					if(cn[j]==className){arr.push(ele);break;}
				 }
			   }
			}
			return arr;
		},
	    importFile  :function(type,name){
			 var link,script,
			 head=document.getElementsByTagName( "head" )[0] || document.documentElement;
			 switch(type){
				case "js":
					script=document.createElement('script');
					script.async="async";
					script.charset="utf-8";
					script.type="text/javascript";
					script.onload=script.onreadystatechange=function() {
						if(!script.readyState || script.readyState === "loaded" || script.readyState === "complete"){
							script.onload = script.onreadystatechange = null;
							if ( head && script.parentNode ) {
									head.removeChild( script );
							}
						}
					};
					script.src=name;
					head.appendChild(script);
					break;
				case "css":
					link = document.createElement("link");link.type = "text/css";link.rel = "stylesheet";
					link.href=name;
					head.appendChild(link);
					break;
			 }
		},
		hasClass:function(obj,c){
			if(obj.className){
				var arr=obj.className.split(' ');
				for(var i=0,len=arr.length;i<len;i++){
					if(c===arr[i]){
						return true;
					}
				}
			}
		   return false;
		},
		isVisible :function(obj){
			if (obj == document) return true;
			if (!obj) return false;
			if (!obj.parentNode) return false;
			if (obj.style) {
			    if (obj.style.display == 'none') return false;
			    if (obj.style.visibility == 'hidden') return false;
			}
			var style=null;
			//Try the computed style in a standard way
			if (window.getComputedStyle) {
			    style = window.getComputedStyle(obj, "");
			    if (style.display == 'none') return false;
			    if (style.visibility == 'hidden') return false;
			}

			//Or get the computed style using IE's silly proprietary way
			style = obj.currentStyle;
			if (style) {
			    if (style.display == 'none') return false;
			    if (style.visibility == 'hidden') return false;
			}

			return ev.isVisible(obj.parentNode);
		}
	};

	var $=function(id){return document.getElementById(id);}	//simplify document.getElementById
		,
		each=function(arrs,handler){
			if(arrs.length){
				for(var i=0,len=arrs.length;i<len;i++){
					handler.call(arrs[i],i);
				}
			}else{
				arrs&&handler.call(arrs,0);
			}
		}
		,
		hide=function(elem){
			each(elem,function(){
				this.style.display="none";
			});
		}
		,
		show=function(elem){
			each(elem,function(){
				this.style.display="block";
			});
		};