async function render(pokemon) {  
    pokemon.forEach((poke) => {
        let card = document.getElementById("card-template").content.cloneNode(true);
        card.querySelector(".front_face").src = poke.sprites.other['official-artwork'].front_default;
        if (pokemon.length == 12) {
            card.querySelector(".card").style.width = "25%";
            document.getElementById("cards").style.width = "800px";
            document.getElementById("cards").style.height = "600px";
        } else if (pokemon.length == 24) {
            card.querySelector(".card").style.width = "16.66%";
            document.getElementById("cards").style.width = "800px";
            document.getElementById("cards").style.height = "600px";
        }
        document.getElementById("cards").appendChild(card);
    });
}

async function loadPokemon(difficulty) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${difficulty}`);
    let data = await response.json();
    // console.log(data.results);

    let pokemon = [];

    for (let i = 0; i < data.results.length; i++) {
        let poke = data.results[i];
    
        let pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.name}`);
        let pokeObj = await pokeResponse.json();
    
        pokemon.push(pokeObj);
        pokemon.push(pokeObj);
    }

    return pokemon;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function start() {
    let first;

    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", (event) => {
            if (card.querySelector("status").value == "locked") return;
            card.classList.toggle('flip');

            if (!first) {
                first = card;
            } else {
                if (first.querySelector(".front_face").src === card.querySelector(".front_face").src) {
                    console.log("right");
                    first.querySelector("status").value = "locked";
                    card.querySelector("status").value = "locked";
                } else {
                    console.log("wrong");
                    setTimeout(() => {
                        first.classList.toggle("flip");
                        card.classList.toggle("flip");
                        first = undefined;
                    }, 1000);
                }
            }
        });
    });
}

async function select(difficulty) {
    let pokemon = await loadPokemon(difficulty).then((pokemon) => (pokemon));
    shuffle(pokemon);
    render(pokemon).then(() => {
        document.getElementById("difficulty-select").style.display = "none";
        document.getElementById("game").style.display = "block";
        start();
    });
}
