//dom ready event
var readylist=[],
	ready=false,
	loadedReg=/^(loaded|complete)$/;
var readyHandle = function () { 
	if(ready) return;  
	for (var i = 0; i < readylist.length; i++) readylist[i]&&readylist[i].call(document);
	ready=true;
	readylist=null;   
};
var DOMContentLoaded = function(){
	if (document.addEventListener) {
		document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false); 
		readyHandle(); 			
	}else{		
		if(loadedReg.test(document.readyState)){
			document.detachEvent('onreadystatechange',DOMContentLoaded);
			readyHandle();
		}
	}
};
var DOMReady = function (fn){ 

		if(document.readyState==='complete'){readyHandle();return;}	

		if (readylist.push(fn) > 1) return; 

		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);  			
			window.addEventListener('loaded', readyHandle, false);  
		}else if(document.attachEvent){
			document.attachEvent('onreadystatechange',DOMContentLoaded);
			window.attachEvent('onload',readyHandle);
		} 			
			 	  
}; 