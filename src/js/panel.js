function powitanie(){
	var powitanie = document.createElement('h2');
	powitanie.textContent="WITAJ" + " " + window.sessionStorage.getItem('login');
	document.getElementById('powitanie').appendChild(powitanie);

}

window.onload = function() {
 powitanie();
}

function nowyCel(){
window.location.href = "strona.html";
}

function wyswietlRezerwacje(){

	console.log(window.sessionStorage.getItem('id_pasazer'));
	
		
		 fetch('http://127.0.0.1:2004/wyswietlRezerwacje?id_pasazer='+ window.sessionStorage.getItem('id_pasazer'))
		 .then(resp => resp.json())
	    .then(resp => {
	    			if(resp.length > 0)
	                {
	                	var mojeRezerwacje = document.getElementById('mojeRezerwacje');
	                	mojeRezerwacje.style.display = "block";
						var content = "<table class='rezerwacje'><tr><th colspan='9'>MOJE REZERWACJE</th></tr>";
						content += '<tr><th> Z </th><th> Do </th><th> Wylot </th><th> Godzina </th><th> Przylot </th><th> Godzina </th><th> Usytuowanie </th><th> Miejsce </th><th> Koszt </th></tr>'

	                	resp.forEach(d => {       
	                	 
	                	 content += '<tr><td>'+ d.zrodlo +'</td><td>'+ d.cel +'</td><td>'+ d.data_odlotu.substring(0,10) +
	                	 '</td><td>'+ d.godzina_odlotu.substring(0,5) +'</td><td>'+ d.data_przylotu.substring(0,10) +'</td><td>'+ d.godzina_przylotu.substring(0,5) +
	                	 '</td><td>'+ d.usytuowanie +'</td><td>'+ d.id_miejsce +'</td><td>'+ d.koszt +'zł</td></tr>';
	                	
	                  });

	                fetch('http://127.0.0.1:2004/calkowityKoszt?id_pasazer='+ window.sessionStorage.getItem('id_pasazer'))
					 .then(resp => resp.json())
				    .then(resp => { 
				    	console.log(resp[0].suma);
				    	   		content += '<tfoot><tr><td colspan="9">CAŁKOWITY KOSZT '+ resp[0].suma +'zł</td></tr></tfoot>'; 

					    content += '</table>';
					    console.log(content);
					    mojeRezerwacje.innerHTML = content;
				    });


	  	 			} 
	  	 			else
					{
						var mojeRezerwacje = document.getElementById('mojeRezerwacje');
						mojeRezerwacje.style.display = "block";
						var content = '<p>Nie masz jeszcze żadnych rezerwacji. Zapraszamy do wybrania celu podróży!</p>';
						mojeRezerwacje.innerHTML = content;
					}
		});
	


}

function usunRezerwacje(){


  var wybranyLot = document.getElementsByName('lot');
  var lotDoUsuniecia;

  for (var i = 0, length = wybranyLot.length; i < length; i++)
  {		
     if (wybranyLot[i].checked)
     {
       lotDoUsuniecia = wybranyLot[i].value;

     	console.log("TU" + lotDoUsuniecia);
        break;
     }

}
}
