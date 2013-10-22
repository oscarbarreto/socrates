function validacionCode(idError){
	var errorAlert = (idError!=null && idError !="")?idError:"#errorMesage";
	code = document.getElementById("code").value;
	if( code == null || code.length == 0 || /^\s+$/.test(code) ) {
		$(errorAlert).empty();
		$(errorAlert).html('El campo Codigo no puede estar vacio');
	} else {
		codeTag(code);
	}
};

function codeQR(idError){
	var scanner = window.plugins.barcodeScanner;
	var errorAlert = (idError!=null && idError !="")?idError:"#alertWindow";
   	scanner.scan(
		function (result) {
			var x = result.text.lastIndexOf('/')
			var idRecord = result.text.substring(x+1);
			$.ajax({
          		url: "http://192.168.190.166/socratesprueba/mobile/quizQR?callback=?",
   	    		type: "GET",
	    		dataType: 'json',
	   	    	data: {"idrecord":idRecord},
		    	success: function(data){
					dataRequest(data);
        		},
	    		error: function(){
	    			notificationAlert(errorAlert, "#messageAlert", "Ocurrio un problema, intentelo nuevamente");
	    		}
			});
		}, 
		function (error) {
			notificationAlert(errorAlert, "#messageAlert", "No se pudo obetener código QR");
		});
};


function codeTag(code){
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/quiz?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"code":code},
	    success: function(data){
	    	dataRequest(data);
        },
	    error: function(){
	    	document.getElementById("code").value = '';
			$("#errorMesage").empty();
			$("#errorMesage").html('Ocurrio un problema,intentelo nuevamente');
	    }
		
   	});

};

function dataRequest(data){
	if (data.id!=0){
		if (window.localStorage.getItem('iduser') == null){
			window.localStorage.setItem("iduser",0);
		}
		window.localStorage.setItem("idquiz",data.id);
		window.localStorage.setItem("questions",JSON.stringify(data));
		window.location.replace("question.html");
	} else {
		document.getElementById("code").value = '';
		$("#errorMesage").empty();
		$("#errorMesage").html('La encuesta no esta disponible');
	}
};

function printQuestion(){
	if (window.localStorage.getItem('questions')!=null){
		var modalConfirm ='<div id="confirmWindow" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Terminar Encuesta</h4></div><div class="modal-body"><p>¿Esta segura que quiere neviar sus respuestas y terminar la encuesta?</p></div><div class="modal-footer"><a href="#" class="btn btn-default" data-dismiss="modal">Cancelar</a><a href="#" class="btn btn-primary" onClick="sentData();">Confirmar</a></div></div></div></div>';
		var footer = '<ul class="nav navbar-nav col-xs-12"><li id="backButton" class="text-center col-xs-6"><a href="#contentQuestions" class="btn disabled" id="back" onClick="positionPage(false)"><strong>Atras</strong></a></li><li id="nextButton" class="text-center col-xs-6"><a href="#contentQuestions" id="next" class="btn disabled" onClick="positionPage(true)"><strong>Siguiente</strong></a></li></ul>';
		var dataQuestion = window.localStorage.getItem('questions');
		window.localStorage.removeItem("questions");
		var html = insertHTML(JSON.parse(dataQuestion));		
	} else if(window.localStorage.getItem('quiz')!=null){
		var modalConfirm ='<div id="confirmWindow" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Cerrar Sesíon</h4></div><div class="modal-body"><p>¿Esta seguro que quiere cerrar sesíon?</p></div><div class="modal-footer"><a href="#" class="btn btn-default" data-dismiss="modal">Cancelar</a><a href="#" class="btn btn-primary" data-dismiss="modal" onClick="logoutSession();">Salir</a></div></div></div></div><div id="codeWindow" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><div class="form-group"><label for="code">Ingrese Codigo:</label><input name="code" id="code" value="" type="text" class="form-control"></div></div><div class="modal-footer"><a href="#" class="btn btn-default" data-dismiss="modal">Volver</a><a href="#" class="btn btn-primary" data-dismiss="modal" onclick="validacionCode();">Continuar</a></div></div></div></div>';
		var footer = '<ul class="nav navbar-nav col-xs-12"><li class="text-center col-xs-6"><a href="#" onClick="codeQR();"><strong>QR</strong></a></li><li class="text-center col-xs-6"><a href="#codeWindow" data-toggle="modal"><strong>Codigo</strong></a></li></ul>';
		var dataQuestion = window.localStorage.getItem('quiz');
		window.localStorage.removeItem("quiz");
		var html = questionList(JSON.parse(dataQuestion));
	}
	var footerPage = $(footer);
	var modalPage = $(modalConfirm);
	var pagina = $( html );
	pagina.appendTo("#contentQuestions");
	footerPage.appendTo("#footerQuestion");
	modalPage.appendTo("body");
}

