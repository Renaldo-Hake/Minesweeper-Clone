import React from "react";
import Cell from "./Cell";
import Help from "./Help";
import Stats from "./Stats";

/* The goal of the board is to create the board component with all the tiles involved and 
display it on the screen. This is basically the meat and potatoes of the project. */

/*
    TODO List:
    1. Populate board with tiles/mines -complete
    2. Left Click on tiles -complete
        a. Reveal tiles -complete
    3. Right Click on tiles -complete
        a. Mark tiles -complete
    4. Check for win/lose -complete
*/

// Main variables
const boardSize = 10;
let totalMines = 15;
let Won = 0
let Lost = 0

// All possible statuses a tile can have, this object will be used by another function to 
// change the status of the tile on click
const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"

}


class Board extends React.Component {
    state = {
        boardData: this.initBoardData(boardSize, totalMines),
        mineCount: totalMines,
        status: "Game in progress"
        
        // the below state only deals with the Help component
        
    }

    
    // Compiling the completed board
    initBoardData(boardSize, totalMines) {
        let board = this.Board(boardSize, totalMines);
        board = this.PlaceMines(board, boardSize, totalMines);
        board = this.getNumber(board)
        
        return board;
    }


    // Creating a 2d array 
    Board(boardSize, totalMines) {
        let board = [];

        for(let x = 0; x < boardSize; x++){
            //const row = []
            board.push([])
            for (let y = 0; y < boardSize; y++){
                board[x][y] = {
                    x,
                    y,
                    HIDDEN: true,
                    MINE: false,
                    NUMBER: 0,
                    MARKED: false
                }
                //row.push(tile);
            }
           // board.push(row);
        }
        console.log("board created")
        return board // empty board created
    }

    // Take the above 2d array and randomly place mines inside the array
    PlaceMines(board, boardSize, totalMines){
        let minesPlanted = 0;
        
        while (minesPlanted < totalMines) {
            let x = Math.floor(Math.random() * boardSize);
            let y = Math.floor(Math.random() * boardSize); 

            if (!(board[x][y].MINE)) {
              board[x][y].MINE = true;
              minesPlanted++;
            }
          }
          console.log("mines placed")
      
        return board;
    }

    // We need to be able to display to the user the amount of mines surrounding each cell
    getNumber(board){
        
        let updatedData = board;

        for(let a = 0; a < boardSize; a++){
            for(let b = 0; b < boardSize; b++){

                    let mine = 0;
                    // tiles surrounding each tile
                    let area = this.getSurroundingTiles(
                        updatedData[a][b].x, 
                        updatedData[a][b].y, 
                        updatedData
                    );
                        
                    for(let i = 0; i < area.length; i++){
                        if(area[i].MINE === true){
                            mine++
                        }
                    }

                    updatedData[a][b].NUMBER = mine;
            }
        }

        return updatedData;
    }

    // function gets all the tiles surrounding each tile and places them in an array
    getSurroundingTiles(x, y, data) {

        const tile = [];  
        
        //up
        if (x > 0) {
          tile.push(data[x - 1][y]);
        }   
        //down
        if (x < boardSize - 1) {
          tile.push(data[x + 1][y]);
        }  
        //left
        if (y > 0) {
          tile.push(data[x][y - 1]);
        }  
        //right
        if (y < boardSize - 1) {
          tile.push(data[x][y + 1]);
        }  
        // top left
        if (x > 0 && y > 0) {
          tile.push(data[x - 1][y - 1]);
        }  
        // top right
        if (x > 0 && y < boardSize - 1) {
          tile.push(data[x - 1][y + 1]);
        }  
        // bottom right
        if (x < boardSize - 1 && y < boardSize - 1) {
          tile.push(data[x + 1][y + 1]);
        }  
        // bottom left
        if (x < boardSize - 1 && y > 0) {
          tile.push(data[x + 1][y - 1]);
        }  
        
        return tile;
    }
        
    // This function will get all the hidden tiles and place them in an array
    getHidden(board){
        let totalHidden = [];
        board.map(row => {
            row.map(tile => {
                if(tile.HIDDEN === true){
                    totalHidden.push(tile);
                }
            })
        })

        return totalHidden.length
    }
    

    // this function will reveal the entire board
    revealBoard(board){
        board.map(row => {
            row.map(tile => {
                if(tile.HIDDEN === true || tile.MARKED){
                    tile.HIDDEN = false
                    tile.MARKED = false
                }
            })
        })
    }

    

