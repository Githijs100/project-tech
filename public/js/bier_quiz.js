document.addEventListener("DOMContentLoaded", function () {
    let beerData = [];
    let currentStep = 0;
    let userChoices = {};

    async function loadBeers() {
        try {
            const response = await fetch("bieren.json");
            beerData = await response.json();
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
                options: ["Spicy chicken wings", "Grilled shrimp tacos", "Margherita pizza"],
                key: "food_pairing"
            },
            {
                text: "Uit welk land wil je dat het biertje komt?",
                options: [...new Set(beerData.map(beer => beer.country))], 
                key: "country"
            },
            {
                text: "Wil je een mild (<7%) of een sterk biertje (>7%)?",
                options: ["Mild", "Sterk"],
                key: "alcohol"
            },
            {
                text: "Welke biersoort wil je proberen?",
                options: [...new Set(beerData.map(beer => beer.sub_category_3))], 
                
                key: "sub_category_3"
            }
        ];

        if (currentStep < questionData.length) {
            const question = questionData[currentStep];
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

        //elke keer als de gebruiker een vraag beantwoord - wordt deze opgeslagen
        let filteredBeers = beerData.filter(beer =>
            (!userChoices.food_pairing || beer.food_pairing.includes(userChoices.food_pairing)) &&
            (!userChoices.country || beer.country === userChoices.country) &&
            (!userChoices.alcohol || (userChoices.alcohol === "Mild" ? parseFloat(beer.abv) < 7 : parseFloat(beer.abv) >= 7)) && 
            (!userChoices.sub_category_3 || beer.sub_category_3 === userChoices.sub_category_3)
        );


        if (filteredBeers.length > 0) {
            const recommendedBeer = filteredBeers[Math.floor(Math.random() * filteredBeers.length)];
            quizContainer.innerHTML += `
                <p>${recommendedBeer.name} uit ${recommendedBeer.country} - ${recommendedBeer.abv}% - ${recommendedBeer.sub_category_3}</p>
                <img src="${recommendedBeer.image}" alt="${recommendedBeer.name}" width="200">
            `;
        } else {
            quizContainer.innerHTML += "<p>Geen passende bieren gevonden. Probeer andere keuzes!</p>";
        }
    }

    loadBeers();
});
