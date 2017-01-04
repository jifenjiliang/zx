define(function(require,exports,module){
	var $ = require('jq');
	function changeImg(){
		var that = this;
		that.index = 1;
		that.$homeBanner = $('.home_banner');
		that.$MainUl = $('.bannerCon ul');
		that.$aLi = that.$MainUl.find('li');
		that.$aBtn = $('.bannerNum').find('li');
		that.$MainUl.css('left', '-1200px');
		that.timer = setInterval(function(){
			that.changeNextImg();
		}, 3000);
		that.$homeBanner.hover(function() {
			clearInterval(that.timer);
		}, function() {
			that.timer = setInterval(function(){
				that.changeNextImg();
			}, 3000);
		});
		that.$aBtn.on('mouseenter', function() {
			that.index = $(this).index()+1;
			that.$MainUl.stop().animate({left:-1200*that.index});
			that.$aBtn.removeClass('on').eq(that.index-1).addClass('on');
		});
	}
	changeImg.prototype.changeNextImg = function(){
		var that = this;
		if (that.index < that.$aLi.length-2) {
			that.index++;
		}else{
			that.index = 1;
			that.$MainUl.css('left', 0);
		}
		that.$MainUl.stop().animate({left:-1200*that.index});
		that.$aBtn.removeClass('on').eq(that.index-1).addClass('on');
	}
	module.exports = new changeImg();
})