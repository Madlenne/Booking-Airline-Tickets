var Client  = require('pg');
const Pool = require('pg').Pool;

var pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'XXXXX',
  port: 5432
})
pool.connect();

const getPasazerowie = (request, response) => {
  pool.query('SELECT * FROM linie.pasazer', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
 
  })
}

const getLoty = (request, response) => {

	if(!(request.query.z))
	  {
	  	pool.query('SELECT * FROM linie.lot', (error, results) => {
	    if (error) {
	      throw error
	    }
	    response.status(200).json(results.rows)

  		})
	  }
	  else
	  {
	  	var z_lot = String(request.query.z);
	  	var do_lot = String(request.query.doo);
	  	pool.query('SELECT linie.lot.id_lot, linie.lot.data_odlotu, linie.lot.data_przylotu, linie.lot.godzina_odlotu, linie.lot.godzina_przylotu, linie.lot.koszt FROM linie.lot JOIN linie.lotnisko l1 ON (l1.nazwa = $1  AND linie.lot.id_lotniska_zrodlowego = l1.id_lotnisko) JOIN linie.lotnisko l2 ON (l2.nazwa = $2  AND linie.lot.id_lotniska_docelowego = l2.id_lotnisko)', [z_lot, do_lot], (error, results) => {
	    if (error) {
	      throw error
	    }
	    response.status(200).json(results.rows)
	  	})
	  }

}


const stworzPasazera = (request, response) => {
	
  const login = request.body.login;
  const haslo = request.body.haslo;
  const imie = request.body.imie;
  const nazwisko = request.body.nazwisko;
  const email = request.body.email;
  const nr_tel = request.body.nr_tel;
  const nr_dokumentu = request.body.nr_dokumentu;
  const data_ur = request.body.data_urodzenia;

  pool.query('INSERT INTO linie.pasazer (imie, nazwisko, nr_tel, nr_dokumentu, email, data_urodzenia, login, haslo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_pasazer', 
  	[imie, nazwisko, nr_tel, nr_dokumentu, email, data_ur, login, haslo], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const login = (request, response) => {

	const login = request.body.login;
	const haslo = request.body.haslo;

	pool.query('SELECT linie.pasazer.id_pasazer FROM linie.pasazer WHERE (linie.pasazer.login = $1 AND linie.pasazer.haslo = $2)', [login, haslo], (error, results) => {
	    if (error) {
	      throw error
	    }
	    response.status(200).json(results.rows)

  		})
}

const znizka = (request, response) => {

	var rodzaj = request.query.rodzaj;
  pool.query('SELECT * FROM linie.znizka WHERE linie.znizka.rodzaj=$1', [rodzaj], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)

  })
}

const dodajZnizke = (request, response) => {
	
  const znizka = request.body.znizka;


  pool.query('INSERT INTO linie.oplata (id_znizka) VALUES ($1)', [znizka], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'});
  })
}


const bagaz = (request, response) => {

	var rodzaj = request.query.rodzaj;
  pool.query('SELECT linie.bagaz.id_bagaz FROM linie.bagaz WHERE linie.bagaz.rodzaj=$1', [rodzaj], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const bagazRezerwacja = (request, response) => {

  const id_bagaz = request.body.id_bagaz;
  const ilosc = request.body.ilosc;
  const id_miejsce = request.body.id_miejsce;
  const id_lot = request.body.id_lot;


  pool.query('INSERT INTO linie.bagaz_rezerwacja (id_bagaz, id_miejsce, ilosc, id_lot) VALUES ($1, $2, $3, $4)', [id_bagaz, id_miejsce, ilosc, id_lot], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'});
  })
}

const pasazerID = (request, response) => {

  pool.query("SELECT currval(pg_get_serial_sequence('linie.pasazer', 'id_pasazer'))", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
} 

const ustawZajetosc = (request, response) => {

  const czy_zajete = request.body.zajete;
  const id_miejsce = request.body.id_miejsce;
  const id_lot = request.body.id_lot;


  pool.query('UPDATE linie.miejsce SET czy_zajete = $1 WHERE id_miejsce = $2 AND id_lot=$3', [czy_zajete, id_miejsce, id_lot], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'});
  })

}

const zajeteMiejsca = (request, response) => {

  const id_lot = request.query.id_lot;
  pool.query('SELECT linie.miejsce.id_miejsce FROM linie.miejsce WHERE linie.miejsce.czy_zajete=$1 AND linie.miejsce.id_lot=$2', [true, id_lot], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
   
  })
}

