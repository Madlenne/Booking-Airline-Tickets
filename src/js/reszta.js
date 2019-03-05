function dotychczasoweDane() {

  var wyborLotu = document.getElementById('wyborLotu');
  console.log(document.getElementById('wyborLotu'));
  wyborLotu.innerHTML = "<div class='wybranyLot'>wybrany lot: " + "<br>Z: " + window.sessionStorage.getItem('lotniskoZrodlowe')+" Do: "+window.sessionStorage.getItem('lotniskoDocelowe')+
  						"<br>Data i godzina wylotu: "+window.sessionStorage.getItem('wybranyDzien') + "-" + window.sessionStorage.getItem('miesiac') + "-" + window.sessionStorage.getItem('rok') + 
  						" "+ window.sessionStorage.getItem('godzinaOdlotu')+"<br>Data i godzina przylotu: "+window.sessionStorage.getItem('dzienPrzylotu')+ "-" + window.sessionStorage.getItem('miesiac') + "-" + window.sessionStorage.getItem('rok')+
  						" " + window.sessionStorage.getItem('godzinaPrzylotu') + "<br>Koszt: "+window.sessionStorage.getItem('kosztLotu') + "zł</div>";

console.log("ID LOTU " + window.sessionStorage.getItem('id_lot'));
  fetch('http://127.0.0.1:2004/zajeteMiejsca?id_lot=' + window.sessionStorage.getItem('id_lot'))
  .then(resp => resp.json())
    .then(resp => {
          console.log(sessionStorage.getItem('id_lot'));
		console.log(resp);

          var x = document.getElementsByClassName('wybraneMiejsce');
console.log(x.length);
          for (i = 0; i < x.length; i++) {
            resp.forEach(d => {   
		console.log(x[i].value + " " + x[i].disabled);
            if(x[i].value == d.id_miejsce) 
              x[i].disabled=true;


            })
            
          }
    });

}

window.onload = function() {
 dotychczasoweDane();
}

function wybierzMiejsce(){
    var wybraneMiejsce = "";

    var checked = document.querySelectorAll('.wybraneMiejsce:checked');

	if (checked.length === 0) {
    
   	  console.log('no checkboxes checked');
    	  return false;
	} else {
    
    	console.log(checked.length + ' checkboxes checked');
        return true;
}


}


function zaznacz(zaznaczone){
  var x = document.getElementsByClassName('wybraneMiejsce');
  var i;

  for (i = 0; i < x.length; i++) {
    if(x[i].value != zaznaczone) x[i].checked = false;
  }
  console.log(document.querySelector('.wybraneMiejsce:checked').value);
}

function dalej(){
window.location.href = "finalizacja.html";
}

function zatwierdzZnizke(){

  var znizki = document.getElementsByName('kategoriaWiekowa');
  var wybranaznizka = 1;

  for (var i = 0, length = znizki.length; i < length; i++)
  {
     if (znizki[i].checked)
     {
      wybranaznizka = znizki[i].value;

        break;
     }
  }

  console.log(wybranaznizka);


  fetch('http://127.0.0.1:2004/znizka?rodzaj='+wybranaznizka).then(resp => resp.json())
    .then(resp => {
     
          console.log(resp);

          console.log("AAA: " + resp[0].id_znizka);
                    
                  window.sessionStorage.setItem("id_znizka", resp[0].id_znizka);


    console.log(window.sessionStorage.getItem("id_znizka"));

    zatwierdzMiejsce();
   
    });

}