function insertHTML(data){
	var html = '<legend><h2>'+data.name+'</h2></legend><input type="hidden" name="numberQuestions" id="numberQuestions" value="' + data.questions.length +'"/><input type="hidden" name="position" id="position" value="0"/>';
		for(var i=0;i<data.questions.length;i++){
			var temp = data.questions[i].type=='0'?'radio':'checkbox';
			var aux = i==0?"block":"none";
			html += '<div id="'+ i +'" style="display:'+ aux +'" class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+data.questions[i].name+'</h3><small>' + data.questions[i].help + '</small></div><div class="panel-body"><fieldset>';
			for (var j=0; j<data.questions[i].alternatives.length; j++){
				html += '<div class="'+ temp +'"><label><input type="'+ temp +'" name="'+ i +'" id="' + data.questions[i].alternatives[j].id + '" value="' + data.questions[i].alternatives[j].id + '" onclick="selectOption('+ i +');">' + data.questions[i].alternatives[j].name+'</label></div>';
			};
			html += '</fieldset>';
			if ( data.questions[i].image.length>40 ){	
				html += '<img width="100%" src="' + data.questions[i].image + '">';
			};
			html += '</div></div><br>';
		};
		return html;
};

function positionPage(data){
	numberQuestions = document.getElementById("numberQuestions").value;
	positionQuestion = document.getElementById("position").value;
	
	if (parseInt(positionQuestion) == parseInt(numberQuestions)-1 && data){
		$('#confirmWindow').modal('show')
	} else {
		divView = document.getElementById(positionQuestion);
		backButton = document.getElementById('back');
		divView.style.display = "none";
		if(parseInt(positionQuestion) == parseInt(numberQuestions)-2 && data){
			var text = '<strong>Finalizar</strong>';
			document.getElementById('next').innerHTML = text;
		} else if (parseInt(positionQuestion) == parseInt(numberQuestions)-1 && !data){
			var text = '<strong>Siguiente</strong>';
			document.getElementById('next').innerHTML = text;
			
		}
		if(parseInt(positionQuestion) == 1 && !data){
			var textClass = "btn disabled";
			backButton.className = textClass;
		} else if (parseInt(positionQuestion) == 0 && data){
			var textClass = "btn";
			backButton.className = textClass;
		}
		positionQuestion = data ? parseInt(positionQuestion) +1: parseInt(positionQuestion) -1;
		document.getElementById("position").value = positionQuestion;
		divView = document.getElementById(positionQuestion.toString());
		divView.style.display = "block";
		selectOption(positionQuestion);
	}
	
};

function sentData(){
	var idUser = window.localStorage.getItem('iduser');
	var idQuiz = window.localStorage.getItem("idquiz");
	numberQuestions = document.getElementById("numberQuestions").value;
	var idAlternative='';
	var temp;
	var k = 0;
	for(var i=0;i<parseInt(numberQuestions);i++){
		var idQuestion = 'q' + i;
		alternativeElemnt = document.getElementsByName(i);
		for (var j=0;j < alternativeElemnt.length;j++){
			if(alternativeElemnt[j].checked){
				temp = k!=0?',':'';
				idAlternative += temp + alternativeElemnt[j].value;
				k++;
			}
		}
	}
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/save?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"idencuesta":idQuiz,"answers":idAlternative,"iduser":idUser},
	    success: function(data){
			if(data.id == '1'){
				$('#confirmWindow').modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
	    		window.localStorage.removeItem("idquiz");
	    		if ($('#code').length) {
 					document.getElementById("code").value = '';
				}
	    		var html = '<h2>Ha terminado la encuesta</h2><div><a href="#" onclick="loginSession();">Regresar</a></div>';
	    		$('#footerQuestion').empty();
	    		$('#contentQuestions').empty();
	    		var pagina = $( html );
				pagina.appendTo("#contentQuestions");
	    	} else {
	    		notificationAlert('#alertWindow');
	    	}	
	    },
	    error: function(){
	    	notificationAlert('#alertWindow');
	    }
	});
};

