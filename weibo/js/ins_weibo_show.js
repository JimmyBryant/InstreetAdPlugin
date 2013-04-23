/*
	weibo_show.js v0.0.1

	require jquery*
*/ 
(function(){

var name = 'NBA',
    token = '2.00EtGhhCgTSLCE8bc386dee1wOaSBC',
	count = 20,
	userApi = 'https://api.weibo.com/2/statuses/user_timeline.json?screen_name='+name+'&count='+count+'&access_token='+token+'&_cache_time=0&method=get&callback=?',
	midApi ='https://api.weibo.com/2/statuses/querymid.json?access_token='+token+'&type=1&is_batch=1';	 
	$.getJSON(userApi,function(data){

	 	createWeiboWidgets(data.data.statuses);	

	});
	//时间处理函数
	function prettyDate(time){
	  var date = new Date(time || ""),
	    diff = (((new Date()).getTime() - date.getTime()) / 1000),
	    day_diff = Math.floor(diff / 86400);
	 
	  if ( isNaN(day_diff) || day_diff < 0 )
	    return;
	  if(diff>=7200&&day_diff<1){
	  	 return '今天 '+date.getHours()+':'+date.getMinutes();
	  }
	  if(day_diff>=1){
	  	return (date.getMonth()+1)+'月'+date.getDate()+'日 '+date.getHours()+':'+date.getMinutes();
	  }
	  return day_diff == 0 && (
	      diff < 60 && "刚才" ||
	      diff < 120 && "1分钟前" ||
	      diff < 3600 && Math.floor( diff / 60 ) +
	        "分钟前" ||
	      diff < 7200 && "1小时前" ||
	      diff < 86400 && Math.floor( diff / 3600 ) +
	        "小时前") 
	};

	var  createWeiboWidgets = function(data){

	 	 console.log(data);

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
	 	 			pic_urls=weibo.pic_urls,
	 	 			created_time=weibo.created_at;
	 	 		idArr.push(id);      //将weibo id存进数组	
	 	 		str+='<li id="wb-'+id+'" created_time="'+created_time+'"><p>'+text+'</p>';
	 	 		if(pic_urls.length>0){
	 	 			var thumbnail_pic=pic_urls[0].thumbnail_pic,
	 	 				original_pic=weibo.original_pic;
	 	 			str+='<p class="pic"><a href="'+original_pic+'"><img src="'+thumbnail_pic+'"/></a></p>'
	 	 		}
	 	 		str+='</li>';
	 	 	}
	 	 	$cont.append($ul.html(str));
	 	 };

	 	 // create action
	 	 var createAction = function(){
	 	 	var $cont = $('#widget-main-content');
	 	 		id=idArr.join(',');
	 	 	$.getJSON(midApi+'&callback=?&id='+id,function(res){
	 	 		if(res){
	 	 			var mdata=res.data;
	 	 			for(var i=0,len=mdata.length;i<len;i++){

	 	 				for(var n in mdata[i]){
	 	 					var mid=mdata[i][n],
	 	 						$li=$('#wb-'+idArr[i]),	 	 						
	 	 						$action=$('<p class="action">'),
	 	 						time=prettyDate($li.attr('created_time')),
	 	 						url='http://www.weibo.com/'+user.id+'/'+mid,
	 	 						str='<a href="'+url+'" class="time">'+time+'</a><span class="action-more"><a href="'+url+'">转发</a><em>|</em><a href="'+url+'">评论</a></span>';	 	 					
	 	 					$li.append($action.html(str));	
	 	 				}
	
	 	 			}
	 	 		}
	 	 	});	
	 	 		
	 	 };

	 	 createHead();
	 	 createContent();
	 	 createAction();

	};

})();
		