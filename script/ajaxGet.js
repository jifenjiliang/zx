define(function(require,exports,module){
	var $ = require('jq');
	var Ajax={
		$GetData :function(url,dataType,fn,_this){
			$.ajax({
				url:url,
				type:'GET',
				dataType:dataType,
			})
			.done(function(res) {
				fn(res,_this);
			})
		}
	}
	module.exports = Ajax;
})