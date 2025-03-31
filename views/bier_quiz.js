document.addEventListener("DOMContentLoaded", function () {
    let beerData = [];
    let currentStep = 0;
    let userChoices = {};

    async function loadBeers() {
        try {
            const response = await fetch("bieren.json"); // Zorg dat dit bestand correct is!
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
                options: ["Vlees", "Vis", "Vega"],
                key: "foodPairing"
            },
            {
                text: "Uit welk land wil je dat het biertje komt?",
                options: [...new Set(beerData.map(beer => beer.land))],
                key: "land"
            },
            {
                text: "Wil je een mild (<7%) of een sterk biertje (>7%)?",
                options: ["Mild", "Sterk"],
                key: "alcohol"
            },
            {
                text: "Welke biersoort wil je proberen?",
                options: [...new Set(beerData.map(beer => beer.categorie))],
                key: "categorie"
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

        let filteredBeers = beerData.filter(beer =>
            (!userChoices.foodPairing || beer.foodPairing.includes(userChoices.foodPairing)) &&
            (!userChoices.land || beer.land === userChoices.land) &&
            (!userChoices.alcohol || (userChoices.alcohol === "Mild" ? beer.alcohol < 7 : beer.alcohol >= 7)) &&
            (!userChoices.categorie || beer.categorie === userChoices.categorie)
        );

        if (filteredBeers.length > 0) {
            const recommendedBeer = filteredBeers[Math.floor(Math.random() * filteredBeers.length)];
            quizContainer.innerHTML += `<p>${recommendedBeer.naam} uit ${recommendedBeer.land} - ${recommendedBeer.alcohol}% - ${recommendedBeer.categorie}</p>`;
        } else {
            quizContainer.innerHTML += "<p>Geen passende bieren gevonden. Probeer andere keuzes!</p>";
        }
    }

    loadBeers();
});

