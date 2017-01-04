define(function(require,exports,module){
	var $ = require('jq');
	var ajax = require('ajaxGet.js');
	var publicJS = require('public.js');
	//轮播图
	require('lunbo.js');
	$(function(){
		//#ipad 网页最顶部特效 点击叉号让推广条消失
		$('.ipadMark').click(function() {
			$('#ipad').css('display', 'none');
		});
		//头部加载
		/*$('#header .comWidth').load('demo/header.html',function(res){});*/
		//头部 
		publicJS.header('data/json/goodsList.json');
		//登录
		if ($.cookie('user')) {
			var str = '<a href="demo/login.html">欢迎,'+$.cookie('user')+'</a><a class="exit">[退出]</a>';
			$('.loginDiv').html(str);
		}
		$('.loginDiv').find('.exit').on('click', function() {
			$.cookie('user',null,{path:'/'});
			$.cookie('pwd',null,{path:'/'});
			$('.loginDiv').html('<a href="demo/login.html">登陆/注册</a>');
		});
		//二级导航
		publicJS.subNav();
		//吸顶 goBack
		$(document).scroll(function(){
			xd.init();
		})
		//home_shortcut动画
		var $shortA = $('#jhfloor').children();
		$shortA.hover(function() {
			$shortA.eq($(this).index()).stop().animate({marginLeft: -20,marginRight:80},5);
			if($(this).index()==$shortA.length-1){
				$shortA.eq($(this).index()).stop().animate({marginLeft: -20},5);
			}
		}, function() {
			$shortA.eq($(this).index()).stop().animate({marginLeft: 0,marginRight:60},5);
			if($(this).index()==$shortA.length-1){
				$shortA.eq($(this).index()).stop().animate({marginLeft: 0},5);
			}
		});
		//主题内容
		new recommend();
		/*new setImg('#home_recommend');*/
		new hotTopic();
		/*new setImg('#home_hotTopic');*/
		new find();
	})
	//吸顶 goBackJHQ goBack
	var xd = {
		init:function(){
			var that = this;
			that.navBox = $('#navBox');
			that.zxTop = $('#zx_top');
			that.fix_rNav = $('#right_nav');
			var $scrolltop = $(document).scrollTop();
			if($scrolltop >= 200){
				that.navBox.addClass('fixNav');
				that.zxTop.css('display', 'block');
				that.fix_rNav.css('display', 'block')
			}else{
				that.navBox.removeClass('fixNav');
				that.zxTop.css('display', 'none');
				that.fix_rNav.css('display', 'none')
			}
			that.goBackTop();
			that.goBackJHQ();
		},
		goBackJHQ:function(){
			$('#right_nav .backJHQ').on('click',function() {
				$('body,html').stop().animate({scrollTop:$('#home_recommend').offset().top-100},1000);
			});
		},
		goBackTop:function(){
			$('#right_nav .backTop').on('click',function() {
				$('body,html').stop().animate({scrollTop:0},500);
			});
		}
	}
	//
	/*function setImg(id){
		$(id).on('click', 'li', function(event) {
			$.cookie('imgName',$(this).attr('class'),{path:'/'});
		});
	}*/
	//主题内容之尖货推荐ajax获取
	function recommend(){
		var that = this;
		this.$class = $('#home_recommend');
		ajax.$GetData('data/json/goodsMain.json','json',that.innerHTML,that);
	}
	recommend.prototype.innerHTML = function (res,that){
		var str = '';
		var strA = '';
		var strB = '';
		var strC = '';
		var strD = '';
		var strE = '';
		for (var i = 0; i < res.length; i++) {
			if (res[i].classID === "recommend") {
				switch(res[i].className){
					case "title":
						str+='<h3><img src="'+res[i].src+'"></h3>';
						break;
					case "a":
						strA+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img src="'+res[i].src+'"</a></li>';
						break;
					case "b":
						strB+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img src="'+res[i].src+'"</a></li>';
						break;
					case "c":
						strC+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img src="'+res[i].src+'"</a></li>';
						break;
					case "d":
						strD+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img src="'+res[i].src+'"</a></li>';
						break;
					case "e":
						strE+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img src="'+res[i].src+'"</a></li>';
						break;
				}
			}
		}
		str += '<ul>'+strA+'</ul>';
		str += '<ul>'+strB+'</ul>';
		str += '<ul>'+strC+'</ul>';
		str += '<ul>'+strD+'</ul>';
		str += '<ul>'+strE+'</ul>';
		that.$class.html(str);
	}
	//主题内容之推荐专题ajax获取
	function hotTopic(){
		var that = this;
		this.$class = $('#home_hotTopic');
		ajax.$GetData('data/json/goodsMain.json','json',this.innerHTML,that);
	}
	hotTopic.prototype.innerHTML = function(res,that){
		var str = '';
		var strCon = '';
		var strM = '';
		for (var i = 0; i < res.length; i++) {
			if (res[i].classID === "hotTopic") {
				switch(res[i].className){
					case "topic_t":
						str+='<h3><img src="'+res[i].src+'"></h3>';
						break;
					case "beats":
					strCon+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img class="pic" src="'+res[i].src+'"><p><img src="'+res[i].srcPosition+'"></p></a></li>';
						break;
					case "topic_m":
					strM+='<h3><a href="#"><img src="'+res[i].src+'"></a></h3>';
				}
			}
		}
		str += '<ul>'+strCon+'</ul>';
		str += strM;
		that.$class.html(str);
	}
	//主题内容之发现好货ajax获取
	function find(){
		var that = this;
		this.$class = $('#home_find');
		ajax.$GetData('data/json/goodsMain.json','json',this.innerHTML,that);
	}
	find.prototype.innerHTML = function(res,that){
		var str = '';
		var strCon = '';
		var strM = '';
		for (var i = 0; i < res.length; i++) {
			if (res[i].classID === "find") {
				switch(res[i].className){
					case "found_t":
						str+='<h3><img src="'+res[i].src+'"></h3>';
						break;
					case "con":
						strCon+='<li class="'+res[i].imgName+'"><a href="demo/goodList.html"><img src="'+res[i].src+'"><span></span></a></li>';
						break;
					case "fonud_m":
						strM+='<h3><a href="#"><img src="'+res[i].src+'"></a></h3>';
						break;
				}
			}
		}
		str+='<ul>'+strCon+'</ul>';
		str+=strM;
		that.$class.html(str);
		that.animate();
	}
	find.prototype.animate = function(){
		var that = this;
		that.$aLi = that.$class.find('li');
		that.$aSpan = that.$class.find('span');
		that.$aLi.hover(function() {
			that.$aSpan.eq($(this).index()).stop(true,true).animate({top: 0},500);
		}, function() {
			that.$aSpan.eq($(this).index()).stop(true,true).animate({left: 287},500)
			.animate({top:490},1).animate({left:0},1);
		});
	}
})
