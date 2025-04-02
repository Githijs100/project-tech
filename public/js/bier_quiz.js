document.addEventListener("DOMContentLoaded", function () {
    let beerData = [];
    let currentStep = 0;
    let userChoices = {};

    async function loadBeers() {
        try {
            const response = await fetch("bieren.json");
            beerData = await response.json();
            console.log("Bieren geladen:", beerData.length);
            showQuestion();
        } catch (error) {
            console.error("Fout bij laden van de bieren:", error);
        }
    }

    function showQuestion() {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "";

        const questionData = [
            {
                text: "Wat voor eten heb je zin in?",
                options: [...new Set(beerData.flatMap(beer => beer.food_pairing).filter(Boolean))],
                key: "food_pairing"
            },
            {
                text: "Uit welk land wil je dat het biertje komt?",
                options: [...new Set(beerData.map(beer => beer.country).filter(Boolean))], 
                key: "country"
            },
            {
                text: "Wil je een mild (<7%) of een sterk biertje (>7%)?",
                options: ["Mild", "Sterk"],
                key: "alcohol"
            },
            {
                text: "Welke biersoort wil je proberen?",
                options: [...new Set(beerData.map(beer => beer.sub_category_2).filter(Boolean))],
                key: "sub_category_2"
            }
        ];

        if (currentStep < questionData.length) {
            const question = questionData[currentStep];
            console.log("Huidige vraag:", question.text);

            const questionEl = document.createElement("h3");
            questionEl.textContent = question.text;
            quizContainer.appendChild(questionEl);

            question.options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.onclick = () => {
                    userChoices[question.key] = option;
                    currentStep++;
                    showQuestion();
                };
                quizContainer.appendChild(button);
            });
        } else {
            showResult();
        }
    }

    function showResult() {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "<h3>Jouw aanbevolen bier:</h3>";
    
        console.log("Gebruikerskeuzes:", userChoices);
    
        let filteredBeers = beerData.filter(beer =>
            (!userChoices.food_pairing || 
                (beer.food_pairing && beer.food_pairing.toLowerCase().includes(userChoices.food_pairing.toLowerCase()))) &&
            (!userChoices.country || beer.country === userChoices.country) &&
            (!userChoices.alcohol || (beer.abv && !isNaN(parseFloat(beer.abv)) && 
                (userChoices.alcohol === "Mild" ? parseFloat(beer.abv) < 7 : parseFloat(beer.abv) >= 7))) &&
            (!userChoices.sub_category_2 || beer.sub_category_2 === userChoices.sub_category_2)
        );
    
        console.log("Gefilterde bieren:", filteredBeers);
    
        if (filteredBeers.length > 0) {
            const recommendedBeer = filteredBeers[Math.floor(Math.random() * filteredBeers.length)];
            console.log("Aanbevolen bier:", recommendedBeer);
    
            quizContainer.innerHTML += `
                <p><strong>${recommendedBeer.name}</strong> uit ${recommendedBeer.country} - ${recommendedBeer.abv}% - ${recommendedBeer.sub_category_2}</p>
                <img src="${recommendedBeer.image}" alt="${recommendedBeer.name}" width="200">
                <br>
                <button onclick="saveBeer('${recommendedBeer.name}', '${recommendedBeer.country}', '${recommendedBeer.abv}', '${recommendedBeer.sub_category_2}', '${recommendedBeer.image}')">
                    Sla op
                </button>
            `;
        } else {
            quizContainer.innerHTML += "<p>Geen passende bieren gevonden. Probeer andere keuzes!</p>";
        }
    }    

    loadBeers();
});

async function saveBeer(name, country, abv, category, image) {
    try {
        const response = await fetch('/save-beer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, country, abv, category, image })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Fout bij opslaan:", error);
    }
}
