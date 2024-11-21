let word = document.getElementById('word');
let incorrectLetters = document.querySelector('.incorrect-letters');
let popup = document.getElementById('popup-container');
let finalMsg = document.getElementById('final-msg');
let playBtn = document.getElementById('play-btn');
let notification = document.getElementById('notification-container');

let figureParts = document.querySelectorAll('.figure-part');

let fetchedWord = "";
let correctLettersArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
let incorrectLettersArray = [];

async function apiFetch() {
    let api = await fetch('https://random-word-api.vercel.app/api?words');
    let data = await api.json();
    fetchedWord = data[0];
    console.log(fetchedWord);
    
    displayWord();
}

function displayWord() {
    word.innerHTML = `
        ${fetchedWord
            .split('')
            .map(letter => `<span class="letter">${correctLettersArray.includes(letter) ? letter : ""}</span>`)
            .join('')}
    `;

    let innerWord = word.innerText.replace(/\n/g, "");
    console.log(innerWord);

    if (innerWord === fetchedWord) {
        popup.style.display = "flex";
        finalMsg.innerText = "Congratulations! You Won!"
    }
}

function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function updateIncorrectLetters() {
    incorrectLetters.innerHTML = `
        ${incorrectLettersArray.length > 0 ? `<p>Incorrect Letters</p>` : ""}
        ${incorrectLettersArray.map(letter => `<span>${letter}</span>`)}
    `;

    figureParts.forEach((part,index) => {
        let errors = incorrectLettersArray.length
        if(index < errors){
            part.style.display = "block"
        }else{
            part.style.display = "none"
        }
    });

    if(incorrectLettersArray.length === figureParts.length){
        finalMsg.innerText = "You Lost!"
        popup.style.display = "flex";
    }
}

window.addEventListener('keydown', (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        let letter = e.key;

        if (fetchedWord.includes(letter)) {
            if (!correctLettersArray.includes(letter)) {
                correctLettersArray.push(letter);
                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!incorrectLettersArray.includes(letter)) {
                incorrectLettersArray.push(letter);
                updateIncorrectLetters();
            } else {
                showNotification();
            }
        }
    }
});

playBtn.addEventListener('click', () => {
    // window.location.reload()
    incorrectLettersArray.splice(0);
    correctLettersArray.splice(0);
    apiFetch();
    updateIncorrectLetters();
    popup.style.display = "none"
})

apiFetch();