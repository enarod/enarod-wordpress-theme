(function () {

    var scriptName = "enarod-petition-widget.js"; //name of this script, used to get reference to own tag
    var jQuery; //noconflict reference to jquery
    var jqueryPath = "http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"; 
    var jqueryVersion = "1.8.3";
    var scriptTag; //reference to the html script tag

	var baseUrl = "http://devb.enarod.org";

    /******** Get reference to self (scriptTag) *********/
    var allScripts = document.getElementsByTagName('script');
    var targetScripts = [];
    for (var i in allScripts) {
        var name = allScripts[i].src
    if(name && name.indexOf(scriptName) > 0)
        targetScripts.push(allScripts[i]);
    }

    scriptTag = targetScripts[targetScripts.length - 1];

    /******** helper function to load external scripts *********/
    function loadScript(src, onLoad) {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", src);

        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    onLoad();
                }
            };
        } else {
            script_tag.onload = onLoad;
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    }

    /******** helper function to load external css  *********/
    function loadCss(href) {
        var link_tag = document.createElement('link');
        link_tag.setAttribute("type", "text/css");
        link_tag.setAttribute("rel", "stylesheet");
        link_tag.setAttribute("href", href);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    }

    /******** load jquery into 'jQuery' variable then call main ********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== jqueryVersion) {
        loadScript(jqueryPath, initjQuery);
    } else {
        initjQuery();
    }

    function initjQuery() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    /******** starting point for your widget ********/
    function main() {
        jQuery(document).ready(function($){
			var petitionId = $(scriptTag).attr('data-id');
			
			/********* load CSS for petition **********/
			loadCss(baseUrl+"/wp-content/themes/smpl-skeleton-child/app/public/css/edem-widget.css");

            var jsonp_url = "http://dev.enarod.org/api/petition/"+petitionId;
            jQuery.getJSON(jsonp_url, function(result){

				if (result.ResultCode == 1){
					var widgetSize = $(scriptTag).attr('data-size');
					var petitionClass = 'enarod-pet-w-'+widgetSize;
					var container = $('#enarod-pet-id-'+petitionId);
					var timeLeft = setDaysLeft(result.Data.EffectiveTo);

					$(container)
					.append(addPetition(widgetSize, timeLeft, result))
					.addClass(petitionClass);
				}
            });


        });
    }


	function setDaysLeft (effectiveDate){
			var d, h, m, diff;
			var effectiveDate = new Date (effectiveDate);
			var currentDate = new Date();
			var timeLeft = {};
			var dateDiff = effectiveDate - currentDate;
			
			if ( dateDiff < 0 ){
				timeLeft.daysLeft = 0;
				timeLeft.hoursLeft = 0;
				timeLeft.minutesLeft = 0;
			}else{
				diff = dateDiff / 1000;
				d = Math.floor( diff/86400 );
				diff -= d * 86400;
				h = Math.floor( diff/3600 );
				diff -= h * 3600;
				m = Math.floor( diff/60 );
				diff -= m * 60;

				timeLeft.daysLeft = d;
				timeLeft.hoursLeft = h;
				timeLeft.minutesLeft = m;
			}

			return timeLeft;
	}


	function addPetition(widgetSize, timeLeft, data){
		var petitionText = '';
		if (widgetSize == 'lg' ){
			petitionText = "<div class='enarod-pet-text'>"+data.Data.Requirements.substr(0,300)+"...</dev>";
		}

		var petitionView = "<div id='enarod-pet-partner-logo'> \
							<a href='"+baseUrl+"/petition/#organization/"+data.Data.Organization.ID+"'> \
								<img src='"+baseUrl+"/"+data.Data.Organization.Logo+"'> </div> \
							</a> \
						<div id='enarod-pet-subject'><a target='_blank' href='"+baseUrl+"/petition/#petition/"+data.Data.ID+"'>"+data.Data.Subject+"</a></div>"+petitionText+" \
						<div id='enarod-pet-footer'> \
							<span>"+timeLeft.daysLeft+" днів "+timeLeft.hoursLeft+" годин "+timeLeft.minutesLeft+" хвилин </span> \
							<span> \
								<p id='enarod-pet-votes-collected'>"+data.Data.VotesCount+"</p><p>підписів зібрано </p> \
								<p id='enarod-pet-votes-left'>"+( data.Data.Level.Limit - data.Data.VotesCount )+"</p><p>залишилось зібрати </p> \
							</span> \
							<span> \
								<a target='_blank' href='"+baseUrl+"/petition/#petition/"+data.Data.ID+"/sign'> <img src='"+baseUrl+"/wp-content/themes/smpl-skeleton-child/app/images/sign.jpg'> </a> \
							<span> \
						</div>";

		return petitionView;

	}



    })();
