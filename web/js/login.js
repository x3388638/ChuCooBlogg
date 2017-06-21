var login = (function () {
	/**
	 * bind event
	 */
	$('#btn-login').on('click', _handleLogin);

	/**
	 * init
	 */
	$('#api').val(CONFIG.getBase() || location.origin);

	function _handleLogin() {
		var username = $('#username').val();
		var password = $('#password').val();
		var api = $('#api').val();
		CONFIG.setBase(api);
		$.ajax({
			url: `${CONFIG.getBase()}/login`,
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
