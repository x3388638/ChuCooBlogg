var index = (function () {
	var _userInfo = null;

	/**
	 * bind event
	 */
	$('#btn-logout').on('click', _handleLogout);
	$('#btn-user').on('click', _handelOpenUserModal);
	$('#btn-updateUser').on('click', _handleUpdateUser);
	$('#btn-createPost').on('click', _handleCreatePost);
	$('#post').on('click.readMore', '.btn-more', _handleReadMore);
	$('#post').on('click.delPost', '.btn-delPost', _handleDelPost);
	$('#post').on('click.editPost', '.btn-editPost', _handleOpenEditPostModal);
	$('#btn-updatePost').on('click', _handleUpdatePost);

	/**
	 * init
	 */
	_getUserInfo()
	.done(function (data) {
		_userInfo = data;
		_renderPost();
	})
	.fail(function () {
		_renderPost();
	});

	function _handleLogout() {
		$.ajax({
			url: `${CONFIG.API_BASE}/logout`, 
			type: 'post', 
			dataType: 'json',
			contentType: 'application/json', 
			xhrFields: {
				withCredentials: true
			},
			success: function (data) {
				console.log(data);
				_userInfo = null;
				alert('Logout.');
				_renderPost();
			}, 
			error: function (jqXHR) {
				if (jqXHR.status == 401) {
					alert('No login');
				}
			}
		});
	}

	function _handelOpenUserModal() {
		if (_userInfo) {
			$('#updateUserUsername').val(_userInfo.username);
			$('#updateUserName').val(_userInfo.name);
			$('#updateUserGender').val(_userInfo.gender);
			$('#updateUserAddress').val(_userInfo.address);
			$('#modal-userInfo').modal();
		} else {
			alert('Login first');
		}
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
			url: `${CONFIG.API_BASE}/authors/${username}`, 
			type: 'patch', 
			dataType: 'json',
			contentType: 'application/json', 
			data: JSON.stringify(data),
			xhrFields: {
				withCredentials: true
			},
			success: function (data) {
				console.log(data);
				localStorage.userData = JSON.stringify(data);
				_userInfo = data;
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
			url: `${CONFIG.API_BASE}/posts`, 
			type: 'post', 
			dataType: 'json',
			contentType: 'application/json',
			xhrFields: {
				withCredentials: true
			},
			data: JSON.stringify({
				title,
				tags,
				content
			}),
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

	function _handleReadMore() {
		var id = $(this).data('id');
		$.ajax({
			url: `${CONFIG.API_BASE}/posts/${id}`,
			type: 'get',
			dataType: 'json',
			contentType: 'application/json',
			xhrFields: {
				withCredentials: true
			},
			success: function (data) {
				console.log(data);
				$('#postTitle').text(data.title);
				$('#postTags').html('').append(data.tags.map(function (val, i) {
					return `<span class="badge badge-default mr-1">${_htmlEncode(val)}</span>`;
				}).toString().replace(/,/g, ''));
				$('#postAuthor').text(data.author.name);
				$('#postContent').html(_htmlEncode(data.content).replace(/\n/g, '<br />'));
				$('#postTime').text(moment(post.created_at).format('YYYY/MM/DD HH:mm:ss'));
				$('#modal-postContent').modal();
			},
			error: function (jqXHR) {
				console.log(jqXHR);
			}
		});
	}

	function _handleDelPost() {
		if (confirm(`Delete post [ ${$(this).data('title')} ] ?`)) {
			var id = $(this).data('id');
			$.ajax({
				url: `${CONFIG.API_BASE}/posts/${id}`,
				type: 'delete',
				dataType: 'json', 
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				success: function (data) {
					console.log(data);
					_renderPost();
				},
				error: function (jqXHR) {
					console.log(jqXHR);
					if (jqXHR.status == 401) {
						alert('no login');
					}
				}
			})
		}
	}

	function _handleOpenEditPostModal() {
		var id = $(this).data('id');
		$('#modal-editPost').attr('data-id', id);
		$.ajax({
			url: `${CONFIG.API_BASE}/posts/${id}`,
			type: 'get',
			dataType: 'json',
			contentType: 'application/json',
			xhrFields: {
				withCredentials: true
			},
			success: function (data) {
				console.log(data);
				$('#editTitle').val(data.title);
				$('#editTags').tagsinput('removeAll');
				for (let tag of data.tags) {
					$('#editTags').tagsinput('add', tag);
				}
				$('#editContent').val(data.content);
				$('#modal-editPost').modal();
			},
			error: function (jqXHR) {
				console.log(jqXHR)
			}
		})
	}

	function _handleUpdatePost() {
		var id = $("#modal-editPost").data('id');
		var title = $('#editTitle').val();
		var tags = $('#editTags').val().split(',');
		var content = $('#editContent').val();
		$.ajax({
			url: `${CONFIG.API_BASE}/posts/${id}`, 
			type: 'patch', 
			dataType: 'json',
			contentType: 'application/json',
			xhrFields: {
				withCredentials: true
			},
			data: JSON.stringify({
				title,
				tags,
				content
			}),
			success: function (data) {
				console.log(data);
				$("#modal-editPost").modal('hide');
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

	function _getUserInfo() {
		return (
			$.ajax({
				url: `${CONFIG.API_BASE}/login`,
				type: 'get',
				dataType: 'json',
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				}
			})
		);
	}

	function _renderPost() {
		$.ajax({
			url: `${CONFIG.API_BASE}/posts`,
			type: 'get',
			dataType: 'json',
			contentType: 'application/json',
			xhrFields: {
				withCredentials: true
			},
			success: function (data) {
				console.log(data);
				$('#post').html('');
				for (let post of data) {
					$('#post').append(`
						<div class="row mb-2">
							<div class="col-lg-8 offset-lg-2">
								<div class="card post">
									<div class="card-block">
										${_userInfo ? `<span data-id="${post.id}" data-title="${post.title}" class="btn-delPost">&times;</span>` : ''}
										${_userInfo ? `<i data-id="${post.id}" class="fa fa-pencil btn-editPost" aria-hidden="true"></i>` : ''}
										<h4 class="card-title">${_htmlEncode(post.title)}</h4>
										<h5 class="card-subtitle mb-2 text-muted">${_htmlEncode(post.author.name)}</h5>
										<h6 class="card-subtitle mb-2 text-muted">${moment(post.created_at).format('YYYY/MM/DD HH:mm:ss')}</h6>
										${post.tags.map(function (val, i) {
											return `<span class="badge badge-default mr-1">${_htmlEncode(val)}</span>`
										}).toString().replace(/,/g, '')}
										<p class="card-text">${_htmlEncode(post.content).replace(/\n/g, '<br />').substring(0, 100)} ...</p>
										<a class="btn-more" data-id="${post.id}" href="javascript:;" class="card-link">Read more...</a>
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

	function _htmlEncode(data) {
		return ($('<span>').text(data).html());
	}

})();
