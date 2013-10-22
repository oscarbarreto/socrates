function quizList(){
	var idUser = window.localStorage.getItem('iduser');
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/list?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"iduser":idUser},
	    success: function(data){    
			if(data.length != 0){	    
	    		var html = insertList(data);
	    		pagina = $( html );
	    		pagina.appendTo("#contentQuiz");
	    	} else {
	    		var html = '<br><h2>No tiene ha creado ninguna encuesta</h2>';
	    		pagina = $( html );
	    		pagina.appendTo("#contentQuiz");
	    	}
	    },
	    error: function(){
	    	notificationAlert('#alertWindow', "#messageAlert", "Problemas con el servidor. Intentelo nuevamente");
			var html = '<a href="#" class="btn btn-primary btn-block" onClick="quizList()">Resfrescar</a>';
			pagina = $( html );
	    	pagina.appendTo("#contentQuiz");
	    }
	});
	
};

function insertList(data){
	var html = '<h2>Encuestas:</h2><div class="container list-group">';
	for(var i=0;i < data.length;i++){
		if (parseInt(data[i].status)!=0){
			var color = parseInt(data[i].status) ==2?'success':'warning';
			var fecha =  new Date(data[i].date*1000);
			var mes = parseInt(fecha.getMonth())+1;
			var dia = fecha.getDate()+"/" + mes.toString()+"/"+ fecha.getFullYear();
			var status = parseInt(data[i].status) ==2?'En proceso':' Terminada';
			html += '<a href="#" class="list-group-item active" onClick="quizData('+ data[i].id +');"><span class="label label-'+ color +' pull-right">'+ status +'</span><h4 class="list-group-item-heading">' + data[i].name + '</h4><p class="list-group-item-text">'+dia+'</p></a>';
		}
	};
	html += '</div>';
	return html;
};

function quizData(id){
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/detail?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"idquiz":id},
	    success: function(data){
	    	window.localStorage.setItem("quiz",JSON.stringify(data));
		    window.location.replace("question.html");
        },
	    error: function(){
	    	notificationAlert('#alertWindow', "#messageAlert", "Intentelo nuevamente");
	    }
		
   	});
};



