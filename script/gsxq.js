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
		//侧边条
		publicJS.backTop();
		//放大镜
		new fdj();

		//选中的尺码大小
		$('#sizesArea .noLimit').find('li').on('click', function(event) {
			$(this).addClass('selected').siblings().removeClass('selected');
			console.log($(this).find('a').attr('id'));
		}); 
		//商品数目
		//减号
		$('#minusAmount').on('click', function() {
			var num = $('#inputQuantity').val();
			$('#minusAmount').removeClass('dis');
			if (num <= 2) {
				$('#minusAmount').addClass('dis');
				$('#inputQuantity').val(1);
			}else{
				num--;
				$('#inputQuantity').val(num);
			}
		});
		//加号
		$('#plusAmount').on('click', function() {
			var num = $('#inputQuantity').val();
			num++;
			$('#inputQuantity').val(num);
			if ($('#inputQuantity').val()<=1) {
				$('#minusAmount').addClass('dis');
			}else{
				$('#minusAmount').removeClass('dis');
			}
		});
		//加入购物车
		$('#user_buy_btn').on('click', function() {
			addShopCar();
		});
		$('#float_buy_add').on('click', function() {
			addShopCar();
		});

	});
	//放大镜
	function fdj(){
		var that = this;
		ajax.$GetData('../data/json/gsxq.json','json',that.deal,that);
	}
	//处理函数
	fdj.prototype.deal = function(res,that){
		that.sm = $('#smallImg');
		that.yt = $('#yuantu');
		that.big = $('#bigImg');
		var str = '';
		var str2 = '';
		//获取id
		var goodsID = getID();
		var aSmallImg = eval(res[goodsID].smallImg);
		var aYT = eval(res[goodsID].yuantu) 
		var aBigImg = eval(res[goodsID].bigImg);
		for (var i = 0; i < aSmallImg.length; i++) {
			str+='<dd><a href="javascript:;"><img src="'+aSmallImg[i]+'"></a></dd>'	
		}
		that.sm.html(str);
		//shipai
		var aShiPai = eval(res[goodsID].shipai);
		for (var i = 0; i < aShiPai.length; i++) {
			str2 += '<img src="'+aShiPai[i]+'">' 
		}
		$('#SP').html(str2);
		//初始化数据
		that.sm.find('dd').eq(0).addClass('dc');
		that.yt.find('img').attr('src', aYT[0]);
		that.big.find('img').attr('src', aBigImg[0]);
		//移动小图 来更换轮播图
		that.sm.on('mouseenter','dd',function(event) {
			var index = $(this).index();
			$(this).addClass('dc').siblings().removeClass('dc');
			that.yt.find('img').attr('src', aYT[index]);
			that.big.find('img').attr('src', aBigImg[index]);
		});
		that.init();
	}
	//放大功能
	fdj.prototype.init = function(){
		var that = this;
		that.moveBox = that.yt.find('.position_box');
		that.yt.on('mouseover', function(event) {
			/*event.preventDefault();*/
			that.moveBox.show();
			that.big.show();
		});
		that.yt.on('mouseout', function() {
			that.moveBox.hide();
			that.big.hide();
		});
		that.yt.on('mousemove', function(event) {
			/*event.preventDefault();*/
			var event = event || window.event;
			//获取宽高信息
			var sWidth = that.moveBox.outerWidth();
			var sHeight = that.moveBox.outerHeight();
			var oWidth = $(this).outerWidth();
			var oHeight = $(this).outerHeight();
			//确定偏移距离
			var sLeft = event.pageX -$(this).offset().left - sWidth/2;
			var sTop = event.pageY - $(this).offset().top - sHeight/2;
			//边界检测
			sLeft = sLeft < 0 ? 0 : sLeft;
			sLeft = sLeft > oWidth - sWidth ? oWidth - sWidth : sLeft;
			sTop = sTop <0 ? 0 : sTop;
			sTop = sTop > oHeight - sHeight ? oHeight - sHeight : sTop;
			that.moveBox.css('left', sLeft);
			that.moveBox.css('top', sTop);
			//移动大图 实现放大效果
			var aW = that.yt.find('img').width();
			var aH = that.yt.find('img').height();
			var bW = that.big.find('img').width();
			var bH = that.big.find('img').height();
			var bigWidth = that.big.outerWidth();
			var bigHeight = that.big.outerHeight();
			var proportionX = aW/bW;
			var proportionY = aH/bH;
			var bLeft = -sLeft/proportionX;
			var bTop = -sTop/proportionY;
			bTop = bTop <= -(bH-bigHeight) ? -(bH-bigHeight) : bTop;
			that.big.children().css('left', bLeft);
			that.big.children().css('top', bTop);
		});
	}
	function getID(){
		var id = parseInt($.cookie('goodsID'));
		if (id%2 == 0) {
			return 0;
		}else{
			return 1;
		}
	}
	//加入购物车
	function addShopCar(){
		var id = $.cookie('goodsID');//获取商品ID号
		var price = $.cookie('price');
		var num = parseInt($('#inputQuantity').val());
		var first = $.cookie('goods')==null?true:false;//判断是否有cookie进行添加
		var same = false;//判断是否已经追加
		if (first) {
			//第一次添加,建立json结构。
			$.cookie('goods','[{id:'+id+',num:'+num+',price:'+price+'}]',{path:'/'});
		}else{
			var str = $.cookie('goods');
			var arr = eval(str);
			//遍历所有对象。如果id相同，让该商品数量递增 ;
			for(var index in arr){
				if(arr[index].id == id){		
					arr[index].num = arr[index].num + num;  //让json结构中num自增。
					var cookieStr = JSON.stringify(arr);//将json对象转换成字符串.
					$.cookie('goods',cookieStr,{path:'/'});
					same = true;
				}
			}
			if(!same){
				var obj  = {id:id,num:num,price:price};
				arr.push(obj);
				var cookieStr = JSON.stringify(arr);
				$.cookie('goods',cookieStr,{path:'/'});
			}
		}
		//购物车数目
		publicJS.addGoods('../data/json/goodsList.json');
		//头顶购物车
		publicJS.shopNum("#num");
		//侧边
		publicJS.shopNum('#shopNum');
					
	}
})