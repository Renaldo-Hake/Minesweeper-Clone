import React from "react";

/* The main goal of stats is to display to the user the amount of times they won compared 
to the amount of times they lost */
function Stats(props) {

    return(
        <div className="Timer">
            <h3>STATS</h3>
            <div className="display">
                <div id="Minutes">Won: {props.won}</div>
                <div id="Seconds">Lost: {props.lost}</div>
            </div>
        </div>
    )
}

export default Stats