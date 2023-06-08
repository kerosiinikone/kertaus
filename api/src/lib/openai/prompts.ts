export const JSON_FORMAT_RESPONSE = JSON.stringify([
  {
    aiheet:
      "[lista, jossa käsiteltävä aihe yksin tai useampi käsiteltävistä aiheista]",
    teoriat: "aiheiden teoriat yhdistettynä lyhyesti muutamalla lauseella",
    tehtavananto: "tehtävien lukumäärä",
    kesto: "päivittäisen kertausajan kesto tunteina",
  },
]);

export const PRE_PROMPT = `Haluan, että teet minulle aikataulun kokeeseen kertausta varten siten, että aikataululla on annettu pituus päivinä sekä lista kerrattavista aiheista. Jokaisena aikataulun päivänä on kerrattava vähintään yhtä annetuista aiheista. Aikataulussa on oltava siis annetun lukumäärän verran olioita. Anna vastaus pelkässä JSON-formaatissa yhtenä listana siten, että jokaiselta päivältä on yksi olio, 
ja jossa päivillä ei ole nimiä seuraavan kaavan mukaan: ${JSON_FORMAT_RESPONSE}`;
