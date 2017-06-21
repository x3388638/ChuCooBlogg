var CONFIG = (function () {
	var _API_BASE = localStorage.apibase || '';

	function getBase() {
		return _API_BASE;
	}

	function setBase(url) {
		_API_BASE = localStorage.apibase = url;
	}

	return {
		getBase,
		setBase
	}
})();

