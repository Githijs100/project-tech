const mongoose = require("mongoose");
const Beer = require("./models/beerModel"); 
const fs = require("fs");
require("dotenv").config(); 

const mongoURI = process.env.URI; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Verbonden met MongoDB"))
  .catch(err => console.error("❌ Fout bij verbinden:", err));

const beersData = JSON.parse(fs.readFileSync("bieren.json", "utf8"));

async function importBeers() {
  try {
    await Beer.insertMany(beersData.beers);
    console.log("🍺 Data succesvol geïmporteerd!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Fout bij importeren:", error);
  }
}

importBeers();
