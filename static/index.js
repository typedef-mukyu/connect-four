var newGameButton;
var joinGameButton;
var modalBackdrop;
var joinGameModal;
var cancelButtons;
var acceptButton;
function newGame(){
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 201){
            window.location.href = this.getResponseHeader("Location");
        }
    }
    xhr.open("POST", "/newgame", true);
    xhr.send();
}
function joinGame(){
    var gameID = Number(document.querySelector(".join-game-number #text-input").value);
    var xhr = new XMLHttpRequest();
    var gameUrl = "/games/" + String(gameID) + "/player/1/play";
    xhr.onreadystatechange = function(){
        if(this.readyState == 4){
            if(this.status == 200){
                window.location.href = gameUrl;
            }
            else{
                alert("Join code invalid.");
            }
        }
        
    }
    xhr.open("GET", gameUrl, true);
    xhr.send();

}
function showJoinGameModal(){
    modalBackdrop.classList.remove("hidden");
    joinGameModal.classList.remove("hidden");
    for(var i = 0; i < cancelButtons.length; i++){
        cancelButtons[i].addEventListener("click", hideJoinGameModal);
    }
    acceptButton.addEventListener("click", joinGame);

    
}
function hideJoinGameModal(){
    for(var i = 0; i < cancelButtons.length; i++){
        cancelButtons[i].removeEventListener("click", hideJoinGameModal);
    }
    acceptButton.removeEventListener("click", joinGame);
    modalBackdrop.classList.add("hidden");
    joinGameModal.classList.add("hidden");
}
window.addEventListener('DOMContentLoaded', function () {
    /*
     * Remember all of the initial post elements initially displayed in the page.
     */
    newGameButton = document.querySelector("#new-game-button");
    newGameButton.addEventListener("click", newGame);
    joinGameButton = document.querySelector("#join-room-button");
    joinGameButton.addEventListener("click", showJoinGameModal);
    modalBackdrop = document.querySelector("#modal-backdrop");
    joinGameModal = document.querySelector("#join-game-modal");
    cancelButtons = document.querySelectorAll(".modal-hide-button");
    acceptButton = document.querySelector("#modal-accept");

})

