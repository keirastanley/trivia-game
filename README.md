# Know It All: A two-player trivia game

## How the game works

1. Both players can enter their names (this step is optional, player names are saved as Player 1 and Player 2 by default). 
2. 10 questions are shown on the screen and each player gets 5 alternating turns.
3. Scores are tracked on-screen and after the final question the winner (or a draw) is announced.

## About the code

#### Player names
The player names are "Player 1" and "Player 2" by default. If desired, players can type their name into the input box and upon clicking the "OK" button those names are displayed on the screen and also saved into variables that are used in gameply (e.g. "Player Name", it's your turn / Well done "Player Name", you won!"). The buttons and input box disappear once the user has entered their name. 

#### Questions
The trivia game takes its questions from an API (https://opentdb.com/api.php), loops through the data and pushes the questions to an array called "questions". This step allows for the user to specify which questions they would like to be excluded from the game (for example I have eliminated true or false questions to prevent issues with the 4-button design, as well as questions about video games / anime / manga to make the game more accessible to my parents who helped me do most of the gameplay testing!) 

        //Only include multiple choice questions
        if (data.results[i].type == "multiple"){
            //Remove video game, anime and manga questions
            if (data.results[i].category != "Entertainment: Video Games" && data.results[i].category != "Entertainment: Japanese Anime & Manga")
            {
                questions.push(data.results[i]);
            }
        }
        
Other advantages of pushing the questions into an array were that I could ran the data through a function that removes all HTML special entities before storing it and it also makes it easy to access the data outside of the async function to be used in the rest of the program.

#### Gameplay
`playerTurn`
When the player clicks the start button, a function called `playerTurn` is called, which determines whose go it is. I achieved this using if /else statements and a variable called `playTimes` that is set to 0 and increases by 1 each time a question is answered. `if (playTimes % 2 == 0)`, i.e. `playTimes` is an even number, it is player 1's turn. `else` it's player 2's turn. 

The appropriate player's name is highlighted and the screen informs that player using their name variable that it is their turn. After 1 second (`setTimeout(startGame, 1000)`), a function called `printQuestion` is called.

`printQuestion`
This function accesses the `question`, `category` and `difficulty` properties of `questions[playTimes]` (i.e. the first index in the questions array on the first go, the second on the second go etc.) and changes the `textContent` on the corresponding sections so that this information is displayed to the player. 
 
### *Areas I'm working on*

- Allow for "play again" functionality.
- Allow for single-player functionality.
- Allow player(s) to choose categories before answering questions.
- Make sure each player is answering questions of equal difficulty.
- Increase the difficulty of the questions over the course of the game.
