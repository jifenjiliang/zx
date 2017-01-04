define(function(require,exports,module){
	var $ = require('jq');
	var Ajax={
		$GetData :function(status,userID,password,fn,_this){
			$.ajax({
				url:'http://datainfo.duapp.com/shopdata/userinfo.php',
				type:'POST',
				data:{
					status:status,
					userID:userID,
					password:password
				}
			})
			.done(function(res) {
				fn(res,_this);
			})
		}
	}
	module.exports = Ajax;
})