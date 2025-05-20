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
    let offset = Math.floor((Math.random() * 1000) + 1);
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${difficulty}`);
    let data = await response.json();

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

let gameLocked = false;
let countdown;

function start(total) {
    document.getElementById("remaining").innerHTML = total;
    let first;
    let second;
    let correct = 0;
    let clicks = 0;
    let remaining = total;
    let lastCorrect = false;

    // Display initial timer
    let time = 5 * (total * 1); // seconds
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    document.getElementById("timer").innerHTML = `${minutes > 0 ? '' + minutes + 'm ' : ''} ${seconds}s`;

    countdown = setInterval(() => {
        time--;

        minutes = Math.floor(time / 60);
        seconds = time % 60;

        document.getElementById("timer").innerHTML = `${minutes > 0 ? '' + minutes + 'm ' : ''} ${seconds}s`;

        if (time <= 0) {
            clearInterval(countdown);
            alert("You lost!");
        }
    }, 1000);

    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", (event) => {
            if ((first && second) && (first != card && second != card)) return;
            if (card.querySelector(".status").value == "locked") return;
            clicks++;
            document.getElementById("clicks").innerHTML = clicks;
            card.querySelector(".status").value = "locked";
            card.classList.toggle('flip');

            if (!first) {
                first = card;
            } else {
                second = card;
                if (first.querySelector(".front_face").src === card.querySelector(".front_face").src) {
                    if (lastCorrect) {
                        time += 5; // add 5 seconds if 2 in a row correct
                        document.getElementById("message").innerHTML = "+5 Seconds"
                        document.getElementById("message-box").style.display = "block";
                        setTimeout(() => { document.getElementById("message-box").style.display = "none" }, 2500);
                    }
                    lastCorrect = true;
                    correct++;
                    remaining--;
                    document.getElementById("matched").innerHTML = correct;
                    document.getElementById("remaining").innerHTML = remaining;
                    if (correct == total) {
                        gameLocked = false;
                        clearInterval(countdown);
                        setTimeout(() => {
                            alert(`You won with ${time} seconds remaining. Completed in ${clicks} clicks.`);
                        }, 750);
                    }
                    first = undefined;
                    second = undefined;
                } else {
                    lastCorrect = false;
                    setTimeout(() => {
                        first.classList.toggle("flip");
                        card.classList.toggle("flip");
                        first.querySelector(".status").value = "unlocked";
                        card.querySelector(".status").value = "unlocked";
                        first = undefined;
                        second = undefined;
                    }, 750);
                }
            }
        });
    });
}

async function select(difficulty) {
    if (gameLocked) return;
    else gameLocked = true;
    let pokemon = await loadPokemon(difficulty).then((pokemon) => (pokemon));
    shuffle(pokemon);
    render(pokemon).then(() => {
        document.getElementById("difficulty-select").style.display = "none";
        document.getElementById("game").style.display = "block";
        start(difficulty);
    });
}

function reset() {
    gameLocked = false;
    clearInterval(countdown);
    document.getElementById("cards").innerHTML = "";
    document.getElementById("game").style.display = "none";
    document.getElementById("difficulty-select").style.display = "block";
}

let light = true;
function toggleTheme() {
    if (light) {
        document.getElementById("body").style.backgroundColor = "#2f3233";
        document.querySelectorAll(".theme-text").forEach((e) => {
            e.style.color = "white";
        });
        light = false;
    } else {
        document.getElementById("body").style.backgroundColor = "white";
        document.querySelectorAll(".theme-text").forEach((e) => {
            e.style.color = "black";
        });
        light = true;
    }
}
