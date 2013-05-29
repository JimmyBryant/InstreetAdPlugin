/*
  底部弹窗 v0.0.3
  
  mf 关闭按钮position可配置
*/ 
(function (window) {

      // 全局配置
      var config = {
        adType:'mediav',  //广告类型,默认adsense,可选mediav,afv
        close_position:'tr',  //关闭按钮位置
        doubleFrame:['www.qianjiao.cn'], //使用两层iframe的域名
        version:'v.0.0.3'
      };

      //网站个性配置，优先级大于全局配置
      var siteConfig = [{
        host:'*.china.com.cn',
        close_position:'br',
        adType:'afv',
        pubId:'ca-video-pub-0869844596169425',
        slot:5561485351
      },{
        host:'*.dzwww.com',
        adType:'afv',
        close_position:'br',
        pubId:'ca-video-pub-0869844596169425',
        slot:8687697753
      }];

      var doc=window.document
      ,location=window.location
      ,host=location.host
      ,$container
      ,$close
      ,$box
      ,$cont
      ,$title
      ,width=300
      ,height=250
      ,timer=45000
      ,timerId=null;
     
      var getParams = function(){

        var script=doc.getElementById('instreet_script_popup')
            ,src=script.src
            ,search=src.substring(src.indexOf('?'))
            ,reg=/([^&=\?]+)=?([^&]*)/g
            ,res
            ,vars="";

        while(res=reg.exec(search)){
          if(vars){
            vars+="&";
          }
          vars+=res[1]+"="+res[2];
        }
        return vars;

      };

      var createPupup = function(src){
          $container=doc.createElement('div');
          //创建box
          $box=doc.createElement('div');
          var cssStr='display:none;position: fixed;width:'+width+'px;height:'+height+'px;border: 1px solid #000;right: 0;bottom: 0;_position:absolute; _background-image:url(about:blank); _background-attachment:fixed; _top:expression(eval((document.documentElement.scrollTop||document.body.scrollTop)+(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight)); z-index:2199999;';
          $box.style.cssText=cssStr;
          //cont_body
          $cont=doc.createElement('div');
          $cont.style.cssText='position:relative;background: url(http://static.instreet.cn/widgets/push/images/loading_sprint.gif) no-repeat center center #FFF;overflow: hidden;';
          $cont.innerHTML='<iframe src="'+src+'" scrolling="no" height="'+height+'" width="'+width+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
         
          // 关闭按钮
          $close=doc.createElement('a');
          var close_style='background-color:#ddd;border-radius:50%;position:absolute;width:14px;height:14px;font-size:12px;line-height:16px;z-index:999;color:#999;cursor:pointer;text-decoration:none;text-align:center;';
          switch(config.close_position){
            case 'tl':
              close_style+='top:3px;bottom:auto;right:auto;left:3px;';break;
            case 'tc':
              close_style+='top:3px;bottom:auto;left:50%;right:auto;';break;
            case 'tr':
              close_style+='top:3px;bottom:auto;left:auto;right:3px;';break;
            case 'bl':
              close_style+='top:auto;bottom:3px;left:3px;right:auto;';break;
            case 'bc':
              close_style+='top:auto;bottom:3px;left:50%;right:auto;';break;
            case 'br':
              close_style+='top:auto;bottom:3px;left:auto;right:3px;';break;
            default:
              close_style+='top:3px;bottom:auto;left:auto;right:3px;';break;
          }
          $close.style.cssText=close_style;
          $close.innerHTML="<span>×</span>";

          var body=doc.getElementsByTagName('body')[0];

          body.firstChild&&body.insertBefore($container,body.firstChild);
          $container.appendChild($box);
          $box.appendChild($close);
          $box.appendChild($cont);       

          slideHeight($box,height);
          // 绑定事件
          $close.onclick=function(){            
            clearInterval(timerId);
            slideHeight($box,0);
          };  
      };
      // slide方法
      function slideHeight(elem,dest){

          var start = new Date().getTime()
              ,ori = parseFloat(elem.style.height)
              ,speed=400
              ,diff=dest-ori
              ,oriCss=elem.style.cssText; 
          elem.style.display="block";     
          elem.style.overflow="hidden"; 
          if(dest!==0){
            elem.style.height=0;
          }   
          var slide = function(){

            var now=new Date().getTime()
                ,p=(now-start)/speed;

            if(p<1){

              elem.style.height  = (ori+((-Math.cos(p*Math.PI)/2) + 0.5) * diff)+'px';  

            }else{

              clearInterval(timerId);
              elem.style.cssText=oriCss;
              elem.style.height=dest+'px';

              if(dest==0){
                elem.style.display="none";
              }else{
                elem.style.display="block";  
              }
            }

          };

          timerId = setInterval(function(){slide();},13);
      };

      // 为数组添加some方法
      if (!Array.prototype.some){
      
        Array.prototype.some = function(fun,thisp)
        {
          "use strict";
       
          if (this == null)
            throw new TypeError();
       
          var t = Object(this);
          var len = t.length >>> 0;
          if (typeof fun != "function")
            throw new TypeError();
       
          var thisp = arguments[1];
          for (var i = 0; i < len; i++)
          {
            if (i in t && fun.call(thisp, t[i], i, t))
              return true;
          }
       
          return false;
        };

      }

      // analyse host 确定网站的配置
      var analyseHost = function(){
          for(var i=0,len=siteConfig.length;i<len;i++){
             var c=siteConfig[i];
             var reg=new RegExp(c.host.replace('*','[a-z]+')+'$','i');
             if(reg.test(host)){
                config.close_position=c.close_position||config.close_position;
                config.adType=c.adType||config.adType;
                config.pubId=c.pubId||'';
                config.slot=c.slot||'';              
                break;
             }
          }
      };

      //返回广告地址
      var getAdUrl = function(){
          var src="",par=getParams();
          switch(config.adType){
            case "mediav" : 
              src='http://s2.instreet.cn/corner/boilerplate/popup_mediav.html?from='+host;break;              
            case "afv"    : 
              src='http://s2.instreet.cn/corner/IMA2_popup.php?cad='+config.pubId+'&slot='+config.slot+'&w='+width+'&h='+height;break;
            default :                         
              if(config.doubleFrame.some(function(item){if(item==host)return true;})){ //两层iframe

                src='http://s2.instreet.cn/corner/igp.html?'+par+'&w='+width+'&h='+height;

              }else{

                src='http://s2.instreet.cn/corner/google.html?'+par+'&w='+width+'&h='+height;

              }
          }
          return src;
      };

      var begin = function(){
        var src;
        analyseHost();
        src=getAdUrl();  //获取广告地址
        createPupup(src);
      };


      begin();
      
      
})(window);
