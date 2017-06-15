var login = (function () {
	/**
	 * bind event
	 */
	$('#btn-login').on('click', _handleLogin)

	function _handleLogin() {
		var username = $('#username').val();
		var password = $('#password').val();
		$.ajax({
			url: '/login',
			type: 'post',
			dataType: 'json',
			data: {
				username,
				password
			}, 
			success: function (data) {
				console.log(data);
				location.href = '/';
			},
			error: function (jqXHR) {
				console.log(jqXHR);
			}
		})
	}
})();
