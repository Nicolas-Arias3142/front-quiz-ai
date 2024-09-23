
//get ellements and add listeners to the buttons
let generateButton = document.getElementById('generateButton').addEventListener('click', getInputValue);
document.getElementById('answer1-btn').addEventListener('click', checkAnswer);
document.getElementById('answer2-btn').addEventListener('click', checkAnswer);
document.getElementById('answer3-btn').addEventListener('click', checkAnswer);
document.getElementById('answer4-btn').addEventListener('click', checkAnswer);
let answer = 0;

//ckeck for enter after puting in a topic 
let inputElement = document.getElementById('topicInput');
inputElement.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        getInputValue();
    }
})

async function getInputValue() {
    // Reset button colors
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById('answer' + i + '-btn');
        button.style.color = '#005C78';
    }

    // Get user input topic
    let inputTopic = inputElement.value.trim(); // Trim to remove extra whitespace
    if (!inputTopic) {
        alert('Please enter a topic before generating questions.');
        return;
    }

    let quiz = await main(inputTopic);
    quiz = quiz.split('\n');

    console.log(quiz);
    answer = quiz[5][16]; // Assuming correct answer position
    displayQuiz(quiz);
}

async function main(inputTopic) {
    try {
        //make sure the address is the same as the node https-server --cors address in the terminal 
        const response = await fetch('https://aeakribt2m5moug2irtvjgntfa0wbajo.lambda-url.ca-central-1.on.aws/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject: inputTopic})
            
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayQuiz(quiz) {
    let questionElement = document.getElementById('question-element');
    questionElement.textContent = quiz[0]; // Assuming quiz[0] is the question text

    // Assuming quiz[1] to quiz[4] are the answer options
    for (let i = 1; i <= 4; i++) {
        let element = document.getElementById('answer' + i + '-btn');
        element.textContent = quiz[i];
    }
}

function playRight(){
    var audioCorrect = new Audio('correct-choice-43861.mp3')
    audioCorrect.play();
}
function playWrong(){
    var audioWrong = new Audio('wronganswer2-output.mp3')
    audioWrong.play();
}

function checkAnswer(event) {
    if (event.target.id[6] == answer) {
        let button = document.getElementById(event.target.id);
        button.style.color = 'green';
        playRight();
    } else {
        let button = document.getElementById(event.target.id);
        button.style.color = 'red';
        playWrong();
    }
}