const klasa = (request, response) => {

  const id_miejsce = request.query.id_miejsce;
  
  pool.query('SELECT id_klasa FROM linie."nazwaKlasy" WHERE id_miejsce=$1', [id_miejsce], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const oplata = (request, response) => {

  const id_lotu = request.body.id_lotu;
  const id_miejsce = request.body.id_miejsce;
  const id_znizka = request.body.id_znizka;


  pool.query('INSERT INTO linie.oplata (id_lotu, id_miejsce, id_znizka, zaplacono) VALUES ($1, $2, $3, $4) RETURNING id_oplata', [id_lotu, id_miejsce, id_znizka, false], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const kwota = (request, response) => {

  const id_miejsce = request.query.id_miejsce;

  pool.query('SELECT linie.wszystkie_bagaze($1)*linie.lot.koszt + linie.lot.koszt*linie.znizka.procent_znizki*linie.klasa.oplata_proc as kwota FROM linie.lot JOIN linie.oplata ON linie.lot.id_lot=linie.oplata.id_lotu JOIN linie.znizka ON linie.oplata.id_znizka=linie.znizka.id_znizka JOIN linie.miejsce ON (linie.miejsce.id_miejsce=linie.oplata.id_miejsce AND linie.miejsce.id_lot=linie.oplata.id_lotu) JOIN linie.klasa ON linie.miejsce.id_klasa = linie.klasa.id_klasa WHERE linie.oplata.id_miejsce = $1', [id_miejsce], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const wstawKoszt = (request, response) => {

  const koszt = request.body.koszt;
  const id_miejsce = request.body.id_miejsce;

  pool.query('UPDATE linie.oplata SET koszt = $1 WHERE id_miejsce = $2', [koszt, id_miejsce], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'});
  })
}

const usytuowanie = (request, response) => {

  const id_miejsce = request.query.id_miejsce;
  pool.query('SELECT linie.miejsce.usytuowanie FROM linie.miejsce WHERE linie.miejsce.id_miejsce=$1', [id_miejsce], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
   
  })
}

const nazwaKlasy = (request, response) => {

  const id_miejsce = request.query.id_miejsce;
  pool.query('SELECT linie.klasa.rodzaj FROM linie.klasa JOIN linie.miejsce ON linie.miejsce.id_klasa=linie.klasa.id_klasa WHERE linie.miejsce.id_miejsce=$1', [id_miejsce], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
   
  })
}

const zrobRezerwacje = (request, response) => {

  
  const id_pasazer = request.body.id_pasazer;
  const id_lot = request.body.id_lot;
  const id_oplata = request.body.id_oplata;

  pool.query('INSERT INTO linie.rezerwacja (id_pasazer, id_lot, id_oplata) VALUES ($1, $2, $3) RETURNING id_rezerwacja', [id_pasazer, id_lot, id_oplata], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const wstawRezerwacje = (request, response) => {

  const id_rezerwacja = request.body.id_rezerwacja;
  const id_miejsce = request.body.id_miejsce;

  pool.query('UPDATE linie.bagaz_rezerwacja SET id_rezerwacja = $1 WHERE id_miejsce = $2', [id_rezerwacja, id_miejsce], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'});
  })
}

const wyswietlRezerwacje = (request, response) => {

  const id_pasazer = request.query.id_pasazer;

  pool.query('SELECT data_odlotu, data_przylotu, godzina_odlotu, godzina_przylotu, zrodlo, cel, id_miejsce, usytuowanie, koszt, id_rezerwacja FROM linie."mojeRezerwacje" WHERE id_pasazer=$1', [id_pasazer], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  
  })
} 

const calkowityKoszt = (request, response) => {

  const id_pasazer = request.query.id_pasazer;

  pool.query('SELECT sum(koszt) as suma FROM linie."mojeRezerwacje" WHERE id_pasazer=$1', [id_pasazer], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
   
  })
} 

const wszystkieLoginy = (request, response) => {


  pool.query('SELECT linie.pasazer.login FROM linie.pasazer', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
   
  })
} 



module.exports = { getPasazerowie, getLoty, stworzPasazera, 
                    login, znizka, dodajZnizke, bagaz, 
                    bagazRezerwacja, ustawZajetosc, 
                    klasa, zajeteMiejsca, oplata, 
                    pasazerID, kwota, wstawKoszt, usytuowanie,
                    nazwaKlasy, zrobRezerwacje, wstawRezerwacje,
                    wyswietlRezerwacje, calkowityKoszt,
                    wszystkieLoginy}
