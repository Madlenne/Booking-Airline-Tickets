
function parametryLotu(){



  fetch('http://127.0.0.1:2004/usytuowanie?id_miejsce=' + window.sessionStorage.getItem("id_miejsce"))
  .then(resp => resp.json())
    .then(resp => {

          console.log(resp);
          console.log("usytuowanie: " + resp[0].usytuowanie);
          window.sessionStorage.setItem("usytuowanie", resp[0].usytuowanie);



      fetch('http://127.0.0.1:2004/nazwaKlasy?id_miejsce=' + window.sessionStorage.getItem("id_miejsce"))
	  .then(resp => resp.json())
	    .then(resp => {

	          console.log(resp);
	          console.log("nazwaKlasy: " + resp[0].rodzaj);
	          window.sessionStorage.setItem("rodzajKlasy", resp[0].rodzaj);

	          var fin = document.getElementById("fin");


   fin.innerHTML = "WYBRANY LOT " + "<br><font color='#fbc60d'>Z: </font>" + window.sessionStorage.getItem('lotniskoZrodlowe')+" <br><font color='#fbc60d'>Do: </font>"+window.sessionStorage.getItem('lotniskoDocelowe')+
  						"<br><font color='#fbc60d'>Data i godzina wylotu: </font><br>"+window.sessionStorage.getItem('wybranyDzien') + "-" + window.sessionStorage.getItem('miesiac') + "-" + window.sessionStorage.getItem('rok') + 
  						" "+ window.sessionStorage.getItem('godzinaOdlotu')+"<br><font color='#fbc60d'>Data i godzina przylotu: </font><br>"+window.sessionStorage.getItem('dzienPrzylotu')+ "-" + window.sessionStorage.getItem('miesiac') + "-" + window.sessionStorage.getItem('rok')+
  						" " + window.sessionStorage.getItem('godzinaPrzylotu') + "<br><font color='#fbc60d'>Twoje miejsce w klasie: </font><br>" + window.sessionStorage.getItem('rodzajKlasy') + "<br>" + " <font color='#fbc60d'>Usytuowanie: </font>" + window.sessionStorage.getItem('usytuowanie') 
  						+ "<br><font color='#fbc60d'>Nr miejsca: </font>" +window.sessionStorage.getItem('id_miejsce') + "<br><font color='#fbc60d'>Całkowity koszt lotu: </font>" + window.sessionStorage.getItem('kwota') + "zł"
  						+ "<br><button class='zaplac' onclick='zaplac()'>Zapłać</button>";


	    });
    });

	console.log(window.sessionStorage.getItem("kwota"));
	console.log(window.sessionStorage.getItem("rodzajKlasy"));
	console.log(window.sessionStorage.getItem("usytuowanie"));
  

}

window.onload = function() {
 parametryLotu();
}

function zaplac(){

		const daneRezerwacja = {
		  id_pasazer: window.sessionStorage.getItem("id_pasazer"),
		  id_lot: window.sessionStorage.getItem("id_lot"),
		  id_oplata: window.sessionStorage.getItem("id_oplata")

		};

	console.log(daneRezerwacja);
	fetch("http://127.0.0.1:2004/zrobRezerwacje", {
	        method: 'POST',       
	        body: JSON.stringify(daneRezerwacja),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
	    })
	    .then(res => res.json())
	    .then(res => {
	        console.log("Dodano rezerwacje:");
	        console.log(res);
	          window.sessionStorage.setItem("id_rezerwacja", res[0].id_rezerwacja);
  			console.log(window.sessionStorage.getItem("id_rezerwacja"));


  			const rezerwacjaID = {
			  id_rezerwacja: window.sessionStorage.getItem("id_rezerwacja"),
			  id_miejsce: window.sessionStorage.getItem("id_miejsce")

			};

		console.log(daneRezerwacja);
		fetch("http://127.0.0.1:2004/wstawRezerwacje", {
		        method: 'POST',       
		        body: JSON.stringify(rezerwacjaID),
		        headers: {
		            'Content-type': 'application/json',
		            'Access-Control-Allow-Origin': '*'
		        }
		    })
		    .then(res => res.json())
		    .then(res => {
		        console.log("Dodano rezerwacje do oplaty:");
		        console.log(res);

		        console.log(window.sessionStorage.getItem("id_rezerwacja"));
		        window.location.href = "panelUzytkownika.html"

		    })

	    })
}