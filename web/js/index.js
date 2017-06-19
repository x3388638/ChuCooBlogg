var index = (function () {
	/**
	 * bind event
	 */
	$('#btn-logout').on('click', _handleLogout);
	$('#btn-user').on('click', _handelOpenUserModal);

	function _handleLogout() {
		$.ajax({
			url: '/logout', 
			type: 'post', 
			dataType: 'json', 
			success: function (data) {
				console.log(data);
				alert('Logout.');
			}, 
			error: function (jqXHR) {
				if (jqXHR.status == 401) {
					alert('No login');
				}
			}
		});
	}

	function _handelOpenUserModal() {
		$.ajax({
			url: '/authors',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				console.log(data);
				$('#updateUserUsername').val(data.user.username);
				$('#updateUserName').val(data.user.name);
				$('#updateUserGender').val(data.user.gender);
				$('#updateUserAddress').val(data.user.address);
				$('#modal-userInfo').modal();
			},
			error: function (jqXHR) {
				console.log(jqXHR);
				if (jqXHR.status == 401) {
					alert('Login first');
				}
			}
		})
	}

})();
