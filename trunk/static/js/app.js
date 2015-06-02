
var config = {
    debug:false,
    closeGA:false
}

function loadimg(pics, progressCallBack, completeCallback) {
    $(".loading_page").find(".animated").removeClass("f-dn");
    var index = 0;
    var len = pics.length;
    var img = new Image();
    var load = function () {
        img.src = pics[index];
        img.onload = function () {
            // 控制台显示加载图片信息
            // console.log('第' + index + '个img被预加载', img.src);
            progressCallBack(Math.floor(((index + 1) / len) * 100));
            
            i = index;
            index++;
            
            if (index < len) {
                load();
            } else {
                completeCallback()
            }
        }
        return img;
    }
    if (len > 0) {
        load();
    } else {
        completeCallback();
    }
    return {
        pics:pics,
        load:load,
        progress:progressCallBack,
        complete:completeCallback
    };
}


var homePage =0,
    videoPage = 1,
    phonePage = 2,
    clockPage = 3;


var mySwiper;

$(function(){
    //  微信认证===============
    // var openid = $.cookie("openid");
    // if (!openid) 
    // {
    //   //正式测试, 授权
    //   if (config.debug) 
    //   {
    //     openid = "o3bdtt0LPrzuYcHtqwxDl1Xaafco";
    //   }else{
    //     weixinAuth();
    //   }
    // }
    // console.log(openid);

    // if (window.location.hostname != 'localhost') 
    // {
    //     wx_config(); 
    // }
    // 禁止文版被拖动
    document.body.style.userSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    //禁止图片被选中
    document.onselectstart = new Function('event.returnValue=false;');
    //禁止图片被拖动
    document.ondragstart = new Function('event.returnValue=false;');

    $(window).on('touchmove.scroll', function(e) {e.preventDefault();});
    $(window).on('scroll.scroll',function(e) {e.preventDefault();});
    $(document).bind('touchmove', function(e) {e.preventDefault();});


    $(".g-doc").height($(window).height());

    //字体自适应
    window.onresize=adaptive;
    adaptive();
    
    var pics = new Array();
    // var count = 0;
    $(document).find("div").each(function(e){
        
       if (this.src) 
      {
        pics.push(this.src+"?"+e);
      }
    })

    loadimg(pics,function(w){

    },function(){

        init();
    });

    
    


    

    $("#p0_03").click(function(){
        mySwiper.swipeTo(phonePage);
        gaTrack('pore2/slide1');
        gaTrack('pore/toplay');
    });

    $("#p0_04").click(function(){
        mySwiper.swipeTo(videoPage);
        gaTrack('pore2/slide4');
        gaTrack('pore2/tovideo');
    });

    $("#p1_btn1").click(function(){
        mySwiper.swipeTo(phonePage);
        gaTrack('pore2/slide1');
    });

    // $('#p1_video1').bind('touchstart',function(e){
    //   e.preventDefault();
    //   console.log("touch");
    //   gaTrack('pore2/video1');
    // });



    //提交手机号
     $("#p2_07").click(function(){
        mySwiper.swipeTo(clockPage);
        gaTrack('pore/slide2');
        gaTrack('pore2/submit');
        var minuteDeg = -24;
        var clockAnimate = setInterval(function(){
            minuteDeg += 6;
            $("#loading_minutes").css('transform','rotate('+minuteDeg+'deg)');
            if (minuteDeg >= 0) 
            {
                $("#loading_hours").css('transform','rotate(125deg)');
                // setTimeout(function(){
                //     init();
                // },1000);
                gaTrack('pore/slide3')
                clearInterval(clockAnimate);
            }
        },1000);
    });

 //滑动视频
    var videoIndex=0,
    maxIndex=3,
    minDistance = 30;

    var tsPoint = {
        x:0,
        y:0
    }

    var tePoint = {
        x:0,
        y:0
    }

    var swpieDistance = function(point1,point2){
        var distanceX = tePoint.x - tsPoint.x;
        var distanceY = tePoint.y - tsPoint.y;
        
    }


    var swipeEvent = function(e){
        // console.log(e)
        e.preventDefault();
        var type = e.type;
        var touch = e.touches[0];
        switch(type){
            case "touchstart":
                
                tsPoint.x = touch.pageX
                tsPoint.y = touch.pageY
                tePoint.x = touch.pageX
                tePoint.y = touch.pageY
                break;

            case "touchend":
                swipeDirection(tsPoint,tePoint);
                break;
            case "touchmove":
                tePoint.x=touch.pageX
                tePoint.y=touch.pageY
                break;

        }
        

    }


    var videoSwiper = document.getElementById("video_slide");
    videoSwiper.addEventListener("touchstart",swipeEvent);
    videoSwiper.addEventListener("touchmove",swipeEvent);
    videoSwiper.addEventListener("touchend",swipeEvent);

    

    var swipeDirection = function(tsPoint,tePoint){
        var distanceY = tsPoint.y - tePoint.y
        //wishIndex = wishIndex%maxIndex;
        console.log(videoIndex);
        if (distanceY > minDistance || distanceY < minDistance*(-1) ) {
            $(".video_slide0").removeClass("animated fadeOutUp");
            $(".video_slide0").removeClass("animated fadeInDown");
            $(".video_slide1").removeClass("animated fadeInUp");
            $(".video_slide1").removeClass("animated fadeOutUp");
            $(".video_slide1").removeClass("animated fadeOutDown");
            $(".video_slide1").removeClass("animated fadeInDown");
            $(".video_slide2").removeClass("animated fadeInUp");
            $(".video_slide2").removeClass("animated fadeOutDown");
        }
            

        if(distanceY > minDistance){
            console.log("往上滑");
            
            
            switch(videoIndex){
                case 0:    
                    $(".video_slide2").addClass("f-dn");
                    $(".video_slide0").addClass("animated fadeOutUp");
                    $(".video_slide1").removeClass("f-dn");
                    $(".video_slide1").addClass("animated fadeInUp");
                    $("#p1_06").removeClass("f-dn");
                    
                    videoIndex++;                               
                    break;

                case 1:
                    $(".video_slide0").addClass("f-dn");
                    $(".video_slide1").addClass("animated fadeOutUp");
                    $(".video_slide2").removeClass("f-dn");
                    $(".video_slide2").addClass("animated fadeInUp");
                    $("#p1_05").addClass("f-dn");
                    
                    videoIndex++;
                    
                    break;

                case 2:
                    $(".video_slide1").addClass("f-dn");
                    
                   
                    break;

                default:
                    videoIndex =0;
                    break;


            }

  
        }else if (distanceY < minDistance*(-1)){
            console.log("往下滑");            

            switch(videoIndex){
                case 0:
                    $(".video_slide1").addClass("f-dn");
                    $(".video_slide2").addClass("f-dn");
                    break;

                case 1:
                    $(".video_slide2").addClass("f-dn");
                    $(".video_slide1").addClass("animated fadeOutDown");  
                    $(".video_slide0").removeClass("f-dn");
                    $(".video_slide0").addClass("animated fadeInDown");
                    $("#p1_06").addClass("f-dn");


                    videoIndex--;
                    break;

                case 2:
                    $(".video_slide0").addClass("f-dn");
                    $(".video_slide2").addClass("animated fadeOutDown");  
                    $(".video_slide1").removeClass("f-dn");
                    $(".video_slide1").addClass("animated fadeInDown");
                    $("#p1_05").removeClass("f-dn");
                    videoIndex--;
                    break;

                 default:
                    
                    videoIndex = 0;
                    
                    break;

            }

           
        }
        
    }

});

