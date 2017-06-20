var login = (function () {
	/**
	 * bind event
	 */
	$('#btn-login').on('click', _handleLogin)

	function _handleLogin() {
		var username = $('#username').val();
		var password = $('#password').val();
		$.ajax({
			url: `${CONFIG.API_BASE}/login`,
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			xhrFields: {
				withCredentials: true
			},
			data: JSON.stringify({
				username,
				password
			}), 
			success: function (data) {
				console.log(data);
				localStorage.userData = JSON.stringify(data);
				location.href = '/';
			},
			error: function (jqXHR, statusCode, c) {
				console.log(jqXHR);
				if (jqXHR.status == 401) {
					alert('Wrong password.');
				}
			}
		})
	}
})();
