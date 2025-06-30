document.addEventListener("DOMContentLoaded", function () {
    let beerData = [];
    let currentStep = 0;
    let userChoices = {};

    async function loadBeers() {
        try {
            const response = await fetch("bieren.json"); // ✅ Haalt bieren op uit MongoDB
            beerData = await response.json();
            console.log("📢 Bieren geladen:", beerData); // Debugging
            // console.log("pairing:", beerData[0][food_pairing]);
            showQuestion();
        } catch (error) {
            console.error("❌ Fout bij laden van de bieren:", error);
        }

    }

    function showQuestion() {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "";
        const questionIndexEl = document.getElementById("question-index");
        const innerElement = document.querySelector(".inner");

        // Update vraagnummer
        questionIndexEl.textContent = `Vraag ${currentStep + 1}`;

        // Update class voor animatie
        innerElement.className = `inner inner${currentStep + 1}`;

    
        const questionData = [
            {
                text: "Wat voor eten heb je zin in?",
                options: [...new Set(beerData.beers.map(beer => beer.food_pairing))],
                key: "food_pairing",
            },
            {
                text: "Uit welk land wil je dat het biertje komt?",
                options: [...new Set(beerData.beers.map(beer => beer.country))],
                key: "country",
            },
            {
                text: "Wil je een mild (<7%) of een sterk biertje (>7%)?",
                options: ["Mild", "Sterk"],
                key: "alcohol",
            },
            {
                text: "Welke biersoort wil je proberen?",
                options: [...new Set(beerData.beers.map(beer => beer.sub_category_2))],
                key: "sub_category_2",
            },
        ];

        if (currentStep < questionData.length) {
            const question = questionData[currentStep];
            const questionEl = document.createElement("h2");
            questionEl.textContent = question.text;
            quizContainer.appendChild(questionEl);

            question.options.forEach((option, index) => {
                const button = document.createElement("button");
                const letter = String.fromCharCode(65 + index);
                button.textContent = `${letter}. ${option}`;
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

        // Filter bieren op basis van de keuzes van de gebruiker
        let filteredBeers = beerData.beers.filter(beer =>
            (!userChoices.food_pairing || beer.food_pairing.includes(userChoices.food_pairing)) &&
            (!userChoices.country || beer.country === userChoices.country) &&
            (!userChoices.alcohol || (userChoices.alcohol === "Mild" ? parseFloat(beer.abv) < 7 : parseFloat(beer.abv) >= 7)) &&
            (!userChoices.sub_category_2 || beer.sub_category_2 === userChoices.sub_category_2)
        );

        if (filteredBeers.length > 0) {
            const recommendedBeer = filteredBeers[Math.floor(Math.random() * filteredBeers.length)];
            quizContainer.innerHTML += `
                <p><strong>${recommendedBeer.name}</strong> uit ${recommendedBeer.country} - ${recommendedBeer.abv}% - ${recommendedBeer.sub_category_2}</p>
                <img src="${recommendedBeer.image}" alt="${recommendedBeer.name}" width="200">
                <button class="bookmark-btn" data-beer-id="${recommendedBeer._id}">
                    <i class="far fa-bookmark"></i> Opslaan
                </button>
            `;
        } else {
            quizContainer.innerHTML += "<p>Geen passende bieren gevonden. Probeer andere keuzes!</p>";
        }

        // Bookmark functionaliteit
        document.querySelector(".bookmark-btn")?.addEventListener("click", function () {
            saveBeerToFavorites(this.getAttribute("data-beer-id"));
        });
    }

    function saveBeerToFavorites(beerId) {
        fetch("/save-beer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ beerId }),
        })
        .then(async (response) => {
            if (response.status === 401) {
                const errorText = await response.text(); // <-- Tekst uit server.js
                alert(` ${errorText}`);
                return;
            }
    
            if (!response.ok) {
                throw new Error("Er ging iets anders fout bij het opslaan.");
            }
    
            const data = await response.json();
            alert("🍺 Biertje opgeslagen in favorieten!");
        })
        .catch(error => {
            console.error("❌ Fout bij opslaan:", error);
            alert("❌ Er ging iets mis bij het opslaan van het biertje.");
        });
    }    

    function showPopup(message) {
        const popup = document.getElementById("popup");
        const popupMessage = document.getElementById("popup-message");
      
        popupMessage.textContent = message;
        popup.style.display = "block";
      
        // Automatisch verbergen na 4 seconden
        setTimeout(() => {
          popup.style.display = "none";
        }, 4000);
      }
    

    loadBeers();
});
