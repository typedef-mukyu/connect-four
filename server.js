var path = require("path");
var express = require("express");

var app = express();
var port = process.env.PORT || 3000; // default port
var gameStates = require("./gameStates.json");

var exphbs = require("express-handlebars")

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set('views', './views');

function cellPlayerToClass(player){
    var outclass = "token";
    if(player === 0) outclass += " player1";
    else if(player === 1) outclass += " player2";
    return ("\"" + outclass + "\"");
}

function renderCell(n, player){
    var outputCell = "<div class=\"column\" data-row=\"" + String(n) + "\">";
    outputCell += "<div class=" + cellPlayerToClass(player) + ">";
    outputCell += "</div>";
    return outputCell;
}

function renderColumn(col){
    var outputCol = "<div class=\"column\">";
    for(var j = 5; j >= 0; j--){
        outputCol += renderCell(j, col[j]);
    }
    return outputCol;
}

function renderBoard(state){
    var outputHtml = "<div class=\"board\">";
    for(var i = 0; i < 7; i++){
        outputHtml += renderColumn(state.grid[i]);
    }
    return outputHtml;
}


function randomUniqueGameCode(){
    var i;
    do{
        i = Math.floor(Math.random() * 1000000);
    }while(gameStates[i] !== undefined);
    gameStates[i] = {};
    return i;
}

function newState(){
    var state = {};
    state.id = randomUniqueGameCode();
    state.currentTurn = 0;
    state.winner = null;
    state.newData = 0; // flag for 
    state.grid = Array(7).fill(Array(6).fill(null));
    gameStates[state.id] = state;
    return state.id;
}

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");
app.set('views', './views');

app.get("/", function(req, res, next){
    res.status(200).render("mainMenu");
});

app.post("/newgame", function(req, res, next){
    var newStateId = newState();
    res.status(201).set("Location", ("/games/" + String(newStateId) + "/player/0"));
    res.end();
})
app.get("/games/:n/player/:i", function(req, res, next){
    var x = Number(req.params.n);
    if(x === NaN || gameStates[x] === undefined){
        next();
    }
    else{
        var currentBoard = renderBoard(gameStates[x])
        console.log(currentBoard);
        res.status(200).render("game", {
            board: currentBoard
        });
    }    

})


app.use(express.static('static'));

app.get('*', function (req, res) {
    res.status(404).render("404");
})

app.listen(port, function () {
    console.log("== Server is listening on port", port);
})