//loading结束后各项初始化
function init(){

    $('.g-ct').removeClass("f-dn");
    $(".g-ct").height($(window).height());
    mySwiper = $('#main-swiper').swiper({
        speed:0,
        mode:'vertical',
        noSwiping: true,
        followFinger: false,
        loop: false,
        onInit: function(a) {
            $(a.activeSlide()).find(".animated").removeClass("f-ann");
        },
        onSlideChangeStart: function(a) {
            $(a.getSlide(a.previousIndex)).find(".animated").addClass("f-ann"); 
            $(a.activeSlide()).find(".animated").removeClass("f-ann");
            $(a.getSlide(a.previousIndex)).find(".animatedLong").addClass("f-ann"); 
            $(a.activeSlide()).find(".animatedLong").removeClass("f-ann");
        },
        onSlideChangeEnd: function(a){
           
         
        }
    });
    mySwiper.swipeTo(homePage);
    startCd();
}



function checkPhone(phone){
  var phoneRex =  /^(13[0-9]{9})|(14[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9})$/;
  if (phone=="" || phoneRex.test(phone)==false || phone.length>11) 
  {
    return false;
  }
    return true;
}


//微信授权
function weixinAuth(){
  $.ajax({
    url: '/Auth?redirect='+location.href,
    type: 'GET', 
    dataType: 'json',
    success:function(responseObj){
      // console.log(responseObj);
      if (responseObj.success) 
      {
          window.location.href =  responseObj.url; 
      };
      
    }
  });
}
//微信接口配置
//====================================
function wx_config(){
    $.ajax({
      url:'/JSTicket',
      type:'get',
      dataType:'json',
      success:function(responseObj){
          // console.log(responseObj);
          if (responseObj.success)
          {
            var timestamp = responseObj.data.timestamp,
                nonceStr = responseObj.data.nonceStr,
                appId = responseObj.data.appId,
                signature = responseObj.data.signature;

            wx.config({
                debug: false,
                appId:appId,
                timestamp:timestamp,
                nonceStr: nonceStr,
                signature:signature,
                jsApiList: [
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage'
                ]
              });
            wx.ready(function(){
              wx_share();
              // menuItem:share:appMessage
              // menuItem:share:timeline
            });
          }
          else{
            // alert("网络错误, 请刷新页面");
          }
      },
      error:function(errorObj){
          // alert("网络错误, 请刷新页面");
      }
    });
}

