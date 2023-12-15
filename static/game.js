var playerID;
var currentState;
var timeOutDelay = 1000;
var timeOutAttempts = 0;
var textField;
function waitForMove(){
    textField.innerText = "Waiting for your opponent...";
    setTimeout(() => {
        getState();
        if(currentState.currentTurn !== playerID){
            if(timeOutAttempts === 9 && timeOutDelay < 10000){
                timeOutDelay += 1000;
                timeOutAttempts = 0;
            }
            else timeOutAttempts++;
        }
        else{
            timeOutDelay = 1000;
            timeOutAttempts = 0;
        }
    }, timeOutDelay);
}
function getState(force = 0){
    var xhr = new XMLHttpRequest()
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            currentState = xhr.response;
            updateBoard();
            if(!checkWin()){
                if(currentState.currentTurn !== playerID) waitForMove();
                else textField.innerText = "It is your turn.";
            }
            if(force){
                document.querySelector("#join-code-field").innerText = "Game ID: " + String(currentState.id);
                document.querySelector("h1").classList.add("player" + String(playerID + 1));
            }
        }
    }
    xhr.open("GET", "state?force=" + String(force), true);
    xhr.send();
}
function dropChip(x){
    if(x === undefined) return;
    var xhr = new XMLHttpRequest()
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            currentState = xhr.response;
            updateBoard();
            if(!checkWin()) waitForMove();
        }
        else if (this.readyState == 4 && this.status == 400){
            textField.innerText = "That is not a valid move. Try again.";
        }
    }
    xhr.open("POST", "move/" + String(x), true);
    xhr.send();
}
function checkWin(){
    if(currentState.winner !== null && currentState.winner !== undefined){
        if(currentState.winner === playerID) textField.innerText = "You win!";
        else if (currentState.winner === -1) textField.innerText = "It's a draw."
        else textField.innerText = "You lose.";
        return 1;
    }
    return 0;
}
function updateBoard(){
    var grid = document.querySelector(".board")
    var columns = grid.querySelectorAll(".column")
    for(var x = 0; x < 7; x++){
        var cells = columns[x].querySelectorAll(".token")
        for(var y = 0; y < 6; y++){
            cells[5 - y].className = "token";
            if(currentState.grid[x][y] === 0) cells[5 - y].classList.add("player1");
            else if(currentState.grid[x][y] === 1) cells[5 - y].classList.add("player2");
        }
    }
}
window.addEventListener('DOMContentLoaded', function () {
    playerID = Number(document.querySelector(".board").dataset["playerId"]);
    var dropButtons = document.querySelectorAll(".drop-button");
    for(var i = 0; i < dropButtons.length; i++){
        dropButtons[i].addEventListener("click", function(){
            dropChip(Number(this.dataset.col));
        })
    }
    textField = document.querySelector("#game-status-field");
    getState(1);
})