
/* Player Factory Section */
function PlayerFactory(name, marker, type) {

    function getName() {
        return name;
    }
    function getMarker(){
        return marker;
    }
    function getType() {
        return type;
    }

    return{getName,getMarker,getType}
}

/* Ai Logic Section */
const AILogic = (function(){
    function getAllValidMoves() {
        const emptyGrids = [0,1,2,3,4,5,6,7,8].filter((grid)=>{
            return gameBoard.getBoardGrids()[grid] === null;
        })
        return emptyGrids;
    } 
    function randomMove(){
        const validGrids = getAllValidMoves();
        const randomMove = validGrids[Math.floor(Math.random() * validGrids.length)];
        return randomMove;
    }
    return {randomMove}
})();

/* Game Board Section */

const gameBoard = (function() {
    let _boardGrids = [ null,null,null,
                        null,null,null,
                        null,null,null];

    function getBoardGrids() {
        return _boardGrids;
    }

    function markGrid(grid, mark){
        const gridIndex = grid;
        _boardGrids[gridIndex] = mark;
    }
    function checkLegalGrid(grid) {
        const gridIndex = grid;
        return _boardGrids[gridIndex] ? false : true;
    }

    function checkWin(){
        if  (  _boardGrids[0] == game.getCurrentPlayer().getMarker() && _boardGrids[1] == game.getCurrentPlayer().getMarker() && _boardGrids[2] == game.getCurrentPlayer().getMarker()
            || _boardGrids[3] == game.getCurrentPlayer().getMarker() && _boardGrids[4] == game.getCurrentPlayer().getMarker() && _boardGrids[5] == game.getCurrentPlayer().getMarker()
            || _boardGrids[6] == game.getCurrentPlayer().getMarker() && _boardGrids[7] == game.getCurrentPlayer().getMarker() && _boardGrids[8] == game.getCurrentPlayer().getMarker()
            || _boardGrids[0] == game.getCurrentPlayer().getMarker() && _boardGrids[3] == game.getCurrentPlayer().getMarker() && _boardGrids[6] == game.getCurrentPlayer().getMarker()
            || _boardGrids[1] == game.getCurrentPlayer().getMarker() && _boardGrids[4] == game.getCurrentPlayer().getMarker() && _boardGrids[7] == game.getCurrentPlayer().getMarker()
            || _boardGrids[2] == game.getCurrentPlayer().getMarker() && _boardGrids[5] == game.getCurrentPlayer().getMarker() && _boardGrids[8] == game.getCurrentPlayer().getMarker()
            || _boardGrids[0] == game.getCurrentPlayer().getMarker() && _boardGrids[4] == game.getCurrentPlayer().getMarker() && _boardGrids[8] == game.getCurrentPlayer().getMarker()
            || _boardGrids[2] == game.getCurrentPlayer().getMarker() && _boardGrids[4] == game.getCurrentPlayer().getMarker() && _boardGrids[6] == game.getCurrentPlayer().getMarker())
            return true
        else return false
    };

    function checkDraw() {
        const emptyGrid = _boardGrids.filter((boardGrid) => boardGrid === null);
        return emptyGrid.length === 0 ? true : false;
    }

    function restartBoard() {
        _boardGrids = [ null,null,null,null,null,null,null,null,null];
    }

    return {markGrid, checkLegalGrid, checkWin, getBoardGrids, checkDraw, restartBoard};
})();

/* Game Rules Section */
const game = (function() {
    let _gameplayMode = null;
    let _player1 = null;
    let _player2 = null;
    let _currentPlayer = null;
    
    function switchTurns() {
        _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;  
    }
    function gameOver() {
        if(gameBoard.checkWin()){
            return 'win';
        }else if(gameBoard.checkDraw()){
            return 'draw';
        }else{
            return
        }
    }

    function getCurrentPlayer(){
        return _currentPlayer;
    }

    function setGameplayMode(gameplayMode) {
        _gameplayMode = gameplayMode;
    }

    function getGameplayMode(){
        return _gameplayMode;
    }

    function setSecondPlayer(name, marker, type) {
        _player2 = PlayerFactory(name, marker, type);
    }

    function setFirstPlayer(name, marker, type) {
        _player1 = PlayerFactory(name, marker, type);
    }

    function getFirstPlayer() {
        return _player1;
    }

    function getSecondPlayer() {
        return _player2;
    }

    function setStarterPlayer() {
        _currentPlayer = _player1;
    }

    function restartGame(){
        gameBoard.restartBoard();
        _gameplayMode = null;
        _player1 = null;
        _player2 = null;
        _currentPlayer = null;
    }

    return {switchTurns, gameOver, getCurrentPlayer, setGameplayMode, getGameplayMode, 
        setFirstPlayer, setSecondPlayer, getFirstPlayer, getSecondPlayer, setStarterPlayer,
        restartGame}
})();