function wx_share(mobile){
    var shareImg = window.location.protocol 
                + "//" + window.location.hostname
                + window.location.pathname+"/img/icon.png";
//分享给朋友
  var shareUrl =  window.location.href;
  var shareTitle  = '解密反孔手提箱';
  var shareText = '被叫了20多年的美女，居然遇到“脸无能”你敢来试么？';
  wx.onMenuShareAppMessage({
        title: shareTitle, // 分享标题
        desc: shareText, // 分享描述
        link: shareUrl, // 分享链接
        imgUrl:shareImg , // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            if (mobile) 
            {
                checkPrize(mobile);
            }
            wx_share();
            gaTrack('porel/share_friends');
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
    //分享给朋友圈
    wx.onMenuShareTimeline({
        title: shareText, // 分享标题
        link: shareUrl, // 分享链接
        imgUrl:shareImg, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            if (mobile) 
            {
                checkPrize(mobile);
            }
            wx_share();
            gaTrack('porel/share_moments');
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
}

function adaptive(){
  var w = $(window).width();
  $("body").css("font-size", 62.5 * w  / 320+"%");
}

var spinner;
function showProgress(target){
    var opts = {
        lines: 9, // The number of lines to draw
        length: 13, // The length of each line
        width: 8, // The line thickness
        radius: 11, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#00bfbb', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        // top: '50%', // Top position relative to parent
        // left: '50%' // Left position relative to parent
      };
    spinner = new Spinner(opts).spin(target);
}

function stopProgress(){
  if (spinner) 
  {
    spinner.stop();
  }   
}

//倒计时
var timerRunning;

    function showTime(){
      var today = new Date();
      var hour = today.getHours();
      var minute = today.getMinutes();
      var second = today.getSeconds();
      var cdHour, cdMin, cdSec;

      if (hour >=16) 
      {
          cdHour = zeroFilled(39 - hour);
      }else{
          cdHour = zeroFilled(15 - hour);
      }


      cdMin = zeroFilled(59 - minute);
      cdSec = zeroFilled(59 - second);

      $("#time-h").find("span").html(cdHour);
      $("#time-m").find("span").html(cdMin);
      $("#time-s").find("span").html(cdSec);

      timeId = setTimeout(function(){
          showTime();
      },1000);
      if (hour==16&&minute==0&&second==0){
          return 0; 
      }
      timerRunning = true;
    }

    function stopCd(){
      if(timerRunning){
        clearTimeout(timeId);
        timerRunning = false;
      }
    }

    function startCd(){
      stopCd();
      showTime();
    }


function zeroFilled(str,num){
  // console.log(str.toString().length);
  var str = str.toString();
  var number = num || 2;

  return str.length < number ? zeroFilled("0"+str,num) : str;
}


function gaTrack(event)
{
    ga('send','event','pore2',event,'click');
}