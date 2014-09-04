var certUaCrypt = function () {
	var appletSelector = "#cryptoApplet";

	var isUaCryptoInitialized = false;
	var onCryptoAppletInitializedCallback = null;

	var initializeCrypto = function (signButtonObject, selectDataFunction, appletInitializedCallback) {
		signButton = signButtonObject;
		selectData = selectDataFunction;
		onCryptoAppletInitializedCallback = appletInitializedCallback;

		if (isUaCryptoInitialized) return;

		waitOverlay(true);

		if (signButton != null) signButton.hide();
		createCryptoApplet("OnAppletCreated");
	};


	var sign = function () {
		console.log('signing via UaCrypto');
		var text = selectData();
		readKey(text);
	};


	function createCryptoApplet(callBackFunction) {
		var applet = $(appletSelector);
		if (applet.length == 0) {
			$("body").append('<div id="cryptoApplet"></div>');
		}

		var appletHtml = "<applet id='UACrypto' width='1' height='1' archive='" + baseUrl + "Applets/UaCrypto/UACrypto.jar, " + baseUrl + "Applets/UaCrypto/applet.jar'   code='uacrypto.applet.uacrypto'>" +
				"<param name='callBackFunction' value='" + callBackFunction + "'/>" +
				"</applet>";
		$(appletSelector).html(appletHtml);
	}


	////function getApplet() {
	////	return $(appletSelector).children("applet").first()[0];
	////}


	function readKey(dataToSign) {
		var password = null;
		var buttons = [{
			text: 'Закрити',
			'class': 'dialog_close_btn',
			click: function () {
				$(this).dialog('close');
			}
		}, {
			text: 'Зчитати',
			'class': 'dialog_ok_btn',
			click: function () {
				password = $('#password').val();
				var certPath = openFileDialog();

				if (certPath == null || certPath == "") {
					alert('Неправильний файл.');
					$(this).dialog('close');
					return;
				}

				if (readPK(certPath, password) == true) {
					onKeyValid(dataToSign);
				}

				$(this).dialog('close');
			}
		}];

		var formContent = "";
		formContent += "<div class=\"password\">";
		formContent += "<form name=\"readPassword\" action=\"#\" class=\"readPassword\">";
		formContent += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">";
		formContent += "<tr><td valign=\"top\" align=\"left\" class=\"form\">Введiть пароль:";
		formContent += "<input class=\"input\" type=\"password\" name=\"password\"  id=\"password\" />";
		formContent += "</td></tr>";
		formContent += "</table>";
		formContent += "</form>";
		formContent += "</div>";
		var dialogId = classicDialog(DIALOG_TYPE_NONE, "Зчитування паролю", formContent, buttons, {
			width: 300,
			height: 200,
			autoOpen: true
		});
	}


	function onKeyValid(data) {
		var signDataDetach = $.parseJSON(makeSign(data));
		var signDataAttach = $.parseJSON(makeSignAttach(data));
		console.log('Detached sign:');
		console.log(signDataDetach);
		console.log('Attached sign:');
		console.log(signDataAttach);

		//var serial = signDataAttach.crt;
		//agreementService.getParticipant(
		//	serial,
		//	function (userInfoData) {
		//		showUserDetailsDialog(userInfoData, agreementID, data, signDataAttach.sign, signDataDetach.sign, serial);
		//	},
		//	function (userInfoData, status, xhr) {
		//		alert('Виникла помилка під час запиту даних про користувача.');
		//	}
		//);

		var vote = {
			AgreementID: agreementID,
			SignedData: signDataAttach.sign,
			Signature: signDataDetach.sign,
			CertificateType:'P_Certificate_Type_UACrypto'
		};		
		var agreementService = window.agreementService || new AgreementService();
		agreementService.vote(
			vote,
			function (voteData) {
				var message = '';
				if (voteData.ResultCode > 0) {
					message += 'Ваш голос  було зараховано.';
				}
				else {
					message += 'Сталася помилка. Ваш голос не було зараховано.\n\n';
					message += voteData.Message;
				}

				alert(message);

				$(this).dialog('close');
			},
			function (voteData, status, xhr) {
				debugger;
				alert('Сталася помилка під час спроби голосування. Ваш голос не було зараховано. Зверніться до адміністратора.');
			}
		);
	}


	// Наложение ЕЦП (возвращает только подпись)
	function makeSign(data) {
		return getApplet().Sign(data);
	}


	// Наложение ЕЦП (возвращает   подпись и данные)
	function makeSignAttach(data) {
		return getApplet().SignAttach(data);
	}


	// получаем путь к секретному ключу. Возврашает путь к ключу либо NULL
	function getPKPath() {
		return getApplet().getPKPath();
	}


	// Диалог выбора секретного ключа
	function openFileDialog() {
		return getApplet().openFileDialog();
	}


	// Список сертификатов
	function listCrt() {
		return getApplet().listCrt();
	}


	// Считывание секретного ключа
	function readPK(KeyFileName, pass) {
		return getApplet().readPK(KeyFileName, pass);
	}


	// Функция которая вызывается после старта апплета
	function onAppletInitialized() {
		console.log('UACrypto initialized');
		waitOverlay(false);
		if (signButton != null) signButton.show();
		if (onCryptoAppletInitializedCallback != null) onCryptoAppletInitializedCallback();
		isUACryptoInitialized = true;
	}


	return {
		InitializeCrypto: initializeCrypto,
		SignUaCrypto: sign,
		IsUaCryptoInitialized: isUaCryptoInitialized,
		OnAppletInitialized: onAppletInitialized
	};
};