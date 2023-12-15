var path = require("path");
var express = require("express");
var process = require("node:process");
var fs = require("node:fs");

var app = express();
var port = process.env.PORT || 3000; // default port
var gameStates = require("./gameStates.json");

var exphbs = require("express-handlebars");


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set('views', './views');
process.on("exit", () =>{
    console.log("Saving open games...")
    cleanUpGames();
    fs.writeFileSync("gameStates.json", JSON.stringify(gameStates));
})
function autoSaveLoop(){
    cleanUpGames();
    fs.writeFile("gameStates.json", JSON.stringify(gameStates), () => {
        setTimeout(autoSaveLoop, 60000);
    })
}

// Cleans up completed games or those abandoned for over two weeks.
function cleanUpGames(){
    for(var g = 0; g < gameStates.length; g++){
        if(gameStates.values()[g].winner !== null ||
           Date.now() - gameStates.values()[g].lastInteraction > 1209600000){
            delete gameStates[gamestates.keys()[g]]
            g--;
        }
    }
}

function cellPlayerToClass(player){
    var outclass = "token";
    if(player === 0) outclass += " player1";
    else if(player === 1) outclass += " player2";
    return ("\"" + outclass + "\"");
}

function renderCell(n, player){
    var outputCell = "<div class=\"cell\" data-row=\"" + String(n) + "\">";
    outputCell += "<div class=" + cellPlayerToClass(player) + "></div>";
    outputCell += "</div>";
    return outputCell;
}

function renderColumn(col){
    var outputCol = "<div class=\"column\">";
    for(var j = 5; j >= 0; j--){
        outputCol += renderCell(j, col[j]);
    }
    outputCol += "</div>";
    return outputCol;
}

function renderBoard(state){
    var outputHtml = ""
    for(var i = 0; i < 7; i++){
        outputHtml += renderColumn(state.grid[i]);
    }
    return outputHtml;
}

function generateButtons(){
    var outputHtml = "";
    for(var i = 0; i < 7; i++){
        outputHtml += "<button type=\"button\""
        +" class=\"drop-button\" data-col=\""
        + String(i) + "\">" + String(i + 1) + "</button>";
        // outputHtml += "<button type=\"button\" id=\"Column-"+ String(i + 1) 
        // +"\"class=\"drop-button\" data-col=\""
        // + String(i) + "\">" + String(i + 1) + "</button>";
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

function dropChip(state, x, p){
    var y = state.grid[x].indexOf(null);
    if(y === -1) return;
    else{
        state.lastInteraction = Date.now();
        state.grid[x][y] = p;
        checkWin(state);
        state.currentTurn = Number(!state.currentTurn) // pass turn to the other player
    }
}

function checkWinHoriz(state){
    var line = 0;
    for(var y = 0; y < 6; y++){
        line = 0;
        for(var x = 0; x < 7; x++){
            if(state.grid[x][y] === null) line = 0;
            else if(state.grid[x][y] === 0){
                if(line > 0) line = -1;
                else line--;
            }
            else if(state.grid[x][y] === 1){
                if(line < 0) line = 1;
                else line++;
            }
            if(line === -4){
                state.winner = 0;
                return;
            }
            else if(line === 4){
                state.winner = 1;
                return;
            }
        }
    }
}
function checkWinVert(state){
    var line = 0;
    for(var x = 0; x < 7; x++){
        line = 0;
        for(var y = 0; y < 7; y++){
            if(state.grid[x][y] === null) line = 0;
            else if(state.grid[x][y] === 0){
                if(line > 0) line = -1;
                else line--;
            }
            else if(state.grid[x][y] === 1){
                if(line < 0) line = 1;
                else line++;
            }
            if(line === -4){
                state.winner = 0;
                return;
            }
            else if(line === 4){
                state.winner = 1;
                return;
            }
        }
    }
}
function checkWin(state){
    checkWinHoriz(state);
    checkWinVert(state);
    checkWinDiag(state, 1);
    checkWinDiag(state, 0)
}
function checkWinDiag(state, direction){
    var upDiagonals = [[0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0]]
    var downDiagonals = [[0, 3], [0, 4], [0, 5], [1, 5], [2, 5], [3, 5]]
    var startingPos = direction? upDiagonals : downDiagonals;
    var line = 0;
    for(var i = 0; i < 6; i++){
        line = 0;
        pos = startingPos[i];
        x = pos[0]; y = pos[1];
        while(x >= 0 && x < 6 && y >= 0 && y < 6){
            if(state.grid[x][y] === null) line = 0;
            else if(state.grid[x][y] === 0){
                if(line > 0) line = -1;
                else line--;
            }
            else if(state.grid[x][y] === 1){
                if(line < 0) line = 1;
                else line++;
            }
            if(line === -4){
                state.winner = 0;
                return;
            }
            else if(line === 4){
                state.winner = 1;
                return;
            }
            x++; y += (direction? 1: -1);
        }
    }
}

function newState(){
    var state = {};
    state.id = randomUniqueGameCode();
    state.currentTurn = 0;
    state.winner = null;
    state.lastInteraction = Date.now(); // flag for 
    state.grid = Array(7);
    for(var i = 0; i < 7; i++) state.grid[i] = Array(6).fill(null);
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
    res.status(201).set("Location", ("/games/" + String(newStateId) + "/player/0/play"));
    res.end();
})
app.get("/games/:n/player/:p/play", function(req, res, next){
    var n = Number(req.params.n);
    var p = Number(req.params.p);
    if(n === NaN || gameStates[n] === undefined){
        next();
    }
    else{
        var currentBoard = renderBoard(gameStates[n])
        res.status(200).render("game", {
            pid: String(p),
            board: currentBoard,
            buttons: generateButtons()
        });
    }    
})
app.post("/games/:n/player/:p/move/:x", function(req, res, next){
    var n = Number(req.params.n);
    var p = Number(req.params.p);
    var x = Number(req.params.x);
    if(n === NaN || gameStates[n] === undefined) next();
    else if(gameStates[n].winner !== null) res.status(410).end();
    else if(gameStates[n].currentTurn !== p) res.status(429).end();
    else if(x < 0 || x > 6 || p < 0 || p > 1) res.status(400).end();
    else if(gameStates[n].grid[x].indexOf(null) == -1) res.status(400).end();
    else{
        dropChip(gameStates[n], x, p);
        res.status(200).json(gameStates[n]);
    }
})

app.get("/games/:n/player/:p/state", function(req, res, next){
    console.log("state")
    var n = Number(req.params.n);
    var p = Number(req.params.p);
    if(n === NaN || gameStates[n] === undefined) next();
    else if(p < 0 || p > 1){
        res.status(400).end();
        
    }
    else{
        console.log(!req.query.force && gameStates[n].currentTurn !== p)
        if(!req.query.force && gameStates[n].currentTurn !== p){
            res.status(304).end();
        }
        else res.status(200).json(gameStates[n]);
    }
    
})

app.use(express.static('static'));

app.get('*', function (req, res) {
    res.status(404).render("404");
})

app.listen(port, function () {
    console.log("== Server is listening on port", port);

})