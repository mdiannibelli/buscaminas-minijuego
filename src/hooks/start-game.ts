import { useEffect, useState } from "react";

export function useStartGame() {
    const $GRID_SIZE = 8
    const MATCHES = [
        [0, -1], 
        [0, 1], 
        [1, 0], 
        [-1, 0], 
        [1, -1], 
        [-1, -1], 
        [1, 1], 
        [-1, 1]
      ]
    const [bombsQuantity, setBombsQuantity] = useState(2)
    const [matrix, setMatrix] = useState(Array.from({length: $GRID_SIZE}, () => Array.from({length: $GRID_SIZE}, () => 0 as number | string)))
    useEffect(() => {
        const initialMatrix = Array.from({ length: $GRID_SIZE }, () => Array.from({ length: $GRID_SIZE }, () => 0 as number | string));
      
        // Put bombs in random places
        for(let i = 0; i < bombsQuantity; i++) {
          const colRandom = Math.floor(Math.random() * $GRID_SIZE) // 0 to 7
          const cellRandom = Math.floor(Math.random() * $GRID_SIZE)
        
          if(initialMatrix[colRandom][cellRandom] !== 'B') {
            initialMatrix[colRandom][cellRandom] = 'B'
          } //TODO If we have a 'B' re generate random col and cell
        }
      
        // Get index of cell
        for(let colIndex = 0; colIndex < initialMatrix.length; colIndex++) {
          for(let celIndex = 0; celIndex < initialMatrix[colIndex].length; celIndex++) {
          // 0 1, 0 2, 0 3, etc
          if(initialMatrix[colIndex][celIndex] === 'B') continue // Skip for below
          
          let bombCount = 0
      
          for(const match of MATCHES) {
            if(initialMatrix[colIndex + match[0]]?.[celIndex + match[1]] === 'B') {
              bombCount++
            }
          }
          //console.log(bombCount)
          initialMatrix[colIndex][celIndex] = bombCount
          } 
        }
      
        setMatrix(initialMatrix)
      }, [])
      return { matrix, setMatrix, $GRID_SIZE, bombsQuantity, setBombsQuantity }
}
