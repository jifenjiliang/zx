define(function(require,exports,module){
	var $ = require('jq');
	var ajax = require('ajaxGet.js');
	var cookie = require('cookie');
	cookie($);
	var isLogin = false;
	$(function(){
		//登录
		if ($.cookie('user')) {
			var str = '您好!欢迎光临走秀网!&nbsp;'+$.cookie('user')+'&nbsp;&nbsp;&nbsp;<a class="exit" title="退出">[退出]</a><a class="myXiu" title="我的走秀">[我的走秀]</a>';
			$('#loginZone').html(str);
			isLogin = true;
		}
		//退出
		$('#loginZone').find('.exit').on('click', function() {
			$.cookie('user',null,{path:'/'});
			$.cookie('password',null,{path:'/'});
			var str = '您好!欢迎光临走秀网!<a href="login.html" target="_blank" id="loginBtn" title="登录/注册">[登录/注册]</a>';
			$('#loginZone').html(str);
			window.location.reload(true);
		});
		//购物袋内容
		if ($.cookie('goods')) {
			showGoods();
		}else{
			var str = '';
			str = '<div style="margin-top:20px;height:90px;background:#F6F6F6;border:1px solid #d6d3d3;"><img src="../data/img/nogoods.jpg" style="width:52px;height;57px;float:left;margin:17px 50px 7px 200px;"><h2 class="war_h2" style="float:left;align:center;margin-top:25px;">购物袋暂没有商品，现在就去<a href="../index.html" style="color:#FF6633;" class="like"><span>挑选自己喜欢的商品</span></a>  。</h2></div>';
			$('#shoppingCart').html(str);
		}
	});
	function showGoods(){
		ajax.$GetData('../data/json/goodsList.json','json',show);
		var ag_num = 0 ;
		var hj = 0;
		var gs = 0;//选中的商品种类数目
		function show(res){
			getGoods();
			function getGoods(){
				var ag_str = $.cookie('goods');
				if(ag_str){
					var ag_obj = eval(ag_str);
					var html = ''; 
					for (var i = 0; i < res.length; i++) {
						for(var j in ag_obj){
							if (res[i].goodsID == ag_obj[j].id) {
								html += '<tr id="'+res[i].goodsID+'" class="goodsitemb"><td class="chebox"><input type="checkbox" class="goodschek" name="goodsCheck"></td><td class="tx_img"><a href="#"><img src="'+res[i].src+'" alt="" width="60" height="80" style="border:#DFDFDF solid 1px;"></a></td><td class="txtl" valign="top"><span class="Brand">Add Down</span><a class="goodsName" href="#" style="color:#000;">'+res[i].goodsName+'</a><span>颜色 : 酒红色 尺码 : IT38 </span></td><td class="pricetd"><p style="font-family:"Microsoft YaHei";">¥ '+res[i].price+'</p></td><td><font class=""style="float:left;width:30px;">&nbsp;</font><font name="xiuPrice" class="xiuPrice" style="text-align:left;float:left;font-family:"Microsoft YaHei";">¥ '+(res[i].price*ag_obj[j].num)+'</font></td><td><span class="down" id="minusAmount"></span><input type="text" id="inputQuantity" name="inputQuantity" value="'+ag_obj[j].num+'" class="inputQuantity"><span class="up" id="plusAmount"></span></td><td><a href="javascript:;">移至收藏夹</a><a class="butG" style="padding:2px 10px 2px 10px;" href="javascript:;">删除</a></td></tr>';
									ag_num += ag_obj[j].num;
									hj += ag_obj[j].num*res[i].price;
							}
						}
					}
					html = '<div class="wartab_div"><div class="wartab_con"><table id="BSCXClick" class="buyTab" name="BSCXClick"><tbody><tr><th style="width:80px"><label style="padding:0 0 0 10px;"><input type="checkbox" class="checkall" name="goodsChecks" id="goodsChecks">&nbsp;全选</label></th><th colspan="2" style="width:350px">商品</th><th style="width:120px;">购买价(元)</th><th style="width:130px;">小计(元)</th><th style="width:130px;">数目</th><th style="width:130px;">操作</th></tr>'+html+'</tbody></table></div></div><div class="cartbar"><div class="cartbar_wrap clearfix"><div class="carbar_cheall"><label><input type="checkbox" id="allchekb" class="checkall">&nbsp;全选</label></div><div class="cartbar_opa"><a href="javascript:;" id="delgoods" class="delbtn">删除</a><a href="javascript:;" id="cleargoods" class="delbtn">清除失效商品</a><a href="javascript:;" id="addlike" class="delbtn">移至收藏夹</a></div><div class="cartbar_chego">已选商品<b id="checkCountNum">0</b>件</div><div class="cartbar_totall">总计(<span>不含运费</span>)：<span class="cartbar_total_spn"><span style="font-family:"Microsoft YaHei";">¥&nbsp;<span id="totalAmoutPrice">0</span></span></span></div><input class="cartbar_pay cartbar_payno" type="button" id="toBalanceLink" style="cursor: pointer;" value="结算"></div></div></div>';
					$('#shoppingCart').html(html);
				}
			}
			//删除按钮事件(单条)
			$('.butG').on('click', function() {
				var id = $(this).parent().parent().attr('id');
				$(this).parent().parent().remove();
				var goods_arr = eval($.cookie('goods'));
				//删除一条数据 1为一条
				for(var i in goods_arr){
					if (goods_arr[i].id == id) {
						goods_arr.splice(i,1);
						var newCookie = JSON.stringify(goods_arr);
						console.log(newCookie);
						if (goods_arr.length==0) {
							$.cookie('goods',null,{path:'/'});
							var str = '<div style="margin-top:20px;height:90px;background:#F6F6F6;border:1px solid #d6d3d3;"><img src="../data/img/nogoods.jpg" style="width:52px;height;57px;float:left;margin:17px 50px 7px 200px;"><h2 class="war_h2" style="float:left;align:center;margin-top:25px;">购物袋暂没有商品，现在就去<a href="../index.html" style="color:#FF6633;" class="like"><span>挑选自己喜欢的商品</span></a>  。</h2></div>';
							$('#shoppingCart').html(str);
						}else{
							$.cookie('goods',newCookie,{path:'/'});
						}
					}
				}
			});
			//全删
			$('#delgoods').on('click', function() {
				$.cookie('goods',null,{path:'/'});
				window.location.reload(true);
			});
			//上全选
			var aInput = $('#shoppingCart input[type=checkbox]');
			var aCheBox = $('#BSCXClick .chebox input');
			$('#goodsChecks').on('click', function() {
				for (var i = 0; i < aInput.length; i++) {
					aInput[i].checked = this.checked;
				}
				if ($(this).is(':checked')) {
					resetStyle(ag_num,hj,'0 -50px');
					$('#BSCXClick .goodsitemb').addClass('item_checked');
					gs = aCheBox.length;
				}else{
					resetStyle(0,0,'0 0');
					$('#BSCXClick .goodsitemb').removeClass('item_checked');
					gs = 0;
				}
			});
			//下全选
			$('#allchekb').on('click', function() {
				for (var i = 0; i < aInput.length; i++) {
					aInput[i].checked = this.checked;
				}
				if ($(this).is(':checked')) {
					resetStyle(ag_num,hj,'0 -50px');
					$('#BSCXClick .goodsitemb').addClass('item_checked');
					gs = aCheBox.length;
				}else{
					resetStyle(0,0,'0 0');
					$('#BSCXClick .goodsitemb').removeClass('item_checked');
					gs = 0;
				}
			});
			//单选
			var zs = 0;//商品总数
			var zh = 0;//商品总和
			aCheBox.on('click', function() {
				var num = parseInt($(this).parent().parent().find('#inputQuantity').val());
				var dj = parseInt($(this).parent().parent().find('.xiuPrice').html().replace('¥',''));
				if (gs == 0) {
					zs = 0;
					zh = 0;
				}
				if ($(this).is(':checked')) {
					gs += 1;
					zs += num;
					zh += dj;
					resetStyle(zs,zh,'0 -50px');
					$(this).parent().parent().addClass('item_checked');
				}else{
					zs -= num;
					zh -= dj;
					gs -= 1;
					if (gs == 0) {
						zs = 0;
						zh = 0;
					}
					resetStyle(zs,zh,'0 0');
					$(this).parent().parent().removeClass('item_checked');
				}
				if(gs == aCheBox.length) {	
					$('#goodsChecks').attr("checked",'true');
					$('#allchekb').attr("checked",'true')
				}else{
					$('#goodsChecks').removeAttr("checked");	
					$('#allchekb').removeAttr("checked");	
				}
			});
			//重置样式
			function resetStyle(num,hj,bp){
				$('#checkCountNum').html(num);
				$('#totalAmoutPrice').html(hj);
				$('#toBalanceLink').css('backgroundPosition',bp);
			}
			//减号
			var aDown = $('#BSCXClick').find('.down');
			aDown.on('click', function(event) {
				var id = $(this).parent().parent().attr('id');
				var $next = $(this).next()
				var num = $next.val();
				if (num <= 1) {
					$next.val(1);
				}else{
					num--;
					$next.val(num);
				}
				chengeCookie(id,num);
			});
			//加号
			var aUp = $('#BSCXClick').find('.up');
			aUp.on('click', function() {
				var id = $(this).parent().parent().attr('id');
				var $prev = $(this).prev()
				var num = $prev.val();
				num++;
				$prev.val(num);
				chengeCookie(id,num);
			});
			//数目输入框
			var aNumInput = $('#BSCXClick').find('.inputQuantity');
			aNumInput.on('blur', function() {
				var id = $(this).parent().parent().attr('id');
				var num = $(this).val();
				chengeCookie(id,num);
			});
			function chengeCookie(id,num){
				var str = $.cookie('goods');
				var arr = eval(str);
				//遍历所有对象。如果id相同，让该商品数量递增 ;
				for(var index in arr){
					if(arr[index].id == id){		
						arr[index].num = num;  //让json结构中num自增。
						var cookieStr = JSON.stringify(arr);//将json对象转换成字符串.
						$.cookie('goods',cookieStr,{path:'/'});
					}
				}
				getGoods();
				window.location.reload(true);
			}
			$('#toBalanceLink').on('click',function(event) {
				if(isLogin){
					alert('结算完成，请净心等待你的宝贝的到来！');
					$.cookie('goods',null,{path:'/'});
					window.location.href="../index.html";
				}else{
					alert('请先登录');
					window.location.reload(true);
				}
			})
		}
	}
});