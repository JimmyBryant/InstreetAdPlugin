/*
	weibo_show.js v0.0.1

	require jquery.js,json.js,store.js
*/ 
(function(){

var name = 'NBA',
    token = '2.00EtGhhCgTSLCE8bc386dee1wOaSBC',
	count = 20,		//一次请求微博的数量，最大20
	fresh_time=30, //单位'分钟''
	newData=false;	
	

	// get token xml
	var get_token=function(){
		var token_arr=['2.00pxPkrBjswcRE862e4635e6GY9dHB','2.00pxPkrBsZ4MoBbdd779f26erHUwtB','2.00pxPkrBQ_lHIC3c3257458cuIYF3B','2.00pxPkrBZ7tuHEd20a412e94AWsVrD',
			'2.00pxPkrBmqNRNBe4a310c0f87kTMrB','2.00pxPkrBe42aUB6c007ec12e0UOQN4','2.00pxPkrBPhCtSEad3300334a0uKOBi','2.00pxPkrBl83ELB8f277868adQvNSTD','2.00pxPkrBkPWuNEff1cc20353_xXAPD',
			'2.00pxPkrBBqYLEC7d76383f2dAkbBjC'];
		return token_arr[Math.floor(Math.random()*token_arr.length)];
	};
	
	// 请求微博数据
	function requestAPI(token){

		var data=store.get(name),
			stored_at=store.get(name+'_stored_at'),
			diff=null;
		if(stored_at){
			diff=(new Date().getTime()-stored_at)/60000;
		}
		if(data&&diff!=null&&diff<fresh_time){
			var d=JSON.parse(data);
			weiboHandle(d,token);
		}else{
			var userAPI = 'https://api.weibo.com/2/statuses/user_timeline.json?screen_name='+name+'&count='+count+'&access_token='+token+'&_cache_time=0&method=get&callback=?';
			$.getJSON(userAPI,function(data){
				if(data){
					var d=data.data.statuses;
					store.set(name,JSON.stringify(d));
					store.set(name+'_stored_at',new Date().getTime()); //记录下store时间
					newData=true;//标记从新请求过数据
					weiboHandle(d,token);
				}
		 			
			});
		}

	};

	//prettyDate
	function prettyDate(time){

		function parseDate(str) {
			var v=str.split(' ');
			v[4]='UTC'+v[4];
			var utc=v.join(' ');		
			return new Date(utc);
		} 
		var date = parseDate(time||""),now=new Date(),
			is_today=date.toLocaleDateString()===now.toLocaleDateString(),
			diff = ((now.getTime() - date.getTime()) / 1000);
		
		if ( isNaN(diff))
		return '';

		if(!is_today){
			return (date.getMonth()+1)+'月'+date.getDate()+'日 '+date.getHours()+':'+(date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes());
		}
		if(diff>=7200&&is_today){
			 return '今天 '+date.getHours()+':'+(date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes());
		}
	    return is_today && (
	      diff < 60 && "刚才" ||
	      diff < 120 && "1分钟前" ||
	      diff < 3600 && Math.floor( diff / 60 ) +
	        "分钟前" ||
	      diff < 7200 && "1小时前" ||
	      diff < 86400 && Math.floor( diff / 3600 ) +
	        "小时前"); 
	};
	// weibo API的回调函数
	var  weiboHandle = function(data,token){
	 	 
	 	 var user=data[0].user,
	 	 	 idArr=[];

	 	 //创建head
	 	 var createHead = function(){
	 	 	var $head = $('#widget-head'),
	 	 		str='',
	 	 		name=user.name,
	 	 		avatar=user.profile_image_url,
	 	 		location=user.location,
	 	 		url='http://www.weibo.com/u/'+user.id;
	 	 	str+='<div class="avatar"><a href="'+url+'" title="'+name+'"><img src="'+avatar+'"/></a></div>'	
	 	 	str+='<div class="detail"><a class="name" href="'+url+'"><span>'+name+'</span></a><p>'+location+'</p></div>'
	 	 	$head.html(str);
	 	 };
	 	 // 创建content
	 	 var createContent = function(){
	 	 	var $cont = $('#widget-main-content'),
	 	 		$ul = $('<ul class="weibo-list"></ul>'),
	 	 		str='';

	 	 	for(var i=0,len=data.length;i<len;i++){

	 	 		var weibo=data[i],
	 	 			id=weibo.id,
	 	 			text=weibo.text,
	 	 			pic_urls=weibo.pic_urls;
	 	 		idArr.push(id);      //将weibo id存进数组	
	 	 		str+='<li id="wb-'+id+'" data-index="'+i+'"><p>'+text+'</p>';
	 	 		if(pic_urls.length>0){
	 	 			var thumbnail_pic=pic_urls[0].thumbnail_pic,
	 	 				original_pic=weibo.original_pic;
	 	 			str+='<p class="pic"><a href="'+original_pic+'"><img src="'+thumbnail_pic+'"/></a></p>'
	 	 		}
	 	 		str+='</li>';
	 	 	}
	 	 	$cont.append($ul.html(str));
	 	 };

	 	 // 创建action
	 	 var createAction = function(mids){

	 	 	var $cont = $('#widget-main-content');
	 	 		
 	 		if(mids){

 	 			for(var i=0,len=mids.length;i<len;i++){

 	 				for(var n in mids[i]){
 	 					var mid=mids[i][n],
 	 						$li=$('#wb-'+n), 	 							 	 					
 	 						$action=$('<p class="action">'),
 	 						index=$li.attr('data-index'),
 	 						comments_count=data[index].comments_count,
 	 						reposts_count=data[index].reposts_count
 	 						time=prettyDate(data[index].created_at),
 	 						url='http://www.weibo.com/'+user.id+'/'+mid,
 	 						str='<a href="'+url+'" class="time">'+time+'</a><span class="action-more"><a href="'+url+'">转发('+reposts_count+')</a><em>|</em><a href="'+url+'">评论('+comments_count+')</a></span>';	 	 					
 	 					$li.append($action.html(str));
 	 					break;	
 	 				}

 	 			}
 	 		}
	 	 };		 	 		
	 	 //request mid
	 	 var requestMID=function(){
	 	 	var mid=store.get(name+'_mid');
	 	 	if(mid&&!newData){
	 	 		createAction(JSON.parse(mid));
	 	 	}else{
	 	 		var id=idArr.join(','),
	 	 			midAPI ='https://api.weibo.com/2/statuses/querymid.json?access_token='+token+'&type=1&is_batch=1';	 
	 	 		$.getJSON(midAPI+'&callback=?&id='+id,function(res){
	 	 			if(res&&typeof res=='object'){
	 	 				var mids=res.data;
	 	 				store.set(name+'_mid',JSON.stringify(mids));
	 	 				createAction(mids);
	 	 			}
	 	 		});
	 	 	}
	 	 };
	 	 createHead();
	 	 createContent();
	 	 requestMID();

	};

	// createWidget
	var createWidget = function(){

		var token=get_token();
		requestAPI(token);

	};

	createWidget();
	
})();
		