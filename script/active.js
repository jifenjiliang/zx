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
		//xiuApp
		$(document).scroll(function(event) {
			if($(document).scrollTop() > 500){
				$('#menu').removeClass('xiuApp_hide').addClass('xiuApp_show');
			}else{
				$('#menu').removeClass('xiuApp_show').addClass('xiuApp_hide');
			}
		});
		//绑定点击事件  将点中的图片存到cookie中
		$('#1F').on('click', 'li', function(event) {
			$.cookie('imgName',$(this).attr('class'),{path:'/'});
		});
		//内容区加载
		ajax.$GetData('../data/json/active.json','json',deal);
		function deal(res){
			var str1 = '',str2 = '',str3 = '',str4 = '',str5 = '';
			var strLi1 = '',strLi2 = '',strLi3 = '',strLi4 = '',strLi5 = '';
			for (var i = 0; i < res.length; i++) {
				switch(res[i].classID){
					case "英国专场":
						if (res[i].className === "point_t1") {
							str1 +='<h3><img src="'+res[i].src+'"></h3>';
						}else{
							strLi1 += '<li class="'+res[i].className+'"><a href="goodList.html"><img src="'+res[i].src+'"</a></li>';
						}
						break;
					case "意大利专场":
						if (res[i].className === "point_t2") {
							str2 +='<h3><img src="'+res[i].src+'"></h3>';
						}else{
							strLi2 += '<li class="'+res[i].className+'"><a href="goodList.html"><img src="'+res[i].src+'"</a></li>';
						}
						break;
					case "法国专场":
						if (res[i].className === "point_t3") {
							str3 +='<h3><img src="'+res[i].src+'"></h3>';
						}else{
							strLi3 += '<li class="'+res[i].className+'"><a href="goodList.html"><img src="'+res[i].src+'"</a></li>';
						}
						break;
					case "美国专场":
						if (res[i].className === "point_t4") {
							str4 +='<h3><img src="'+res[i].src+'"></h3>';
						}else{
							strLi4 += '<li class="'+res[i].className+'"><a href="goodList.html"><img src="'+res[i].src+'"</a></li>';
						}
						break;
					case "主题场专场":
						if (res[i].className === "point_t5") {
							str5 +='<h3><img src="'+res[i].src+'"></h3>';
						}else{
							strLi5 += '<li class="'+res[i].className+'"><a href="goodList.html"><img src="'+res[i].src+'"</a></li>';
						}
						break;
				}
			}
			str1 += '<ul>'+strLi1+'</ul>';
			str2 += '<ul>'+strLi2+'</ul>';
			str3 += '<ul>'+strLi3+'</ul>';
			str4 += '<ul>'+strLi4+'</ul>';
			str5 += '<ul>'+strLi5+'</ul>';
			$('#1F .EG').html(str1);
			$('#1F .Italy').html(str2);
			$('#1F .France').html(str3);
			$('#1F .US').html(str4);
			$('#1F .Theme').html(str5);
		}
	});
});