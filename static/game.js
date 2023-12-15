var playerID;
var currentState;
var timeOutDelay = 1000;
var timeOutAttempts = 0;
function waitForMove(){
    setTimeout(() => {
        getState();
        if(currentState.currentTurn !== playerID){
            if(timeOutAttempts === 9 && timeOutDelay < 10000){
                timeOutDelay += 1000;
                timeOutAttempts = 0;
            }
            else timeOutAttempts++;
            //waitForMove();
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
            console.log(200);
            currentState = xhr.response;
            updateBoard();
            checkWin();
            if(currentState.currentTurn !== playerID) waitForMove();
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
            checkWin();
            waitForMove();
        }
    }
    xhr.open("POST", "move/" + String(x), true);
    xhr.send();
}
function checkWin(){
    if(currentState.winner !== null){
        if(currentState.winner === playerID) alert("You win!");
        else alert("You lose.");
        window.location.href = "/";
    }
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
    getState(1);
    
        
})