//An empty array to store the questions that will be used in the game
let questions = [];
//Set the number of times the game has been played as 0
let playTimes = 0;
//Set each player's name as Player 1 and Player 2 by default
let player1 = "Player 1"; 
let player2 = "Player 2"; 
//Set each player's score to 0
let player1Score = 0;
let player2Score = 0;

//Store the parts of the html that we will be manipulating during gameplay
let player1box = document.querySelector("#div-player-1-box");
let player2box = document.querySelector("#div-player-2-box");
let input1 = document.querySelector("#player-1-input");
let input2 = document.querySelector("#player-2-input");
let ok1 = document.querySelector("#player-1-button");
let ok2 = document.querySelector("#player-2-button");
let startButton = document.querySelector("#start-button");
let category = document.querySelector("#category");
let difficulty = document.querySelector("#difficulty");
let main = document.querySelector("#main-text");
let main2 = document.querySelector(".main2");

//Call the function to retrieve 20 questions from the API and store them in our questions array
getQuestions();

//Add event listeners to the OK boxes so that, on click, the corresponding function to set the names is called
ok1.addEventListener("click", player1Name);
ok2.addEventListener("click", player2Name);

//Add an event listener to the start button so that, on click, a function to determine whose turn it is and start the game is called
startButton.addEventListener("click", playerTurn);

//Function that retrieves questions from the API
async function getQuestions(){
    let response = await fetch(`https://opentdb.com/api.php?amount=50`);
    let data = await response.json();
    for (let i = 0; i < data.results.length; i++) {
        //Remove HTML elements
        data.results[i].question = decodeHtml(data.results[i].question);
        data.results[i].correct_answer = decodeHtml(data.results[i].correct_answer);
            for (let j = 0; j < 3; j++){
            data.results[i].incorrect_answers[j] = decodeHtml(data.results[i].incorrect_answers[j]);
            }
        if (data.results[i].type == "multiple"){
            //Remove video game, anime and manga questions
            if (data.results[i].category != "Entertainment: Video Games" && data.results[i].category != "Entertainment: Japanese Anime & Manga"){
                questions.push(data.results[i]);
            }
        }
    }
}

//Set the player 1 name variable to user input and print their name in the box
function player1Name(){
    player1 = input1.value;
    player1box.textContent = `${player1}: ${player1Score}`;
    //Remove the OK button once it's been used
    ok1.remove();
    //Remove the input box
    input1.remove();
    
}

//Set the player 2 name variable to user input and print their name in the box
function player2Name(){
    player2 = input2.value;
    player2box.textContent = `${player2}: ${player2Score}`;
    //Remove the OK button once it's been used
    ok2.remove();
    //Remove the input box
    input2.remove();
}

//Function to determine whose turn it is, inform the players and start the game
function playerTurn (){
        //Remove the OK buttons once it's been used
        ok1.remove();
        ok2.remove();
        //Remove the input boxes
        input1.remove();
        input2.remove();
        //Put the scores on the screen
        player1box.textContent = `${player1}: ${player1Score}`;
        player2box.textContent = `${player2}: ${player2Score}`;
        //When playTimes is an even number, it's player 1's turn
        if (playTimes % 2 == 0) {
            //The main text informs the players whose turn it is 
            main.textContent = `${player1}, it's your turn.`;
            //This info stays on the screen for 1 second and then the game begins
            setTimeout(startGame, 1000);
            //Highlight the box of the player whose turn it is
            player1box.style.backgroundColor = "#fecddc";
            player1box.style.borderColor = "red";
            //Set the other box to it's normal colours
            player2box.style.backgroundColor = "#fff1e1";
            player2box.style.borderColor = "black";
        }
        //When playTimes is an odd number, it's player 2's turn
        else {
            main.textContent = `${player2}, it's your turn.`;
            setTimeout(startGame, 1000);
            player2box.style.backgroundColor = "#fecddc";
            player2box.style.borderColor = "red";
            player1box.style.backgroundColor = "#fff1e1";
            player1box.style.borderColor = "black";
        }
        if (playTimes > 0) {
            let buttons = document.querySelectorAll("button");
            for (i = 0; i < 4; i++) { 
                //Select each button
                buttons[i].textContent = ("");
                buttons[i].style.backgroundColor = "#fecddc";
                buttons[i].style.color = "black";
            }
        } 
}

//This function starts the game by calling the function that puts the first question on the screen
function startGame(){
    printQuestion(); 
}

