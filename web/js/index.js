var index = (function () {
	/**
	 * bind event
	 */
	$('#btn-logout').on('click', _handleLogout);
	$('#btn-user').on('click', _handelOpenUserModal);
	$('#btn-updateUser').on('click', _handleUpdateUser);
	$('#btn-createPost').on('click', _handleCreatePost);

	_renderPost();

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

	function _handleUpdateUser() {
		var username = $('#updateUserUsername').val();
		var name = $('#updateUserName').val();
		var gender = $('#updateUserGender').val();
		var address = $('#updateUserAddress').val();
		var password = $('#updateUserPassword').val();
		var data = {
			name, gender, address, password
		};
		$.ajax({
			url: `/authors/${username}`, 
			type: 'patch', 
			dataType: 'json', 
			data,
			success: function (data) {
				console.log(data);
				localStorage.userData = JSON.stringify(data.user);
				$('#modal-userInfo').modal('hide');
			},
			error: function (jqXHR) {
				console.log(jqXHR);
				if (jqXHR.status == 401) {
					alert('No login');
				}
			}
		})
	}

	function _handleCreatePost() {
		var title = $('#newTitle').val();
		var tags = $('#newTags').val().split(',');
		var content = $('#newContent').val();
		$.ajax({
			url: '/posts', 
			type: 'post', 
			dataType: 'json',
			data: {
				title,
				tags,
				content
			},
			success: function (data) {
				console.log(data);
				$('#modal-createPost').modal('hide');
				_renderPost();
			},
			error: function (jqXHR) {
				console.log(jqXHR);
				if (jqXHR.status == 401) {
					alert('Login first');
				}
			}
		})
	}

	function _renderPost() {
		$.ajax({
			url: '/posts',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				console.log(data);
				$('#post').html('');
				for (let post of data) {
					$('#post').append(`
						<div class="row mb-2">
							<div class="col-8 offset-2">
								<div class="card post">
									<div class="card-block">
										<h4 class="card-title">${post.title}</h4>
										<h5 class="card-subtitle mb-2 text-muted">${post.author.name}</h5>
										<h6 class="card-subtitle mb-2 text-muted">${moment(post.created_at).format('YYYY/MM/DD')}</h6>
										${post.tags.map(function (val, i) {
											return `<span class="badge badge-default mr-1">${val}</span>`
										}).toString().replace(/,/g, '')}
										<p class="card-text">${post.content.substring(0, 100)} ...</p>
										<a class="btn-more" data-id="${post.id}" href="javascriptl:;" class="card-link">Read more...</a>
									</div>
								</div>
							</div>
						</div>
					`)
				}
			},
			error: function (jqXHR) {
				console.log(jqXHR);
			}
		})
	}

})();