/* display logic */
const displayController = (function() {
    const boardGrids = Array.from(document.querySelectorAll(".grid-cell"));
    boardGrids.forEach((gridCell) => {
        gridCell.addEventListener('click',gamePlay);
    });
    
    function gamePlay(event){
        let target = event.target;
        let gridCell = event.target.dataset.id;
        if(game.getGameplayMode() === "PvP"){
            if (gameBoard.checkLegalGrid(gridCell) && target.classList == "grid-cell"){
                fillGridCell(game.getCurrentPlayer().getMarker(),target);
                gameBoard.markGrid(gridCell,game.getCurrentPlayer().getMarker());
                if(game.gameOver() === "win"){
                    updateResultMessage(game.gameOver());
                    addStar(game.getCurrentPlayer());
                } 
                else if(game.gameOver() === "draw"){
                    updateResultMessage(game.gameOver());  
                }
                game.switchTurns()
                glowPlayerIcon(game.getCurrentPlayer());
            } else return;

        } else if(game.getGameplayMode() === "PvC"){
            if(game.getCurrentPlayer() == game.getFirstPlayer()){
                if (gameBoard.checkLegalGrid(gridCell) && target.classList == "grid-cell"){
                    fillGridCell(game.getCurrentPlayer().getMarker(),target);
                    gameBoard.markGrid(gridCell,game.getCurrentPlayer().getMarker());
                    if(game.gameOver() === "win"){
                        updateResultMessage(game.gameOver());
                        addStar(game.getCurrentPlayer());
                        return;
                    } 
                    else if(game.gameOver() === "draw"){
                        updateResultMessage(game.gameOver());
                        return;   
                    }
                    game.switchTurns();
                    glowPlayerIcon(game.getCurrentPlayer());
                } 
            }
            if(game.getCurrentPlayer() == game.getSecondPlayer()){
                AIMovement();
            }
        }
    }
    const fillGridCell = function(mark,target){
        if(mark === "X"){
            const mark = document.createElement("img");
            mark.src = "IMG/x.png" ;
            mark.classList.add("mark");
            target.appendChild(mark);
        } 
        else if(mark === "O"){
            const mark = document.createElement("img");
            mark.src = "IMG/o.png" ;
            mark.classList.add("mark");
            target.appendChild(mark);
        } 
    }
    const clearGridCell = function(){
        const boardGrids = Array.from(document.querySelectorAll(".grid-cell"));
        boardGrids.forEach(gridCell => gridCell.innerText = "");
    }
    
    const addStar = function(currentPlayer){
        const player1 = document.getElementById("p1-wins");
        const player2 = document.getElementById("p2-wins");
        if (currentPlayer.getMarker() == "X"){
            let star = document.createElement("img");
            star.src = "IMG/star.png";
            player1.appendChild(star);
        } else if (currentPlayer.getMarker() == "O"){
            let star = document.createElement("img");
            star.src = "IMG/star.png";
            player2.appendChild(star);
        }
    }
    const glowPlayerIcon = function(currentPlayer){
        const player1Icon = document.getElementById("p1-icon");
        const player2Icon = document.getElementById("p2-icon");
        if (currentPlayer.getMarker() == "X"){
            player1Icon.classList.add("active");
            player2Icon.classList.remove("active");
        } else if (currentPlayer.getMarker() == "O"){
            player1Icon.classList.remove("active");
            player2Icon.classList.add("active");
        }
    }
    const addModal = function(target){
        target.classList.add("active");
    }
    const removeModal = function (target){
        target.classList.remove("active");
    }
    const updatePlayerName = function(){
        const player1 = document.getElementById("p1-name");
        const player2 = document.getElementById("p2-name");
        player1.textContent = game.getFirstPlayer().getName();
        player2.textContent = game.getSecondPlayer().getName();

    }
    const updatePlayerIcon = function(){
        if(game.getSecondPlayer().getType() == "PvP"){
            const player2 = document.getElementById("p2-icon");
            const img = document.createElement("img");
            img.src = "IMG/user.png";
            player2.innerHTML = "";
            player2.appendChild(img);
            
        } else{
            const player2 = document.getElementById("p2-icon");
            const img = document.createElement("img");
            img.src = "IMG/computer.png";
            player2.innerHTML = "";
            player2.appendChild(img);
        }
    }
    const updateResultMessage = function(result){
        const overlay = document.querySelector(".overlay");
        const resultModal = document.querySelector(".modal-result");
        const resultMessage = document.getElementById("result");
        if (result == "win"){
            resultMessage.innerText = `${game.getCurrentPlayer().getName()} wins`;
            resultModal.classList.add("active");
            overlay.classList.add("active");
        } else if (result == "draw"){
            resultMessage.innerText = "Its a draw!!";
            resultModal.classList.add("active");
            overlay.classList.add("active");
        } else return
    }
    const AIMovement = function(){
        let aiMove = AILogic.randomMove();
        let target = boardGrids[aiMove];
        setTimeout(()=>{
            fillGridCell(game.getCurrentPlayer().getMarker(),target);
            gameBoard.markGrid(aiMove,game.getCurrentPlayer().getMarker());
            if(game.gameOver() === "win"){
                updateResultMessage(game.gameOver());
                addStar(game.getCurrentPlayer());
                return;
            } 
            else if(game.gameOver() === "draw"){
                updateResultMessage(game.gameOver());  
                return; 
            }
            game.switchTurns();
            glowPlayerIcon(game.getCurrentPlayer());
        
        }, 500);    
    }
    return{addModal,removeModal,updatePlayerName,updatePlayerIcon,glowPlayerIcon,clearGridCell}
})(); 

