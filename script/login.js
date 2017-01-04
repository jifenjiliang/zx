define(function(require,exports,module){
	var $ = require('jq');
	var cookie = require('cookie');
	cookie($);
	/*alert($.cookie('user'));
	console.log($.cookie('user'))*/
	var ajax = require('ajaxPost.js');
	var ajaxGet = require('ajaxGet.js');
	$(function(){
		//按钮点击事件
		$('.login-tab-l').on('click', function() {
			$('.mas-error').hide();
			$(this).find('a').addClass('select').end().siblings().find('a').removeClass('select');
			$('#denglu').css('display', 'none').next().css('display', 'block');
		});
		$('.login-tab-r').on('click', function() {
			$('.mas-error').hide();
			$(this).find('a').addClass('select').end().siblings().find('a').removeClass('select');
			$('#denglu').css('display', 'block').find('#loginName').focus();
			$('#denglu').next().css('display', 'none');
		});
		//注册按钮
		$('#denglu .register').on('click', function() {
			$('.mas-error').hide();
			$('#denglu').css('display', 'none').next().css('display', 'block');
			$('.login-tab-l').find('a').addClass('select').end().siblings().find('a').removeClass('select');
		});
		//扫码登陆 获取验证码
		new publicEvent('#login-SMS');
		register.init();
		
		//账户登录
		new publicEvent('#denglu');
		login.init();
	})
	//公共事件：input得失焦事件、点击事件
	function publicEvent(id){
		$(id).find('input').focus(function(event) {
			$(this).parent().css('borderColor', '#06f').end().next().not('.split').css('top', '-10px');
		});
		$(id).find('input').blur(function(event) {
			$(this).parent().css('borderColor', '#d8d8d8')
			if (!$(this).val()) {
				$(this).next().css('top', '9px');
			}
		});
		$(id).find('#login-extDl').on('click',function(){
			$(this).next().fadeToggle();
		}).end().find('li').hover(function() {
			$(this).css('opacity', '1');
		}, function() {
			$(this).css('opacity', '.8');
		});
	}
	//扫码登陆
	var register = {
		init:function(){
			var that = this;
			that.random = 0;
			that.name = 0;
			$('#loginYZM').on('click', function(event) {
				$('#login-SMS .tests').show();
				ajaxGet.$GetData('../data/json/register.json','json',that.getYZM,that);
				//定时器之倒计时
				that.tag();
			});
			that.yz();
		},
		getYZM:function(res,that){
			node();
			function node(){
				var str = '';
				that.random = Math.floor(Math.random() * 10);
				$('#login-SMS .tests').children('img').remove();
				for (var i = 0; i < res.length; i++) {
					str = '<img src="'+res[i].src+'" name="'+res[i].key+'">'; 
					$('#login-SMS .tests a').before(str) ;
					that.name = res[that.random].key;
				}
				$('#login-SMS .tests').children('img').hide().eq(that.random).show();
			}
			$('#login-SMS').find('.login_a').on('click', function(event) {
				node();
			});
		},
		tag:function(){
			var timer;
			$(this).css('background','#ccc')
			clearInterval(timer);
			var $seconds = 30;
			$(this).val("重新发送("+$seconds+")");
			$('.loginZymBox').find('.split').show();
			timer = setInterval(Settime,1000);
			function Settime(){
				if($seconds == 0){
					clearInterval(timer);
					$('#loginYZM').css('background','#f7f7f7').val("888888").next().hide();
				}else{
					$seconds--;
					$('#loginYZM').val("重新发送("+$seconds+")");
				}
			}
		},
		yz:function(){
			var that = this;
			that.error = $('#login-SMS').find('.mas-error');
			var aInput = $('#login-SMS').find('input');
			var tijiao = [0,0,0,1,1]
			var yzm;
			aInput.eq(0).on('blur', function() {
				that.user = $(this).val();
				if(!that.user){
					that.error.show().html("<b></b>请输入有效的手机号");
				}else if(!regExpManger.mobileReg.test(that.user)) {
					that.error.show().html("<b></b>手机号码格式错误");
				}else{
					tijiao[0] = 1;
					that.error.hide();
					ajax.$GetData('login',that.user,that.pwd,isCM);
					function isCM(res){
						if (res == '0') {
							$('#login-SMS').find('.newUser').show().html('新手机号将认为接受《<span>走秀网用户协议</span>》并自动注册账号')
						}else{
							$('#login-SMS').find('.newUser').hide();
						}
					}
				}
			});
			aInput.eq(1).on('blur', function() {
				yzm = $(this).val();
				if (!yzm) {
					that.error.show().html("<b></b>请输入验证码");
				}else if(yzm != that.name){
					that.error.show().html("<b></b>验证码不对");
				}else{
					tijiao[1] = 1;
					that.error.hide();
				}
			});
			aInput.eq(2).on('blur', function() {
				that.pwd = $(this).val();
				if (!that.pwd) {
					that.error.show().html("<b></b>请输入你收到的验证码");
				}else{
					tijiao[2] = 1;
					that.error.hide();
				}
			});
			$('#login-btn a').on('click', function(event) {
				for (var i = 0; i < tijiao.length; i++) {
					if (tijiao[i] == 0) {
						return false;
					}
				}
				$(this).html('注册中...')
				that.user = aInput.eq(0).val();
				that.pwd = aInput.eq(2).val();
				ajax.$GetData('register',that.user,that.pwd,that.deal,that)
			});
		},
		deal:function(res,that){
			switch(res){
				case '0':
					that.error.show().html("<b></b>用户名已存在");
					$('#login-btn a').html('登&nbsp;&nbsp;&nbsp;录')
					break;
				case '1':
					//注册成功后后台自动登录
					login.yz(that.user,that.pwd);
					break;
				case '2':
					that.error.show().html('不好意思、程序出错了、请稍候...');
					break;
			}
		}
	}
	//账号登录
	var login = {
		init:function(){
			var that = this;
			this.$par = $('#denglu');
			that.btn = this.$par.find('#login-btn a');
			this.error = this.$par.find('.mas-error');
			that.btn.on('click',function(event) {
				that.user = that.$par.find('#loginName').val();
				that.pwd = that.$par.find('#loginPwd').val();
				that.yz(that.user,that.pwd);
			});
		},
		yz:function(user,pwd){
			console.log(user);
			var that = this;
			if (!user&&pwd) {
				this.error.show().html("<b></b>请输入用户名");
			}else if(user&&!pwd){
				this.error.show().html("<b></b>请输入密码");
			}else if(!user&&!pwd){
				this.error.show().html("<b></b>请输入用户名和密码");
			}else{
				ajax.$GetData('login',user,pwd,that.deal,that);
				that.btn.html('登录中...');
			}
		},
		deal:function(res,that){
			res = eval('('+res+')');
			switch(res){
				case 0:
					that.error.show().html("<b></b>用户名不存在");
					break;
				case 2:
					that.error.show().html("<b></b>用户名与密码不符");
					break;
				default:
					that.error.hide();
					if ($('#checked').is(':checked')) {
						$.cookie('user',res.userID,{expires:15,path:'/'});
						$.cookie('password',res.password,{expires:15,path:'/'});
					}else{
						$.cookie('user',res.userID,{path:'/'});
						$.cookie('password',res.password,{path:'/'});
					}
					window.location.href="../index.html";
					that.btn.html('登&nbsp;&nbsp;&nbsp;录');
					break;
			}
		}
	}
	//正则表达式合集
	var regExpManger = {
		userNameReg:/^\w{6,20}$/, //用户名
		pwdReg:/[a-zA-Z]+/,      //密码    
		jbhReg:/\w+[\#]/g,  //密码强度高 
		jbmReg:/\w+[\.]/g,  //密码强度中                       
		emaiReg:/^\w+@[a-z]+\.[a-z]+$/i,//邮箱
		nameReg:/^[^\w]{2,4}$/i,     //真实姓名
		mobileReg:/^[1]\d{10}$/,     //手机号
	}
})