function selectOption(data){
	var temp = false;
	var textClass;
	alternativeElemnt = document.getElementsByName(data);
	for (var j=0;j < alternativeElemnt.length;j++){
		if(alternativeElemnt[j].checked){
		temp = true;
		}
	}
	textClass = temp?"btn":"btn disabled";
	nextButton = document.getElementById('next');
	nextButton.className = textClass;
};

function notificationAlert(idN,messageAlertN, messageN){
	if (messageAlertN != '' && messageAlertN != null){
		$(messageAlertN).empty();
		$(messageAlertN).html(messageN);
	}
	$(idN).modal('show');
};

function questionList(data){
	var activateStatus =  parseInt(data[0].status) ==1?"block":"none";
	var stopStatus = parseInt(data[0].status) ==2?"block":"none";
	var fecha =  new Date(data[0].date*1000);
	var mes = parseInt(fecha.getMonth())+1;
	var dia = fecha.getDate()+"/" + mes.toString()+"/"+ fecha.getFullYear();
	var html = '<legend><div class="btn-group pull-right"><a href="#" class="btn btn-primary" id="activeQuiz" style="display:'+ activateStatus +'" onclick="statusChange('+ data[0].id +', true);">Activar</a><a href="#" id="stopQuiz" class="btn btn-primary" style="display:'+ stopStatus +'" onclick="statusChange('+ data[0].id +',false);">Terminar</a></div><h2>'+data[0].name+'</h2><p>'+dia+'</p></legend><div class="panel-group" id="accordion">';
	if (data[0].questions.length>0){
		for(var i=0;i<data[0].questions.length;i++){
			var x = 97;
			html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#'+i+'"><p>'+data[0].questions[i].name +'</p><small>' + data[0].questions[i].help + '</small></a></h4></div><div id="'+i+'" class="panel-collapse collapse in"><div class="panel-body">';
			for (var j=0; j<data[0].questions[i].alternatives.length; j++){
				textAux =  data[0].questions[i].alternatives[j].correct ==1 ? " &#10004;":""
				html += '<p>'+ String.fromCharCode(x)+') ' + data[0].questions[i].alternatives[j].name+'  <span style="color:#3ADF00;">'+textAux+' </span></p>';
				x++;
			};
			html += '</div><div data-role="fieldcontain">';
			if ( data[0].questions[i].image.length>40 ){	
				html += '<img width="100%" src="' + data[0].questions[i].image + '">';
			};
			html += '</div></div></div>';
		};
		html+='<br><br><br></div>'
	} else {
		html += '<div><h3>La encuesta no tiene preguntas</h3><a href="#" data-role="button" onclick="loginSession();">Ir a encuestas</a></div>';
	}
	return html;
};

function statusChange(idQuiz, actionQ){
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/status?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"idencuesta":idQuiz,"status":status},
	    success: function(data){
			if(data.id == '1'){
				var styleActivate = actionQ?"none":"block";
				var status = actionQ?2:1;
				var styleStop = !actionQ?"none":"block";
				stopQuiz = document.getElementById("stopQuiz");
				stopQuiz.style.display = styleStop;
				startQuiz = document.getElementById("activeQuiz");
				startQuiz.style.display = styleActivate;
	    	} else {
	    		$("#errorMesage").empty();
				$("#errorMesage").html('Los datos no han sido guardados intentelo nuevamente');
	    	}	
	    },
	    error: function(){
	    	$("#errorMesage").empty();
			$("#errorMesage").html('Los datos no han sido guardados intentelo nuevamente');
	    }
	});
};