/* Start Game Modal Logic */
const modal = (function(){
    const modal = document.querySelector("#modal-container");
    modal.addEventListener("click",function(event){
        let target = event.target;
        const modalStartPage = document.querySelector(".modal-start-game");
        const modalPlayerName = document.querySelector(".modal-player-name");
        const modalPlayerNamePvC = document.querySelector(".modal-player-name-pvc");
        const modalResult = document.querySelector(".modal-result");
        const overlay = document.querySelector(".overlay");
        const player1Wins = document.getElementById("p1-wins");
        const player2Wins = document.getElementById("p2-wins");
        
        
        
        /* PvP Section */
        if(target.parentElement.id == "p2-icon-1"){
            displayController.removeModal(modalStartPage);
            displayController.addModal(modalPlayerName);
        }
        else if(target.id == "submit"){
            const userPlayer1Name = document.getElementById("user-player1");
            const userPlayer2Name = document.getElementById("user-player2");
            if(userPlayer1Name.value == "" || userPlayer2Name.value == ""){
                return
            } 
            else{
                game.restartGame();
                game.setGameplayMode("PvP");
                game.setFirstPlayer(userPlayer1Name.value,"X","PvP");
                game.setSecondPlayer(userPlayer2Name.value,"O","PvP");
                game.setStarterPlayer();
                displayController.clearGridCell();
                displayController.removeModal(modalPlayerName);
                displayController.removeModal(overlay);
                displayController.glowPlayerIcon(game.getCurrentPlayer());
                displayController.updatePlayerIcon();
                displayController.updatePlayerName();
                player1Wins.innerHTML = "";
                player2Wins.innerHTML = "";
            }

            
        }
        else if(target.id == "cancel"){
            displayController.removeModal(modalPlayerName);
            displayController.addModal(modalStartPage);
            
        }
        else if(target.id == "restart"){
            gameBoard.restartBoard();
            displayController.clearGridCell();
            displayController.removeModal(modalResult);
            displayController.removeModal(overlay);
            
        } else if (target.id == "reset"){
            displayController.removeModal(modalResult);
            displayController.addModal(modalStartPage);
            displayController.addModal(overlay);
            
        }
        /* PvC Section */
        if(target.parentElement.id == "p2-icon-2"){
            displayController.removeModal(modalStartPage);
            displayController.addModal(modalPlayerNamePvC);
        } 
        else if(target.id == "submit-pvc"){
            const userPlayer1Name = document.getElementById("user-player1-pvc");
            if(userPlayer1Name.value == ""){
                return
            } 
            else{
                game.restartGame();
                game.setGameplayMode("PvC");
                game.setFirstPlayer(userPlayer1Name.value,"X","PvC");
                game.setSecondPlayer("Cortana","O","PvC");
                game.setStarterPlayer();
                displayController.clearGridCell();
                displayController.removeModal(modalPlayerNamePvC);
                displayController.removeModal(overlay);
                displayController.glowPlayerIcon(game.getCurrentPlayer());
                displayController.updatePlayerIcon();
                displayController.updatePlayerName();
                player1Wins.innerHTML = "";
                player2Wins.innerHTML = "";
            }

            
        }
        else return
    })
})(); 