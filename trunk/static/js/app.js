
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


    

});

//loading结束后各项初始化
function init(){

    $('.g-ct').removeClass("f-dn");
    $(".g-ct").height($(window).height());
    mySwiper = $('#main-swiper').swiper({
        speed:500,
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
