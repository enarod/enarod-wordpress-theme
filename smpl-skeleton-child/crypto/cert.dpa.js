var certDpa = function () {
	var DO_SIGN = true;

	var onDpaAppletInitialized = null;
	var appletSelector = "#cryptoApplet";
	var isDpaInitialized = false;


	var initializeDpa = function (button, selectDataFunction, appletInitializedCallback, service) {
		console.log('Initializing DPA');
		waitOverlay(true);

		signButton = button;
		selectData = selectDataFunction;
		onDpaAppletInitialized = appletInitializedCallback;
		baseUrl = window.baseUrl || '';
		agreementService = service;

		if (signButton != null) signButton.hide();
		if (!isDpaInitialized) {
			console.log('creating new DPA applet');
			createDpaApplet("ivk", "OnAppletCreated");
		}
	};


	////// Получение аплета
	////var getApplet = function() {
	////	return $(appletSelector).children("applet").first()[0];
	////};


	function createDpaApplet(libraryName, callBackFunction) {
		var applet = $(appletSelector);
		if (applet.length == 0) {
			$("body").append('<div id="cryptoApplet"></div>');
		}

		var appletHtml = "<applet id='DPA' width='1' height='1' archive='" + baseUrl + "Applets/DPA/EUSignJava.jar, " + baseUrl + "Applets/DPA/CryptographyApplet.jar' code='uacrypto.cryptography.CryptographyApplet'>" +
			"<param name='libraryName' value='" + libraryName + "'/>" +
			"<param name='callBackFunction' value='" + callBackFunction + "'/>" +
			"</applet>";
		$(appletSelector).html(appletHtml);
	}


	var sign = function () {
		var Data = selectData();

		var buttons = [{
			text: 'Закрити',
			'class': 'dialog_close_btn',
			click: function () {
				$(this).dialog('close');
			}
		}, {
			text: 'Пiдписати',
			'class': 'dialog_ok_btn',
			click: function () {
				DO_SIGN = true;
				EndUserKey(
					document.forms.keyMedia.deviceTypeSelect.value,
					document.forms.keyMedia.deviceNameSelect.value,
					document.forms.keyMedia.passwordEdit.value);
				if (DO_SIGN) {
					var signDataInt = signExt(Data);
					var signDataExt = signInt(Data);

					console.log('Sign int:');
					console.log(signDataInt);
					console.log('Sign ext:');
					console.log(signDataExt);

					////showUserDetailsDialog(null, agreementID, Data, signDataInt, signDataExt, null);

					var vote = {
						AgreementID: agreementID,
						SignedData: signDataExt,
						Signature: signDataInt,
						CertificateType: 'P_Certificate_Type_DPA'
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

				$(this).dialog('close');
			}
		}];

		var formContent = "";
		formContent += "<div class=\"formKeyMedia\">";
		formContent += "<form name=\"keyMedia\" action=\"#\" class=\"formKeyMedia\">";
		formContent += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">";
		formContent += "<tr><td valign=\"top\" align=\"left\" class=\"form\">";
		formContent += "   <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">";
		formContent += "   <tr><td valign=\"top\" align=\"left\" style=\"padding: 10px 0px 5px 0px\">Тип носія:</td></tr>";
		formContent += "   <tr><td valign=\"top\" align=\"left\">";
		formContent += "   <select name=\"deviceTypeSelect\" class=\"select\" onchange=\"window.cert.GetDeviceNames();\">";

		var result = "";
		var typeIndex = 0;
		while (true) {
			result = EnumKeyMediaTypes(typeIndex);
			if (result == "")
				break;
			formContent += "<option value=\"" + typeIndex + "\">" + result + "</option>";
			typeIndex++;
		}

		formContent += "   </select>";
		formContent += "   </td></tr>";
		formContent += "   <tr><td valign=\"top\" align=\"left\" style=\"padding: 20px 0px 5px 0px\">Назва носія:</td></tr>";
		formContent += "   <tr><td valign=\"top\" align=\"left\"><div id=\"divDevNames\">";
		formContent += "   </div></td></tr>";
		formContent += "   <tr><td valign=\"top\" align=\"left\" style=\"padding: 20px 0px 5px 0px\">Пароль:</td></tr>";
		formContent += "   <tr><td valign=\"top\" align=\"left\"><input type=\"Password\" name=\"passwordEdit\" class=\"edit\" maxlength=\"20\"></td></tr>";
		formContent += "   </table>";
		formContent += "</td></tr>";
		formContent += "</table>";
		formContent += "</form>";
		formContent += "</div>";
		var dialogId = classicDialog(DIALOG_TYPE_NONE, "Зчитування особистого ключа", formContent, buttons, {
			width: 480,
			height: 400,
			autoOpen: true
		});

		document.forms.keyMedia.passwordEdit.disabled = true;
		$('.dialog_ok_btn').hide();
	};
	

	function EndUserKey(typeIndex, deviceIndex, password) {
		// Считываем ключ
		return getApplet().EndUserKey(typeIndex, deviceIndex, password);
	}


	function signExt(Data) {
		// Вызываем функцию подписания блока данных
		var applet = getApplet();
		console.log(applet);
		return applet.sign(Data);
	}


	function signInt(Data) {
		// Вызываем функцию подписания блока данных
		return getApplet().signInternal(Data);
	}


	var onDpaInitialized = function() {
		console.log('DPA initialized');
		waitOverlay(false);
		isDpaInitialized = true;

		if (onDpaAppletInitialized != null) onDpaAppletInitialized();
		$("#dialog-settings").show();
		$("#dialog-sign").show();
	};


	var getDeviceNames = function() {
		var formContent = "";
		var typeIndex = 0;
		var deviceIndex = 0;
		formContent += "   <select name=\"deviceNameSelect\" class=\"select\">";
		typeIndex = document.forms.keyMedia.deviceTypeSelect.value;

		while (true) {
			result = EnumKeyMediaDevices(typeIndex, deviceIndex);
			if (result == "")
				break;
			formContent += "<option value=\"" + deviceIndex + "\">" + result + "</option>";
			deviceIndex++;
		}

		formContent += "   </select>";
		$('#divDevNames').html(formContent);

		if (deviceIndex < 1) {
			document.forms.keyMedia.deviceNameSelect.disabled = true;
			document.forms.keyMedia.passwordEdit.disabled = true;
			$('.dialog_ok_btn').hide();
		} else {
			document.forms.keyMedia.deviceNameSelect.disabled = false;
			document.forms.keyMedia.passwordEdit.disabled = false;
			$('.dialog_ok_btn').show();
		}
	};


	var EnumKeyMediaDevices = function(typeIndex, deviceIndex) {
		// Получаем список устройств
		var applet = window.cert.GetApplet();
		return applet.EnumKeyMediaDevices(typeIndex, deviceIndex);
	};


	var EnumKeyMediaTypes = function(typeIndex) {
		// Получаем типы устройств
		var applet = window.cert.GetApplet();
		return applet.EnumKeyMediaTypes(typeIndex);
	};


	return {
		InitializeDPA: initializeDpa,
		SignDpa: sign,
		OnAppletInitialized: onDpaInitialized,
		GetApplet: getApplet,
		GetDeviceNames: getDeviceNames
	};
};