    // CLICK HANDLERS
    //Left Click Handler
    handleClick(x, y){
        /* Each time the user clicks we need to check if he won or lost. we do this
        by checking if the amount of hidden tiles is equal to the amount of mines placed
        if so that means all the other tiles are not hidden and only the mines are hidden
        and thus the user wins else  if the user clicks on a mine he lost. */ 
        // this is the first thing we need to look for as you can lose at any time
        if(this.state.boardData[x][y].MINE){
            this.setState({status: "YOU LOST!"})
            this.revealBoard(this.state.boardData)
            Lost++
            sessionStorage.setItem("lost", Lost)
            alert("YOU LOST!")
        }

        // if the user selects a revealed tile or number tile we just return 
        if(
            this.state.boardData[x][y].HIDDEN === false || 
            this.state.boardData[x][y].MARKED === true){
            return;
        }

        const updatedData = this.state.boardData;
        // once a user clicks on a tile the tile should be revealed
        updatedData[x][y].HIDDEN = false;
        updatedData[x][y].MARKED = false;

        // if the user clicks a cell that is next to a mine the number of mines
        // should be made visible to the user
        updatedData[x][y].innerHTML = updatedData[x][y].NUMBER

        // if the user selects a tile that has no value like a number all other tiles that 
        // connect to that tile should be made visible to the user. Also the first tiles that
        // has value such as a number should be made visible to the user
        if (updatedData[x][y].NUMBER === 0) {
            this.revealZero(x, y, updatedData);
        }

        // Check to see of the user won or not
        this.state.boardData.map(row => {
            row.map(tile => {

                if (
                    tile.NUMBER > 0 ||
                    (tile.MINE === true &&
                        tile.HIDDEN === true ||
                        tile.MARKED === true
                        )
                ){
                    // to be able to win the amount of hidden tiles should be the same as the amount of mines
                    //here we check to see if the amount of hidden tiles equals the amount of mines
                    let totalRemaining = this.getHidden(updatedData)
                    if(totalRemaining === totalMines){
                        this.setState({status: "YOU WON!"})
                        this.revealBoard(updatedData)
                        Won++
                        sessionStorage.setItem("won", Won)
                        alert("YOU WON!")
                    } 
                }
            });
        });

        this.setState({
            boardData: updatedData,
        })
        
    }

    // Reveal a tile that has NUMBER = 0
    revealZero(x, y, board) {
        // tiles surrounding each tile
        let area = this.getSurroundingTiles(x, y, board); 

        area.map(tile => {
            if(
                tile.MARKED === false && 
                tile.HIDDEN === true && 
                (tile.MINE === false || tile.NUMBER > 0)
            ) {
                // reveal the tile the user clicked on
                tile.HIDDEN = false;
                if(tile.NUMBER == 0){
                    // continue revealing tiles that are empty 
                    this.revealZero(tile.x, tile.y, board)
                }
            }
        });

    // Looking to see if the user won after all the required tiles are revealed.

        return board
    }


    // Right Click Handler 
    handleContextMenu(event, x, y) {
        event.preventDefault();
        let mines = this.state.mineCount
        let updatedBoard = this.state.boardData
        if(
            updatedBoard[x][y].HIDDEN === false
            ){
            return
        }
    
        // Mark and unmark
        if ( updatedBoard[x][y].MARKED === true){
            updatedBoard[x][y].MARKED = false;
            mines++
            console.log(totalMines)
        }

        else{
            updatedBoard[x][y].MARKED = true;
            mines--;
            console.log(totalMines)
        }

        this.setState({
            boardData: updatedBoard,
            mineCount: mines,
          });

    }

    // Loop through to place each boardElement for the user to see
    renderBoardElement(board){
        return board.map((row) => {
            return row.map((tile) => {
                return (
                    <Cell 
                    onClick={() => this.handleClick(tile.x, tile.y)} 
                    cMenu={(e) => this.handleContextMenu(e, tile.x, tile.y)}
                    value={tile}
                    />
                )
            })
        })
    }

    // The user needs to be able to restart the game
    restart(){
        window.location.reload()
    }

    //Inform the user of the rules of the game
    help(){
        document.getElementById("Help").style.display = "block";
        document.getElementById("Board").style.display = "none";
    }

    // close the help component
    close() {
        document.getElementById("Help").style.display = "none";
        document.getElementById("Board").style.display = "inline-grid";
    }

    render(){
        return(
            <div>
                <div className="layout">
                    <div className="mineCount">
                        <h2>Total Mines: <br/> {this.state.mineCount}</h2>
                        <Stats 
                            won={sessionStorage.getItem("won")} 
                            lost={sessionStorage.getItem("lost")}
                        />
                    </div>
                    <div className="board" id="Board">
                        {this.renderBoardElement(this.state.boardData)}
                    </div>
                    <div id="Help">
                        <Help/>
                        <button className="button" onClick={this.close}>CLOSE</button>
                    </div>
                    <div className="timer">
                        <h2>Game Status: <br/> <span className="status">{this.state.status}</span></h2>
                    </div>
                </div>
                <div>
                <button onClick={this.restart} className="button">RESTART</button>
                <button onClick={this.help} className="button">HELP</button>
                </div>
            </div>
        );
    }
}

export default Board