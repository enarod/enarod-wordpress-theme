function showUserDetailsDialog(user, agreementID, agreementText, aggrementHash, signatureHash, thumbPrint) {
	var html =
	'<div id="personal-info" class="" >' +
	'<form action="" id="registration-form" class="form-horizontal">' +
	'<div class="form-group">' +
	'<div class="control-group">' +
       '<label class="control-label">Ім`я</label>' +
       '<div class="controls">' +
           '<input id="FirstName" name="firstName" data-validation="length alphanumeric" ' +
         'data-validation-length="3-12" data-validation-error-msg="Ім\'я має містити тільки цифри та літери, від 3 до 12 символів">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">Прізвище</label>' +
       '<div class="controls">' +
           '<input id="LastName" name="lastName" data-validation="length alphanumeric"' +
		 'data-validation-length="3-12" data-validation-error-msg="Прізвище має містити тільки цифри та літери, від 3 до 12 символів">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">По-батькові</label>' +
       '<div class="controls">' +
          '<input id="MiddleName" name="middleName" data-validation="length alphanumeric"' +
		 'data-validation-length="3-12" data-validation-error-msg="По-батькові має містити тільки цифри та літери, від 3 до 12 символів">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">Серія та номер паспорта</label>' +
       '<div class="controls">' +
          '<input id="Passport" name="passport" data-validation="length alphanumeric"' +
		'data-validation-length="8-8" data-validation-error-msg="Паспорт має містити дві букви та шість цифр">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">Дата народження</label>' +
       '<div class="controls">' +
          '<input id="DateOfBirth" name="birth" data-validation="birthdate"' +
		 'data-validation-help="yyyy-mm-dd"' +
		 ' data-validation-error-msg="Не правильно вказана дата. Вам має бути більше 18 років">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">Ідентифікаційний код</label>' +
       '<div class="controls">' +
          '<input id="TaxID" name="taxId" data-validation="number"' +
          ' data-validation-error-msg="Мають бути тільки цифри">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">Адреса реєстрації</label>' +
       '<div class="controls">' +
          '<input id="Address" name="address" data-validation="ukrainiancity"' +
          ' data-validation-error-msg="Така адреса не знайдена">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
       '<label class="control-label">Телефон</label>' +
       '<div class="controls">' +
          '<input id="Phone" name="phone" data-validation="number"' +
          ' data-validation-error-msg="Мають бути тільки цифри">' +
       '</div>' +
    '</div>' +
     '<div class="control-group">' +
       '<label class="control-label">Електронна пошта</label>' +
       '<div class="controls">' +
          '<input id="Email" name="email" data-validation="email"' +
          ' data-validation-error-msg="Неправильно вказана пошта">' +
       '</div>' +
    '</div>' +
    '<div class="control-group">' +
	'<div class="agree-term">' +
        '<input type="checkbox" id="termsOfUse" data-validation="required"' +
		 'data-validation-error-msg="Ви маєте погодитись на наші умови">' +
      'Я приймаю <a href="/terms" target="_blank">умови користування системою</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
  '</form>' +
  '</div>';

	var dialogId = classicDialog(
		DIALOG_TYPE_NONE,
		"Введіть дані",
		html,
		[{
			text: 'Проголосувати',
			'class': 'dialog_ok_btn',
			click: function () {
				// collect user data:
				var vote = constructVote(agreementID, agreementText, aggrementHash, signatureHash, thumbPrint);
				var agreementService = window.agreementService || new AgreementService();
				agreementService.vote(
					vote,
					function (voteData) {
						var message = '';
						if (voteData.ID != 0) {
							message += 'Сталася помилка. Ваш голос не було зараховано.\n\n';
						}
						message += voteData.Response;
						alert(message);

						$(this).dialog('close');
					},
					function (voteData, status, xhr) {
						debugger;
						alert('Сталася помилка. Ваш голос не було зараховано.');
					}
				);
			}
		}],
		{
			width: 500,
			height: 630,
			autoOpen: true,
			openCallback: function () {
				console.log('User form opened.');

				// TODO: fix validation on prod:
				//$.validate({
				//	form: '#registration-form',
				//	modules: 'location, date, security',
				//	onModulesLoaded: function () {
				//		$('#Address').suggestUkrainianCity();
				//	}
				//});

				$('.ui-dialog-buttonpane .dialog_ok_btn').button('disable');
				$('#termsOfUse').change(function () {
					if (this.checked) {
						$('.ui-dialog-buttonpane .dialog_ok_btn').button('enable');
					} else {
						$('.ui-dialog-buttonpane .dialog_ok_btn').button('disable');
					}
				});
				if (user != null) {
					setUserInfo(user);
				}
			}
		});

	//$.validate({
	//	form : '#registration-form',
	//	modules : 'location, date, security',
	//	onModulesLoaded : function() {
	//		$('#Address').suggestUkrainianCity();
	//	}
	//});
}


