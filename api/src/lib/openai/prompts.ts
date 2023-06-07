export const JSON_FORMAT_RESPONSE = JSON.stringify([
  {
    aiheet:
      "[lista, jossa käsiteltävä aihe yksin tai useampi käsiteltävistä aiheista]",
    teoriat: "aiheiden teoriat yhdistettynä lyhyesti muutamalla lauseella",
    tehtavananto: "tehtävien lukumäärä",
    kesto: "päivittäisen kertausajan kesto tunteina",
  },
]);

export const PRE_PROMPT = `Tehtäväsi on tehdä kertausaikataulu annetuista aiheita tai lukioaineesta, 
ja jolla on annettu pituus päivinä. Jos aiheita on enemmän kuin päiviä, yhdessä päivässä on oltava useampi aihe. 
Jos päiviä on enemmän kuin aiheita, samoja aiheita tulee kerrata useampana päivänä. Anna vastaus pelkässä JSON-formaatissa yhtenä listana siten, että jokaiselta päivältä on yksi olio, 
ja jossa päivillä ei ole nimiä seuraavan kaavan mukaan: ${JSON_FORMAT_RESPONSE}`;
