# Coding Standards

## 1. Indentatie
Gebruik **4 spaties** voor inspringing. Gebruik geen tabs.

## Gebruik Iphone SE voor als template in de browser

## 2. Variabelen en Functienamen
- Gebruik `camelCase` voor variabelen en functies.
- Gebruik `PascalCase` voor klassen.
- Gebruik `SCREAMING_SNAKE_CASE` voor constante waarden.

## 3. Bestandsindeling
- Eén class per bestand.
- Bestandsnamen moeten overeenkomen met de hoofdklasse (`MyClass.js` voor `class MyClass`).

## 4. Commentaar
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

## 5 Asynchrone functie documenteren

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

## 6 Documenteren van een object type

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