function constructVote(agreementID, agreementText, aggrementHash, signatureHash, thumbPrint) {
	var vote = {
		Agreement: {
			ID: agreementID
		},
		Participant: {
			FirstName: $('#FirstName').val(),
			LastName: $('#LastName').val(),
			MiddleName: $('#MiddleName').val(),
			TaxID: $('#TaxID').val(),
			Passport: $('#Passport').val(),
			DOB: $('#DateOfBirth').val(),
			adress: {
				ID: -1,
				Country: '',
				ZIPCode: '',
				City: '',
				Street: $('#Address').val(),
				Building: '',
				Flat: '',
				Actual: true
			},
			contact: {
				ID: -1,
				Phone: $('#Phone').val(),
				WorkPhone: '',
				CellPhone: '',
				email: $('#Email').val(),
				Actual: true
			}
		},
		AgreementText: agreementText,
		AgreementHash: aggrementHash,
		SignatureHash: signatureHash,
		CertificateThumbPrint: thumbPrint,
		Issuer: 1,
		CreatedDate: new Date()
	};

	return vote;
}


function setUserInfo(user) {
	$('#FirstName').val(user.FirstName);
	$('#LastName').val(user.LastName);
	$('#MiddleName').val(user.MiddleName);
	$('#TaxID').val(user.TaxID);
	$('#Passport').val(user.Passport);
	$('#DateOfBirth').val(user.DOB);
	$('#Address').val(user.adress == null ? '' : user.adress.Street);
	$('#Phone').val(user.contact == null ? '' : user.contact.Phone);
	$('#Email').val(user.contact == null ? '' : user.contact.email);
}


function classicDialog(dType, dTitle, dHtml, dButtons, dOptions) {
	var dialogId = "dialog-" + new Date().getTime();

	var dialogHtml = null;
	if (dType == DIALOG_TYPE_NONE) {
		dialogHtml = "<div id='" + dialogId + "' class='ui-widget' title='" + dTitle + "' style='display:none'>" +
            "<div id='" + dialogId + "-text'>" + dHtml + "</div>" +
            "</div>";
	}

	$("body").append(dialogHtml);
	if (dOptions == undefined)
		dOptions = {};

	var closeCallback = (dOptions["closeCallback"] != undefined) ? dOptions["closeCallback"] : function () { };
	var openCallback = (dOptions["openCallback"] != undefined) ? dOptions["openCallback"] : function () { };
	
	$("#" + dialogId).dialog({
		autoOpen: false,
		height: (dOptions["height"] != undefined) ? dOptions["height"] : undefined,
		width: (dOptions["width"] != undefined) ? dOptions["width"] : undefined,
		modal: (dOptions["modal"] != undefined) ? dOptions["modal"] : true,
		close: function () {
			$("#" + dialogId).html("");
			$("#" + dialogId).remove();
			closeCallback();
		},
		open: function() {
			openCallback();
		},
		buttons: dButtons
	});

	var autoOpen = (dOptions["autoOpen"] != undefined) ? dOptions["autoOpen"] : true;
	
	if (autoOpen) {
		classicDialogOpen(dialogId);
	}
	return dialogId;
}


function classicDialogOpen(dialogId) {
	$("#" + dialogId).dialog("open");
}
