var AgreementService = function () {
	var serviceBaseUrl = 'https://enarod.org/app/api/';
	var agreementServiceUrl = serviceBaseUrl + 'agreement/';
	var cryptoServiceUrl = serviceBaseUrl + 'crypto/';
	var participantServiceUrl = serviceBaseUrl + 'user';

	this.getAgreement = function (agreementID, callback) {
		ajaxRequest(
			agreementServiceUrl + ((agreementID == null || typeof agreementID === 'undefined') ? '' : agreementID),
			'GET',
			null,
			function (data, status, xhr) {
				if (data.ResultCode > 0) {
					console.log('Request succeeded:');
					console.log(data);
					if (callback != null) {
						callback(data.Data, status, xhr);
					} else {
						console.log('getAgreement has no success callback function.');
					}
				} else {
					console.log('Request failed:');
					console.log(data);
				}
			});
	};

	this.vote = function (vote, successCallback, failCallback) {
		//ajaxRequest(agreementServiceUrl, 'POST', vote, successCallback, failCallback);
		var url = agreementServiceUrl;
		console.log('AJAX request: POST' + url);

		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(vote),
			url: url,
			contentType: "application/json",
			success: function (data, status, xhr) {
				if (successCallback != null) successCallback(data, status, xhr);
			},
			error: function (data, status, xhr) {
				console.log('AJAX request: FAILED');
				console.log(data.Data);
				if (failCallback != null) failCallback(data, status, xhr);
			}
		});
	};

	this.validateSignature = function (signature, successCallback, failCallback) {
		ajaxRequest(cryptoServiceUrl, 'GET', signature, successCallback, failCallback);
	};

	this.getParticipant = function (thumbPrint, successCallback, failCallback) {
		ajaxRequest(participantServiceUrl + '?thumbPrint=' + thumbPrint, 'GET', null, successCallback, failCallback);
	};

	this.getAllVotesCount = function () {
		return 139; // TODO: to be implemented later.
	};

	var ajaxRequest = function (url, method, data, successCallback, failCallback) {
		console.log('AJAX request:' + method + ' ' + url);

		$.ajax({
			type: method,
			dataType: 'json',
			//data: typeof data == 'object' ? JSON.stringify(data) : data,
			data: data,
			processData: (method === 'GET'),
			url: url /*+ '?callback=?'*/,
			contentType: "application/json",
			success: function (data, status, xhr) {
				if (successCallback != null) successCallback(data, status, xhr);
			},
			error: function (data, status, xhr) {
				console.log('AJAX request: FAILED');
				console.log(data);
				if (failCallback != null) failCallback(data, status, xhr);
			}
		});
	};
}