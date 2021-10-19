import React from "react";

/* The cell component can be seen as each individual tile of the board. Each cell will have 
a set of properties to depict if they contain a mine, number or is flagged */ 
class Cell extends React.Component{


  getValue() {
    const {value} = this.props;
    if (value.MARKED) {
      return this.props.value.MARKED ? "❗" : null;
    }
    
    if(value.HIDDEN){
      return
    }
   
    if (value.MINE) {
      return this.props.value.MINE ? "💣" : null;
    }

    if(value.NUMBER > 0){
      return this.props.value.NUMBER; 
    }
  }

    render(){
      const { value, onClick, cMenu } = this.props;
      let className = "";
      if (value.HIDDEN){ className = "hidden"}
      else if(value.MINE){className = "mine"}
      else{className = "Cell"}
        return(
            <div 
            className={className} 
            onClick={onClick}
            onContextMenu={cMenu}
            > {this.getValue()} </div>
        )
    }
}




export default Cell
 