# Project Tech
## SpecialThirst

## 📑 Inhoudsopgave

- [Beschrijving](#-beschrijving)
- [Hoe gebruik je de app](#-hoe-gebruik-je-de-app)
- [Features](#-features)
- [Gebruikte technologieën](#-gebruikte-technologieën)
- [Vereisten](#-vereisten)
- [Licentie informatie](#-licentie-informatie)
- [Auteurs](#-auteurs)
- [Coding Standards](#-coding-standards)



###  Beschrijving
In dit project hebben wij een interactieve en gebruiksvriendelijke app ontwikkeld waarmee je jouw perfecte biertje kunt ontdekken. Of je nu op zoek bent naar een specifiek type bier of gewoon nieuwsgierig bent naar nieuwe smaken, deze app helpt je op weg. Je kunt gemakkelijk zoeken op biersoorten en stijlen, maar het leukste is misschien wel de quizfunctie. Door een korte vragenlijst in te vullen, krijg je een persoonlijk biertje aanbevolen dat perfect aansluit bij jouw smaakprofiel.
Daarnaast maken we gebruik van een externe bierdatabase via een API, waardoor je altijd toegang hebt tot een uitgebreide en actuele selectie van bieren.

### Hoe gebruik je de app
Wanneer je de app opent in een browser op je telefoon, past het scherm zich automatisch aan zodat alles netjes en overzichtelijk wordt weergegeven. Gebruik je een computer, dan kun je via de ontwikkelaarstools (meestal toegankelijk via de toets F12) het schermformaat aanpassen naar een mobiel formaat, bijvoorbeeld 375 x 667 pixels, voor de beste ervaring.

Op het startscherm kom je terecht in het home-scherm, waar je direct aan de slag kunt. Bovenin vind je een zoekbalk waarmee je gemakkelijk kunt zoeken naar een specifiek biertype of naam. Onderaan zie je een navigatiebalk waarmee je snel kunt schakelen tussen drie hoofdsecties:

- Feedpagina: hier vind je updates, nieuwe bieren en aanbevelingen.
- Homepagina: je startpunt, met onder andere de quiz en snelle toegang tot populaire bieren.
- Profielpagina: hier vind je jouw opgeslagen bieren, quizresultaten en persoonlijke instellingen.

De quiz op het home-scherm is een leuke manier om een biertje te ontdekken dat goed bij jou past. Door een aantal vragen te beantwoorden over je smaakvoorkeuren en voorkeurssituaties, berekent de app een persoonlijk biertje dat bij je past. Na het afronden van de quiz kun je het aanbevolen biertje opslaan in je profiel om het later terug te vinden.


###  Features

-  Zoek op biertype
-  Doe een quiz en ontdek jouw biersmaak
-  Responsive ontwerp
-  API-koppeling met externe bierdatabase

###  Gebruikte technologieën
- JavaScript
- Node.js
- Express 
- CSS

###  Vereisten
Zorg ervoor dat je de volgende software hebt geïnstalleerd:
- [Node.js en npm](https://nodejs.org/) (v14 of hoger aanbevolen)
- Een moderne webbrowser (zoals Chrome, Firefox, Edge)

###  Licentie informatie
Dit project is gelicentieerd onder de MIT-licentie – zie de onderstaande tekst voor meer informatie.

Dit project is beschikbaar onder de [MIT-licentie](LICENSE).

###  Auteurs

- [@Githijs100](https://github.com/Githijs100)
- [@VinceSMVS](https://github.com/VinceSMVS)
- [@Rafi1310](https://github.com/Rafi1310)



### Coding Standards

#### 1. Indentatie
Gebruik **4 spaties** voor inspringing. Gebruik geen tabs.

#### 2. Variabelen en Functienamen
- Gebruik `camelCase` voor variabelen en functies.
- Gebruik `PascalCase` voor klassen.
- Gebruik `SCREAMING_SNAKE_CASE` voor constante waarden.

#### 3. Bestandsindeling
- Eén class per bestand.
- Bestandsnamen moeten overeenkomen met de hoofdklasse (`MyClass.js` voor `class MyClass`).

#### 4. Commentaar
Gebruik ** single-line comment (//) **-stijl voor functies:
```js
//
 * Bereken de som van twee getallen.
 * @param {number} a - Het eerste getal
 * @param {number} b - Het tweede getal
 * @returns {number} De som van a en b
 //
function sum(a, b) {
  return a + b;
}


//
 Klasse die een Gebruiker voorstelt.
 //
class User {
  //
   * Maak een nieuwe gebruiker aan.
   * @param {string} name - De naam van de gebruiker.
   * @param {number} age - De leeftijd van de gebruiker.
   //
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  /**
   * Haal de naam van de gebruiker op.
   * @returns {string} De naam van de gebruiker.
   */
  getName() {
    return this.name;
  }
}

#### 5 Asynchrone functie documenteren

/**
 * Haal gebruikersgegevens op via een API.
 * @async
 * @function fetchUserData
 * @param {string} userId - De ID van de gebruiker.
 * @returns {Promise<Object>} De gebruikersgegevens.
 */
async function fetchUserData(userId) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  return response.json();
}

#### 6 Documenteren van een object type

//
 * @typedef {Object} Product
 * @property {string} name - De naam van het product.
 * @property {number} price - De prijs van het product.
 * @property {boolean} inStock - Geeft aan of het product op voorraad is.
 //

// @type {Product} //
const laptop = {
  name: "MacBook Pro",
  price: 1499,
  inStock: true
};



