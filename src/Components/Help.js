import React from "react";

function Help(){
    return(
        <div className="Help">
            <h2>RULES OF THE GAME</h2>
            <ul>
                <li>The goal of the game is to find all the mines on the board.</li>
                <li>Click on the cell to reveal the cell, if the cell is a mine you loose.</li>
                <li>
                    If the cell you clicked is not a mine, it will display a number of how many
                    mines is around that cell.
                </li>
                <li>You can flag a field by right clicking it.</li>
                <li>
                    You win the game if you are able to reveal all the cells that is not a mine or 
                    you have flagged all the cells that is a mine.
                </li>
            </ul>
        </div>
    )
}


export default Help