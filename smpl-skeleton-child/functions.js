function hide_service_desc() {
    var descs= document.getElementsByClassName("service-desc"),
        i = descs.length;
	
	while(i--) {
        descs[i].style.display = "none";
    }
	
	var headers= document.getElementsByClassName("services-navi"),
        i = headers.length;
	
	while(i--) {
        headers[i].style.color = "";
    }
		
}