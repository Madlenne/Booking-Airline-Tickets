function przetworz(){


  let z_lotnisko = document.getElementById('z_lotniska').value;
  let do_lotnisko = document.getElementById('do_lotniska').value;
  let miesiac = document.getElementById('miesiac').value;
  let rok = document.getElementById('rok').value;

  var lista_dni = document.getElementById('kontener_dni');
  lista_dni.textContent="Dostepne dni ";
  var dni = document.createElement('select');
  dni.setAttribute('id', 'dni');
  lista_dni.appendChild(dni);
  var kwota = document.createElement('div');
  kwota.setAttribute('id', 'kwota');
  

  var daty_odlotu = [];

  const url = 'http://127.0.0.1:2004/loty?z="+z_lotnisko+"&doo="+do_lotnisko';

  fetch("http://127.0.0.1:2004/loty?z="+z_lotnisko+"&doo="+do_lotnisko).then(resp => resp.json())
    .then(resp => {
         
                resp.forEach(d => {
                  daty_odlotu.push(d.data_odlotu.substring(0,10));
        })
console.log(daty_odlotu);
      for(let i=0; i<daty_odlotu.length; ++i){
        if(daty_odlotu[i].substring(0,4) == rok){
          if(daty_odlotu[i].substring(5,7) == miesiac){
            console.log(daty_odlotu[i].substring(8,10));
            const dzien = document.createElement('option');
            dzien.setAttribute('value', daty_odlotu[i].substring(8));
            dzien.text = daty_odlotu[i].substring(8);
            dni.appendChild(dzien);
          }
        }
       }   

   window.sessionStorage.setItem("lotniskoZrodlowe", z_lotnisko);
   window.sessionStorage.setItem("lotniskoDocelowe", do_lotnisko);
   window.sessionStorage.setItem("rok", rok);
   window.sessionStorage.setItem("miesiac", miesiac);

    const przyciskOK = document.createElement('input');
    przyciskOK.setAttribute('type', 'button');
    przyciskOK.setAttribute('id', 'przyciskOK');
    przyciskOK.setAttribute('value', 'OK');

    
    lista_dni.appendChild(przyciskOK);
    lista_dni.appendChild(kwota);
    dni.onclick = function(){

      const wybranyDzien = document.getElementById('dni').value;
      console.log(wybranyDzien);
      window.sessionStorage.setItem("wybranyDzien", wybranyDzien);
      resp.forEach(d => {
              if(d.data_odlotu.substring(8, 10) == wybranyDzien)
                {
                  window.sessionStorage.setItem("id_lot", d.id_lot);
                  window.sessionStorage.setItem("dzienPrzylotu", d.data_przylotu.substring(8,10));
                  window.sessionStorage.setItem("godzinaOdlotu", d.godzina_odlotu);
                  window.sessionStorage.setItem("godzinaPrzylotu", d.godzina_przylotu);
                  window.sessionStorage.setItem("kosztLotu", d.koszt);
                }
            })

      document.getElementById('kwota').innerHTML = "&nbsp; &nbsp;Cena biletu: " + window.sessionStorage.getItem("kosztLotu") + "zł";
    }


    przyciskOK.onclick = function(){


        if (window.sessionStorage.getItem('status') == null){
          
           window.location.href = "logowanie.html";
        }
        else{
          window.location.href = "reszta.html";
        
        }

    }

  });
    

}

function walidacja(){
  const login = document.getElementById('login').value;
  const haslo = document.getElementById('haslo').value;
  const imie = document.getElementById('imie').value;
  const nazwisko = document.getElementById('nazwisko').value;
  const email = document.getElementById('email').value;
  const nr_tel = document.getElementById('nrTel').value;
  const nr_dokumentu = document.getElementById('dokument').value;
  const data_ur = document.getElementById('dataUr').value;
  console.log("TU");

  if(login == "" || haslo == "" || imie == "" || nazwisko == "" || email == "" || nr_tel == "" || nr_dokumentu == "" || data_ur == "")
    {
      alert("Proszę uzupełnić wszystkie pola!");
      return false;
    }
    
  if (email.indexOf("@")==-1){
    alert("Proszę podać poprawny adres e-mail!");
    document.getElementById('email');
    return false;
  } 
  return true;

}

function zarejestruj(){
  if(walidacja()){
    console.log("OK");

  const login = document.getElementById('login').value;
  const haslo = document.getElementById('haslo').value;
  const imie = document.getElementById('imie').value;
  const nazwisko = document.getElementById('nazwisko').value;
  const email = document.getElementById('email').value;
  const nr_tel = document.getElementById('nrTel').value;
  const nr_dokumentu = document.getElementById('dokument').value;
  const data_ur = document.getElementById('dataUr').value;
  console.log(typeof login);

  let zajety = false;

   fetch('http://127.0.0.1:2004/wszystkieLoginy').then(resp => resp.json())
    .then(resp => {

         
                resp.forEach(d => { 
                  if(d.login == login)
                  {
                    alert("Login " + login + " jest już zajęty!"); 
                    zajety = true;
                  }

              });

                if(zajety == false)
                {
                    window.sessionStorage.setItem("login", login);

                    const danePasazera = {
                      imie: imie,
                      nazwisko: nazwisko,
                      nr_tel: nr_tel,
                      nr_dokumentu: nr_dokumentu,
                      email: email,
                      data_urodzenia: data_ur,
                      login: login,
                      haslo: haslo

                    };
                    console.log(danePasazera);
                    fetch("http://127.0.0.1:2004/pasazerowie", {
                            method: 'POST',       
                            body: JSON.stringify(danePasazera),
                            headers: {
                                'Content-type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            }
                        })
                        .then(res => res.json())
                        .then(res => {
                            console.log("Dodałem użytkownika:");
                            console.log(res);
                      window.sessionStorage.setItem("id_pasazer", res[0].id_pasazer);
                      console.log(window.sessionStorage.getItem("id_pasazer"));
                          window.sessionStorage.setItem("status", "zalogowany");
			window.location.href = "reszta.html";

                       
                        })
                }
    });
  }   
}
function zarejestruj2(){
  window.location.href = "rejestracja.html";
}

function zaloguj(){


  const login = document.getElementById('login').value;
  const haslo = document.getElementById('haslo').value;

  window.sessionStorage.setItem("login", login);

  const daneLogowania = {
    login: login,
    haslo: haslo
  };

fetch("http://127.0.0.1:2004/login", {
        method: 'POST',       
        body: JSON.stringify(daneLogowania),
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log("Wyslano dane logowania:");
        console.log(res);
        console.log(res.length == 0);
           if(res.length == 0)
            alert("Zły login lub hasło. Spróbuj ponownie");
          else
          {

              window.sessionStorage.setItem("id_pasazer", res[0].id_pasazer);
           

          window.sessionStorage.setItem("status", "zalogowany");
          if( window.sessionStorage.getItem("id_lot") != null)
            window.location.href = "reszta.html";
          else
          window.location.href = "panelUzytkownika.html";
          }

    })

}

function czyZalogowany(){

  if(window.sessionStorage.getItem('status') != null)
  {
    alert("Jestes zalogowany jako: " + window.sessionStorage.getItem('login'))
    
  }
  else
    window.location.href = "logowanie.html";
}

function wyloguj(){

  window.sessionStorage.clear();
  window.location.href = "strona.html";
}




