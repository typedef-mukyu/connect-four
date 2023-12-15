function placeToken(){

}
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
window.addEventListener('DOMContentLoaded', function () {
    /*
     * Remember all of the initial post elements initially displayed in the page.
     */
    var newGameButton = document.querySelector("#New-Game-Button");
    newGameButton.addEventListener("click", newGame)
})

