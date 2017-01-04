define(function(require,exports,module){
	var $ = require('jq');
	var ajax = require('ajaxGet.js');
	var cookie = require('cookie');
	cookie($);
	var publicJS = {
		header:function(url){
			//头顶购物车商品数目
			publicJS.shopNum("#num");
			/*//商品总数
			publicJS.shopNum('#sum');*/
			//侧边购物车数目
			publicJS.shopNum('#shopNum');
			//购物车
			if ($.cookie('goods')) {
				publicJS.addGoods(url);
			}else{
				$('#my_bag').html('<div style="padding-top:0px;padding-left: 8px;padding-bottom: 8px;"><span>购物袋暂时没有商品!</span></div>');
			}
			$('#bag').hover(function() {
				$('#bag').addClass('relax');
				$('.my_bagShop').addClass('hover');
				$('#my_bag').css('display', 'block');	
			}, function() {
				$('#bag').removeClass('relax');
				$('#my_bag').css('display', 'none');
				$('.my_bagShop').removeClass('hover');
			});
			//我的走秀
			$('#mine').hover(function() {
				$('#mine').addClass('relax');
				$('#my_xiu').css('display', 'block');
				$('.my_xiuA').addClass('hover');
			}, function() {
				$('#mine').removeClass('relax');
				$('#my_xiu').css('display', 'none');
				$('.my_xiuA').removeClass('hover');
			});
			//搜索框
			$('.search_box').click(function() {
				$('#search-welcome').css('display', 'none');
				$('#tx').focus();
			});
			//关键字检索
			$('#tx').on('keyup', function() {
				$('.searchCont').show();
				$.getJSON('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd='+$(this).val()+'&cb=?', function(jsonData) {
					console.log(jsonData);
					var str = '';
					for( var i=0;i<jsonData.s.length;i++){
						str += '<li><a href="https://www.baidu.com/s?wd='+jsonData.s[i]+'" target="_blank">'+jsonData.s[i]+'</a></li>';	
					};
					str = '<ul style="max-height: 850px; overflow: auto;">'+str+'</ul>';
					$('.searchCont').html(str);
				});
			});
			$('.searchCont').on('click',function() {
				$(this).stop().slideUp();
			});
			//失焦事件
			$('#tx').blur(function() {
				if (!$(this).val()) {
					$('#search-welcome').css('display', 'block');
				}
			});
		},
		subNav:function(){
			//nav subNav
			$('#navBox .nav').children().hover(function() {
				$(this).addClass('select').find('.subNav').show();
			}, function() {
				$(this).removeClass('select').find('.subNav').hide();
			});
		},
		backTop:function(){
			//关闭按钮
			$('#backTop .closed').on('click', function(event) {
				$('#backTop').hide();
			});
			//返回顶部
			$('#backTop .backTop').on('click',function(event) {
				$('body,html').stop().animate({scrollTop:0},1000);
			});
		},
		login:function(){
			//登录
			if ($.cookie('user')) {
				var str = '<a href="login.html">欢迎，'+$.cookie('user')+'</a><a class="exit">[退出]</a>';
				$('.loginDiv').html(str);
			}
			$('.loginDiv').find('.exit').on('click', function() {
				$.cookie('user',null,{path:'/'});
				$.cookie('password',null,{path:'/'});
				$('.loginDiv').html('<a href="login.html">登陆/注册</a>');
				window.location.reload(true);
			});
		},
		//购物车数目; 
		shopNum:function(id){
			var sn_str = $.cookie('goods');
			if(sn_str){//如果购物车cookie不为空。
				var sn_obj = eval(sn_str);
				var sn_num = 0 ; 
				for(var i in sn_obj){
					sn_num += Number(sn_obj[i].num);
				}
				$(id).html(sn_num);
			}else{
				$(id).html(0);
			}
		},
		//总价钱
		zjq:function(id){
			var sn_str = $.cookie('goods');
			console.log(sn_str);
			if(sn_str){//如果购物车cookie不为空。
				var sn_obj = eval(sn_str);
				var sn_num = 0 ; 
				for(var i in sn_obj){
					sn_num += Number(sn_obj[i].num*sn_obj[i].price);
				}
				$(id).html('金额总计：<b>￥'+sn_num+'.00</b>');
			}else{
				$(id).html(0);
			}
		},
		//向购物车里添加东西
		addGoods:function (url){
			ajax.$GetData(url,'json',show);
			function show(res){
				var ag_str = $.cookie('goods');
				if(ag_str){
					var ag_obj = eval(ag_str);
					var ag_num = 0 ;
					var hj = 0;
					var html = ''; 
					for (var i = 0; i < res.length; i++) {
						for(var j in ag_obj){
							if (res[i].goodsID == ag_obj[j].id) {
								html += '<tr id="'+res[i].goodsID+'"><td><a><img width="48" height="48" src="'+res[i].src+'"></a></td><td><p><a title="'+res[i].goodsName+' 颜色:驼色 尺码:UK6 ">Aquascutum<br>'+res[i].goodsName+' 颜色:驼色 尺码:UK6 </a></p><span>￥'+res[i].price+' x '+ag_obj[j].num+'</span></td><td valign="top"><a class="delex" href="#">删除</a></td></tr>';
								ag_num += ag_obj[j].num;
								hj += ag_obj[j].num*res[i].price;
							}
						}
					}
					html = '<div id="mybagw" class=""><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody>'+html+'</tbody></table></div>';
					html += '<div class="total"><span>购物袋中共有<b id="sum">'+ag_num+'</b>件商品</span><span id="zj">金额总计：<b>￥'+hj+'.00</b></span><a href="#">查看购物袋</a></div>';
					$('#my_bag').html(html);
				}
				//删除按钮事件
				publicJS.del();
			}
		},
		//改变商品
		/*changeGoods:function(res){
			var ag_str = $.cookie('goods');
			if(ag_str){
				var ag_obj = eval(ag_str);
				var ag_num = 0 ;
				var hj = 0;
				var html = ''; 
				for (var i = 0; i < res.length; i++) {
					for(var j in ag_obj){
						if (res[i].goodsID == ag_obj[j].id) {
							html += '<tr id="'+res[i].goodsID+'"><td><a><img width="48" height="48" src="'+res[i].src+'"></a></td><td><p><a title="'+res[i].goodsName+' 颜色:驼色 尺码:UK6 ">Aquascutum<br>'+res[i].goodsName+' 颜色:驼色 尺码:UK6 </a></p><span>￥'+res[i].price+' x '+ag_obj[j].num+'</span></td><td valign="top"><a class="delex" href="#">删除</a></td></tr>';
							ag_num += ag_obj[j].num;
							hj += ag_obj[j].num*res[i].price;
						}
					}
				}
				html = '<div id="mybagw" class=""><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody>'+html+'</tbody></table></div>';
				html += '<div class="total"><span>购物袋中共有<b id="sum">'+ag_num+'</b>件商品</span><span>金额总计：<b>￥'+hj+'.00</b></span><a href="#">查看购物袋</a></div>';
				$('#my_bag').html(html);
			}
		},*/
		//删除按钮事件
		del:function(){
			$('#mybagw .delex').on('click', function() {
				var id = $(this).parent().parent().attr('id');
				console.log(id);
				$(this).parent().parent().remove();
				var goods_arr = eval($.cookie('goods'));
				//删除一条数据 1为一条
				for(var i in goods_arr){
					if (goods_arr[i].id == id) {
						goods_arr.splice(i,1);
						var newCookie = JSON.stringify(goods_arr);
						if (goods_arr.length==0) {
							$.cookie('goods',null,{path:'/'});
							$('#my_bag').html('<div style="padding-top:0px;padding-left: 8px;padding-bottom: 8px;"><span>购物袋暂时没有商品!</span></div>');
						}else{
							$.cookie('goods',newCookie,{path:'/'});
						}
					}
				}
				publicJS.zjq("#zj");
				//头顶购物车商品数目
				publicJS.shopNum("#num");
				//商品总数
				publicJS.shopNum('#sum');
				//侧边购物车数目
				publicJS.shopNum("#shopNum");
				/*window.location.reload(true);*/
			});
		}
	}
	module.exports = publicJS;
	
})