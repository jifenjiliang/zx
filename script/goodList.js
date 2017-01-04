define(function(require,exports,module){
	var $ = require('jq');
	var ajax = require('ajaxGet.js');
	var publicJS = require('public.js');
	$(function(){
		//头部加载
		$('#header .comWidth').load('public.html .headerWrap',function(){
			publicJS.header('../data/json/goodsList.json');
			publicJS.login();
		});
		//导航加载
		$('#navBox .comWidth').load('public.html .nav',function(){publicJS.subNav();});
		//尾部加载
		$('#footer').load('public.html .footerWrap',function(){});
		/*//banner 动态获取
		ajax.$GetData('../data/json/active.json','json',getImg);
		ajax.$GetData('../data/json/goodsMain.json','json',getImg);
		function getImg(res){
			for (var i = 0; i < res.length; i++) {
				if(res[i].imgName == $.cookie('imgName')){
					$('.banner img').attr('src',res[i].src);
				}
			}
		}*/
		//吸顶
		var blockTop = $('.black_nav_box').offset().top;
		$(document).scroll(function() {
			if ($(document).scrollTop() >= blockTop){
				$('.black_nav').addClass('fix-top');
			}else{
				$('.black_nav').removeClass('fix-top');
			}
			Floor.scroll();
		});
		//楼梯特效
		Floor.init();
		//侧边特效
		publicJS.backTop();
		//绑定点击事件  将点中的图片存到cookie中
		$('.goodFloor').on('click', 'li.big_pic', function(event) {
			$.cookie('goodsID',$(this).attr('itemid'),{path:'/'});
			$.cookie('price',parseInt($(this).find('.showPrice').html()),{path:'/'});
		});
		//主题内容区
		new getMainCont('#gs01');
		new getMainCont('#gs02');
		new getMainCont('#gs03');
		new getMainCont('#gs04');
		new getMainCont('#gs05');
		new getMainCont('#gs06');
		new getMainCont('#gs07');
		new getMainCont('#gs08');
		new getMainCont('#gs09');
	})
	//楼梯
	var Floor = {
		init:function(){
			var that = this;
			that.$aLi = $('.black_nav ul').children();
			that.$aDiv = $('.goodFloor').children();
			that.$aLi.on('click', function() {
				$('.black_nav').addClass('fix-top');
				var index = $(this).index();
				that.$aLi.removeClass('on').eq(index).addClass('on');
				$('body,html').stop().animate({scrollTop:that.$aDiv.eq(index).offset().top-40},10);
			});
		},
		scroll:function(){
			var that = this;
			for (var i = 0; i < that.$aDiv.length; i++) {
				if ($(document).scrollTop() >= that.$aDiv.eq(i).offset().top-40) {
					that.$aLi.removeClass('on').eq(i).addClass('on');
				}
			}
		}
	}
	//ajax获取主题区内容
	function getMainCont(id){
		var that = this;
		that.$class = $(id);
		that.id = id.replace('#','');
		ajax.$GetData('../data/json/goodsList.json','json',that.jsCont,that);
	}
	//接收res
	getMainCont.prototype.jsCont = function(res,that){
		var str = '';
		var num = 0;
		for (var i = 0; i < res.length; i++) {
			if (res[i].classID === that.id) {
				if (++num%3 == 0) {
					str +='<li class="big_pic right_big_pic" itemid="'+res[i].goodsID+'"><ol><li class="zt_tus"><a href="gsxq.html"><img src="'+res[i].src+'"></a></li><li class="tit">Burberry</li><li class="tit"><a>'+res[i].goodsName+'</a></li><li class="price">&yen;<span class="showPrice">'+res[i].price+'</span></li></ol></li>';
				}else{
					str +='<li class="big_pic" itemid="'+res[i].goodsID+'"><ol><li class="zt_tus"><a href="gsxq.html"><img src="'+res[i].src+'"></a></li><li class="tit">Burberry</li><li class="tit"><a>'+res[i].goodsName+'</a></li><li class="price">&yen;<span class="showPrice">'+res[i].price+'</span></li></ol></li>';
				}	
			}
		}
		that.$class.find('.ztul').html(str);
	}
})