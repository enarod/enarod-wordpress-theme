var KeySelectorDialog = function (signButton, onLoad) {
	var showDialog = function (visible) {
		var action = visible === true ? 'open' : 'close';
		console.log('Key selector dialog: ' + action);
		$(dialogSelector).dialog(action);
	};
	

	var onKeySelected = function () {
		showDialog(false);

		var key = $(this).attr('id');
		console.log(key);
		switch (key) {
			case 'key-option-dpa':
				window.cert = new certDpa();
				window.cert.InitializeDPA(
					signButton,
					function () {
						return $('#agreement-text').html();
					},
					function () {
						cert.SignDpa();
					}
				);

				break;

			case 'key-option-uac':
				window.cert = new certUaCrypt();
				window.cert.InitializeCrypto(
					signButton,
					function() {
						return $('#agreement-text').html();
					},
					function() {
						cert.SignUaCrypto();
					});
				break;

			case 'key-option-msk':

				break;

			case 'key-option-fb':

				break;
		}
	};


	var init = function () {
		var html =
			'<div id="dialogBox-keyType" style="display: none">' +
			'	<ul>' +
			'		<li><a id="key-option-dpa" href="#">ДПА</a></li>' +
			'		<li><a id="key-option-uac" href="#">UACrypt</a></li>' +
			'	</ul>' +
			'</div>';
		$('body').append(html);

		$('a', dialogSelector).click(onKeySelected);

		$(dialogSelector).dialog({
			height: 180,
			modal: true,
			resizable: false,
			title: 'Виберіть тип сертифікату',
			autoOpen: true
		});

		if (onLoad != null) onLoad();
	};





	console.log('New key selector dialog created.');
	var dialogSelector = '#dialogBox-keyType';
	init();


	return {
		//OnPageLoaded: onPageLoaded,
		ShowDialog: showDialog
	};
}