function zatwierdzMiejsce(){
  if(wybierzMiejsce())
  {

    // ********* miejsce *********

     var wybraneMiejsce = document.querySelector('.wybraneMiejsce:checked').value;
    window.sessionStorage.setItem("id_miejsce", wybraneMiejsce);


  
  fetch('http://127.0.0.1:2004/klasa?id_miejsce=' + window.sessionStorage.getItem("id_miejsce"))
  .then(resp => resp.json())
    .then(resp => {
          window.sessionStorage.setItem("id_klasa", resp[0].id_klasa);

    });


      const zajeteMiejsce = {
        zajete: true,
        id_miejsce: window.sessionStorage.getItem("id_miejsce"),
        id_lot: window.sessionStorage.getItem("id_lot")
       };

       fetch("http://127.0.0.1:2004/ustawZajetosc", {
          method: 'POST',       
          body: JSON.stringify(zajeteMiejsce),
          headers: {
              'Content-type': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Zaaktualizowano miejsce");
          console.log(res);
          zatwierdzOplate();
      })
    }
   else
    alert("Prosze wybrac miejsce");
}

function zatwierdzOplate(){

  if(window.sessionStorage.getItem("id_znizka") == null)
        window.sessionStorage.setItem("id_znizka", 3);

              const oplata = {
              id_lotu: window.sessionStorage.getItem("id_lot"),
              id_miejsce: window.sessionStorage.getItem("id_miejsce"),
              id_znizka: window.sessionStorage.getItem("id_znizka")
             };

             console.log(oplata);

                fetch("http://127.0.0.1:2004/oplata", {
                    method: 'POST',       
                    body: JSON.stringify(oplata),
                    headers: {
                        'Content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                })
                .then(res => res.json())
                .then(res => {
                    console.log("Dodano oplate:");
                    console.log(res);
                    window.sessionStorage.setItem("id_oplata", res[0].id_oplata);
                    zatwierdzBagaz();
                });
}

function zatwierdzBagazRezerwacja(bagazRezerwacja){


  fetch("http://127.0.0.1:2004/bagazRezerwacja", {
    method: 'POST',       
    body: JSON.stringify(bagazRezerwacja),
    headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
  }
  })
  .then(res => res.json())
  .then(res => {
      console.log("Dodano bagazRezerwacja:");
      console.log(res);
      obliczKwote();
    })

}

function obliczKwote(){

    fetch('http://127.0.0.1:2004/kwota?id_miejsce=' + window.sessionStorage.getItem("id_miejsce"))
  .then(resp => resp.json())
    .then(resp => {

          console.log(resp);
          console.log("kwota do zaplaty: " + resp[0].kwota);
          window.sessionStorage.setItem("kwota", resp[0].kwota);
          zatwierdzKoszt();
        })
}

function zatwierdzKoszt(){
  const kosztLotu = {
    koszt: window.sessionStorage.getItem("kwota"),
    id_miejsce: window.sessionStorage.getItem("id_miejsce")
  };
  console.log(JSON.stringify(kosztLotu))

      fetch("http://127.0.0.1:2004/wstawKoszt", {
        method: 'PUT',       
        body: JSON.stringify(kosztLotu),
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log("Dodano kosztLotu:");
        console.log(res);
window.location.href = "finalizacja.html";
    })
}

function zatwierdzBagaz(){

  var bagaz = {
      podreczny: document.getElementById('podreczny').value,
      sredni: document.getElementById('sredni').value,
      duzy: document.getElementById('duzy').value
    };

    var bagazID = {
      podreczny: 0,
      sredni: 0,
      duzy: 0
    }

  for(let rodzaj in bagaz){

   if(bagaz[rodzaj] > 0)
   { 

               fetch('http://127.0.0.1:2004/bagaz?rodzaj='+rodzaj).then(resp => resp.json())
               .then(resp => {
                      bagazID['rodzaj'] = resp[0].id_bagaz;

               console.log("z bazy ID bagazu "+ rodzaj + ": " + bagazID['rodzaj']);

                const bagazRezerwacja = {
                              id_bagaz: bagazID['rodzaj'],
                              id_miejsce: window.sessionStorage.getItem("id_miejsce"),
                              ilosc: bagaz[rodzaj],
                              id_lot: window.sessionStorage.getItem("id_lot")
                             };
                 zatwierdzBagazRezerwacja(bagazRezerwacja);
              
           })

    }
    else if(bagaz['podreczny'] == 0 && bagaz['sredni'] == 0 && bagaz['duzy'] == 0)
    {
      console.log("W 0 BAGAZU");
                const bagazRezerwacja = {
                id_bagaz: 1,
                id_miejsce: window.sessionStorage.getItem("id_miejsce"),
                ilosc: 0
               };
                console.log(JSON.stringify(bagazRezerwacja))
                 zatwierdzBagazRezerwacja(bagazRezerwacja);
                           
    }
  }
}







