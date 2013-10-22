function validacion(){
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	var temp = true
	inputEmail = document.getElementById("emailDiv");
	inputPass = document.getElementById("passDiv");
	if( email == null || email.length == 0 || /^\s+$/.test(email) ) {
		inputEmail.setAttribute("class","form-group has-error");
		$("#emailError").empty();
		$("#emailError").html('El campo Correo PUCP no puede estar vacío');
		temp = false;
	} else if( !(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+/).test(email) ) {
  		$("#emailError").empty();
		$("#emailError").html('No es un correo válido');
		inputEmail.setAttribute("class","form-group has-error");
		temp = false;
	} else {
		inputEmail.setAttribute("class","form-group");
		$("#emailError").empty();
	}
	if( password == null || password.length == 0 || /^\s+$/.test(password) ) {
  		$("#passwordError").empty();
		$("#passwordError").html('El campo Contraseña no puede estar vacío');
		inputPass.setAttribute("class","form-group has-error");
		temp =  false;
	} else {
		inputPass.setAttribute("class","form-group");
		$("#passwordError").empty();
	}
	if (temp){ 
		idUserTag(email,password);
	}
}; 


function idUserTag(email,password){

	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/login?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"user":email,"pass":password},
	    success: function(data){
	    	if (data.id!=0){
	    		window.localStorage.setItem("iduser",data.id);
	    		window.localStorage.setItem("name",data.name);
	    		window.localStorage.setItem("lastname",data.lastname);
	    		window.localStorage.setItem("email",data.email);
	    		window.location.replace("quizlist.html");
		    } else {
		    	notificationAlert('#alertWindow', "#messageAlert", "El campo Correo PUCP o Contraseña es incorrecto");
	    	}
        },
	    error: function(){
	    	notificationAlert('#alertWindow', "#messageAlert", "El campo Correo PUCP o Contraseña es incorrecto");
	    }
		
   	});

};

function loginSession(){
 	if(checkLocalStorageSupport()){
 		var idUser = window.localStorage.getItem('iduser');
 		 if(idUser != null && idUser != 0){
 			window.location.replace("quizlist.html");
 		} 
 	} else {
 		window.openDatabase('Socrates', '1.0', 'Socrates', 200000);
 	}
};

function logoutSession(){
	window.localStorage.removeItem("iduser");
	window.localStorage.removeItem("name");
	window.localStorage.removeItem("lastname");
	window.localStorage.removeItem("email");
	window.location.replace("index.html");
};

/*document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        loginSession();
    }
*/
function checkLocalStorageSupport() {
	try {
		return 'localStorage' in window && window['localStorage'] != null;
	} catch (e) {
		return false;
	}
}
