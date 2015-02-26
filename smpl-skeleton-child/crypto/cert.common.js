$(document).ready(function () {

	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});

	$('.scrollup').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});
});

var appletSelector = "#cryptoApplet";

var DIALOG_TYPE_NONE = null;
var baseUrl = window.baseUrl || '';
var agreementID = window.agreementID || -1;
var agreementService = new AgreementService();

var signButton = null;
var selectData = null;


function waitOverlay(show) {
	console.log('Overlay show: ' + show);
	if (show) {
		var overlayHTML = "" +
            "<div id='overlayLoader' class='ui-corner-all ' style='border: 1px solid #CDCDCD; height:60px; width:300px; background-color: #F4F4F4; display:none; z-index: 100001;' >" +
            "<table cellpadding='4' cellspacing='0' width=100%'>" +
            "<tr>" +
            "<td align='center'>" +
            "<img src='" + baseUrl + "ajax-loader.gif'/>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td align='center'>" +
            "Зачекайте" +
            "</td>" +
            "</tr>" +
            "</table>" +
            "</div>";
		$("body").append(overlayHTML);
		center($("#overlayLoader")).show();
	} else {
		$("#overlayLoader").remove();
	}
}

function center(objSelector) {
	var obj = $(objSelector);
	obj.css("position", "absolute");
	obj.css("top", (($(window).height() - obj.outerHeight()) / 2) + $(window).scrollTop() + "px");
	obj.css("left", (($(window).width() - obj.outerWidth()) / 2) + $(window).scrollLeft() + "px");
	return obj;
};

function OnAppletCreated() {
	console.log('applet created');

	var cert = window.cert;
	if (cert != null) {
		cert.OnAppletInitialized();
	}
}


// Catch DPA exceptions from crypto applet
function handleException(param1, param2) {
	console.log('ERROR OCCURED!!!');
	console.log('Param1:');
	console.log(param1);
	console.log('Param2:');
	console.log(param2);

	waitOverlay(false);
	
	if (param2 == null) {
		// UACrypto
		var error = param1;
		switch (error) {
		case "ERROR_LOAD_UACRYPTO_LIB":
			alert("На вашому комп'ютері не встановлені бібліотеки UACrypto");
			break;
		case "ERROR_READ_CONFIG":
			alert("Помилка зчитування налаштувань UACrypto");
			break;
		case "ERROR_READ_PK":
			alert("Невірний пароль доступу до сертифiкатiв або сертифікат пошкоджено!");
			break;
		default:
			alert("Помилка! " + error);
			break;
		}
	} else {
		var libraryName = param1;
		var exceptionClassName = param2;

		switch (libraryName) {
			case "ivk":
				switch (exceptionClassName) {
					case "LibraryNotInitializedException":
						alert("На вашому комп'ютері не встановлені бібліотеки ІВК");
						break;
					case "PrivateKeyLoadError":
						DO_SIGN = false;
						alert("Помилка при зчитуванні особистого ключа (Ключ пошкоджено або невірний пароль)");
						break;
				}
				break;
		}
	}
}


// Получение аплета
var getApplet = function () {
	return $(appletSelector).children("applet").first()[0];
};