//Function to put questions and answers on the screen
function printQuestion(){
    if (playTimes < 10) {
    //The main text displays a question from the questions array
    main.textContent = `Question ${playTimes+1}/${10}: ${questions[playTimes].question}`;
    //Show the category
    category.textContent = `${questions[playTimes].category}`;
    //Show the difficulty
    difficulty.textContent = `${questions[playTimes].difficulty}`;
    //Put all possible answers into an array
    let answers = [
        `${questions[playTimes].correct_answer}`, 
        `${questions[playTimes].incorrect_answers[0]}`, 
        `${questions[playTimes].incorrect_answers[1]}`, 
        `${questions[playTimes].incorrect_answers[2]}`
    ];
    //Shuffle the array to randomise the order of the answers
    shuffle(answers);
    //If we're on the first question...
    if (playTimes < 1) {
        //Assign each answer to the text content of a button to be displayed on the screen
        for (i = 0; i < answers.length; i++) { 
        //Create each button
        let newButton = document.createElement("button");
        //Append the buttons to "main2", the area beneath the question
        main2.appendChild(newButton);
        //Add an id to each button
        newButton.id = (`#button${i}`);
        //Set the padding
        newButton.style.padding = "40px";
        //Set the textContent to be one of the answers
        newButton.textContent = (`${answers[i]}`);
        //Add an event listener so that, on click, the function to the determine if the player's answer was correct is called
        newButton.addEventListener("click", correctAnswer);
        }
    }
    //After question 1...
    if (playTimes > 0) {
        let buttons = document.querySelectorAll("button");
        for (i = 0; i < answers.length; i++) { 
            //Select each button
            buttons[i].textContent = (`${answers[i]}`);
            buttons[i].style.backgroundColor = "#fecddc";
            buttons[i].style.color = "black";
        }
    }
}

}

//Function to determine if the answer was correct, update the score and pull up the next question
function correctAnswer(event){

    let incorrectAnswers = [];
    for (let i = 0; i < 3; i++) {
        incorrectAnswers.push(questions[playTimes].incorrect_answers[i]);
    }
    
    //Select all the buttons
    let buttons = document.querySelectorAll("button");
    //Loop through the first 4 (the answer buttons) to find the one with the correct answer
    for (i = 0; i < 4; i++) { 
        //If the button contains the right answer change its colours to green and white
        if (buttons[i].textContent == questions[playTimes].correct_answer){
                buttons[i].style.backgroundColor = "#31ad54";
                buttons[i].style.color = "white";
        }
    }
    //If player 1 got the right answer
    if (playTimes % 2 == 0 && event.target.textContent == questions[playTimes].correct_answer){
        //Inform the players  
        main.textContent += " Correct! Well done!";
        //Update their score variable by 1
        player1Score++;
        //Update their on-screen score by 1
        player1box.textContent = `${player1}: ${player1Score}`;
        //Update the playTimes variable by 1
        playTimes++;
        //Change the start button to say "Next"
        startButton.textContent = "Next";
        if (endGame() == true) {
            setTimeout(determineWinner, 1000);
        }
    }
    //If player 2 got the right answer...
    if (playTimes % 2 == 1 && event.target.textContent == questions[playTimes].correct_answer) {
        //Inform the players  
        main.textContent += " Correct! Well done!";
        //Update their score by 1
        player2Score++;
        //Update their on-screen score by 1
        player2box.textContent = `${player2}: ${player2Score}`;
        //Update the playTimes variable by 1
        playTimes++;
        //Change the start button to say "Next"
        startButton.textContent = "Next";
        if (endGame() == true) {
            setTimeout(determineWinner, 2000);
        }
    }
    //If the answer was wrong...
    if (incorrectAnswers.includes(event.target.textContent)) {
        //Inform the players
        main.textContent += " Sorry, not quite.";
        event.target.style.backgroundColor = "red";
        event.target.style.Color = "white";
        //Update the playTimes variable by 1
        playTimes++;
        //Change the start button to say "Next"
        startButton.textContent = "Next";
        if (endGame() == true) {
            setTimeout(determineWinner, 2000);
        }
    }
}

//Function to shuffle an array
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function determineWinner() {
    let buttons = document.querySelectorAll("button");
    for (i = 0; i < 4; i++) { 
        buttons[i].remove();
    }
    if (player1Score > player2Score) {
        main.textContent = `Well done ${player1}, you won!`;
    }
    if (player2Score > player1Score) {
        main.textContent = `Well done ${player2}, you won!`;
    }
    if (player1Score == player2Score) {
        main.textContent = "It's a draw!";
    }
}

//Function to decode the text
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function endGame() {
    startButton.remove();
    player1box.style.backgroundColor = "#fff1e1";
    player1box.style.borderColor = "black";
    player2box.style.backgroundColor = "#fff1e1";
    player2box.style.borderColor = "black";
    if (playTimes > 9) {
        return true;
    }
    else {
        return false;
    }
}