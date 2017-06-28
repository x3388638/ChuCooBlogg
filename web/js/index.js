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
	$('#btn-changeAPI').on('click', _handleChangeAPI);

	/**
	 * init
	 */
	_getUserInfo()
	.done(function (data) {
		_userInfo = data;
		_renderPost();
		$('.forLogin').removeClass('hide');
		$('.forNoLogin').addClass('hide');
	})
	.fail(function () {
		_renderPost();
		$('.forLogin').addClass('hide');
		$('.forNoLogin').removeClass('hide');
	});

	$('#api').val(CONFIG.getBase() || location.origin);

	function _handleLogout() {
		$.ajax({
			url: `${CONFIG.getBase()}/logout`, 
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
				$('.forLogin').addClass('hide');
				$('.forNoLogin').removeClass('hide');
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
			url: `${CONFIG.getBase()}/authors/${username}`, 
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
			url: `${CONFIG.getBase()}/posts`, 
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
				var title = $('#newTitle').val('');
				var tags = $('#newTags').tagsinput('removeAll');
				var content = $('#newContent').val('');
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
			url: `${CONFIG.getBase()}/posts/${id}`,
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
				$('#postContent').html(_filterYoutube(_filterImg(_htmlEncode(data.content))).replace(/\n/g, '<br />'));
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
				url: `${CONFIG.getBase()}/posts/${id}`,
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
			url: `${CONFIG.getBase()}/posts/${id}`,
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
			url: `${CONFIG.getBase()}/posts/${id}`, 
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

	function _handleChangeAPI() {
		var api = $('#api').val();
		CONFIG.setBase(api);
		location.reload();
	}

	function _getUserInfo() {
		return (
			$.ajax({
				url: `${CONFIG.getBase()}/login`,
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
			url: `${CONFIG.getBase()}/posts`,
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
					$('#post').prepend(`
						<div class="row mb-2">
							<div class="col-lg-8 offset-lg-2">
								<div class="card post">
									<div class="card-block">
										${_userInfo ? `<span data-id="${post.id}" data-title="${post.title}" class="btn-delPost">&times;</span>` : ''}
										${_userInfo ? `<i data-id="${post.id}" class="fa fa-pencil btn-editPost" aria-hidden="true"></i>` : ''}
										<h4 class="card-title mr-2">${_htmlEncode(post.title)}</h4>
										<h5 class="card-subtitle mb-2 text-muted">${_htmlEncode(post.author.name)}</h5>
										<h6 class="card-subtitle mb-2 text-muted">${moment(post.created_at).format('YYYY/MM/DD HH:mm:ss')}</h6>
										${post.tags.map(function (val, i) {
											return `<span class="badge badge-default mr-1">${_htmlEncode(val)}</span>`
										}).toString().replace(/,/g, '')}
										<p class="card-text">${_abstract(post.content)}</p>
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

	function _filterImg(content) {
		var regex = /\!\[.*\]\(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\)/g;
		content = content.replace(regex, function (target) {
			var alt = target.match(/\!\[(.*)\]\(/)[1] || '';
			var src = target.match(/\]\((.*)\)/)[1];
			var $wrap = $('<div>').css('display', 'none');
			$wrap.append(
				$('<img>').attr({ src, alt })
			);
			$('body').append($wrap);
			var img = $wrap.html();
			$wrap.remove();
			return img;
		});
		return content;
	}

	function _filterYoutube(content) {
		var regex = /\{\%youtube\s([^\s.]*)\s\%\}/g;
		content = content.replace(regex, function (target) {
			var id = target.match(/\{\%youtube\s([^\s.]*)\s\%\}/)[1];
			var $wrap = $('<div>').css('display', 'none');
			$wrap.append(
				$('<iframe width="100%" height="400" frameborder="0" allowfullscreen></iframe>').attr('src', `https://www.youtube.com/embed/${id}`)
			);
			$('body').append($wrap);
			var iframe = $wrap.html();
			$wrap.remove();
			return iframe
		});

		return content;
	}

	function _abstract(content) {
		var img;
		var regex = /\!\[.*\]\(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\)/g;
		var temp = content.replace(regex, function (target) {
			if (!img) {
				var index = content.indexOf(target);
				img = {
					index,
					target
				};
			}
			return ' ';
		});
		var sub = temp.substring(0, 100);
		if (img && img.index < 100) {
			sub = sub.splice(img.index, 1, img.target);
		}
		var result = _filterYoutube(_filterImg(_htmlEncode(sub))).replace(/\n/g, '<br />');
		return result;
	}

	String.prototype.splice = function(idx, rem, str) {
		return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};

})();
