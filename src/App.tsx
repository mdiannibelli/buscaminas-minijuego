import { useEffect, useState } from "react"
import { Square } from "./components/Square"

const GAME_STATUS = {
  PLAYING: 'is-playing',
  WON: 'won',
  LOST: 'lost'
}

function App() {
  const $GRID_SIZE = 8
  const [matrix, setMatrix] = useState(Array.from({length: $GRID_SIZE}, () => Array.from({length: $GRID_SIZE}, () => 0 as number | string)))
  const [cellClicked, setCellClicked] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING)
  const [score, setScore] = useState(0)

const $BOMBS_QUANTITY = 4
//const MATRIX = Array.from({length: $GRID_SIZE}, () => Array.from({length: $GRID_SIZE}, () => 0 as number | string)) // Array containing 8 arrays with each value 0
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



// Random bombs
useEffect(() => {
  for(let i = 0; i < $BOMBS_QUANTITY; i++) {
    const colRandom = Math.floor(Math.random() * $GRID_SIZE) // 0 to 7
    const cellRandom = Math.floor(Math.random() * $GRID_SIZE)
  
    if(matrix[colRandom][cellRandom] !== 'B') {
      matrix[colRandom][cellRandom] = 'B'
    } //TODO If we have a 'B' re generate random col and cell
  }
}, [matrix])

// [0, 0, 0, 0, 0, 0, 0, 0]
// [0, X, 0, 0, 0, 0, 0, 0] // COL = 1 , CELL = 1 so find 8 matches
// [0, 0, 0, 0, 0, 0, 0, 0]
// [0, 0, 0, 0, 0, 0, 0, 0]
// [0, 0, 0, 0, 0, 0, 0, 0]
// [0, 0, 0, 0, 0, 0, 0, 0]
// [0, 0, 0, 0, 0, 0, 0, 0]
// [0, 0, 0, 0, 0, 0, 0, 0]

// Get index of cell
for(let colIndex = 0; colIndex < matrix.length; colIndex++) {
  for(let celIndex = 0; celIndex < matrix[colIndex].length; celIndex++) {
    // 0 1, 0 2, 0 3, etc
    if(matrix[colIndex][celIndex] === 'B') continue // Skip for below
    
    let bombCount = 0

    for(const match of MATCHES) {
      if(matrix[colIndex + match[0]]?.[celIndex + match[1]] === 'B') {
        bombCount++
      }
    }

    //console.log(bombCount)

    matrix[colIndex][celIndex] = bombCount
  }
}

  const handleClick = (colIndex:string, celIndex:string) => {
    const cellToAdd = `${colIndex}-${celIndex}`

    checkIfWeWon()
    checkIfWeFoundBomb(colIndex, celIndex)
    setCellClicked([...cellClicked, cellToAdd])

    // Add score
    if(matrix[parseInt(colIndex)][parseInt(celIndex)] !== 'B') {
      setScore(score+1)
    }
  }

  const checkIfWeFoundBomb = (colIndex:string, celIndex:string) => {
    if(matrix[parseInt(colIndex)][parseInt(celIndex)] === 'B') {
      setGameStatus(GAME_STATUS.LOST)
    }
  }

  const checkIfWeWon = () => {
    const clicksQuantity = Math.pow($GRID_SIZE, 2) - $BOMBS_QUANTITY
    if(cellClicked.length === clicksQuantity && gameStatus === 'is-playing') {
      setGameStatus(GAME_STATUS.WON)
    }
  }

  const reloadGame = () => {
    setGameStatus(GAME_STATUS.PLAYING)
    setScore(0)
    setMatrix(Array.from({length: $GRID_SIZE}, () => Array.from({length: $GRID_SIZE}, () => 0 as number | string)))
    setCellClicked([])
    //window.location.reload()
  }



  return (
    <main className="min-h-screen flex flex-col justify-center items-center mt-6">
      <h1 className="text-5xl text-white mb-8 uppercase font-bold">Buscaminas</h1>
      <span className="text-lg text-white mb-4">Puntuación: <strong>{score}</strong></span>
      {gameStatus === 'lost' &&
        <div className="flex flex-col">
          <h1 className="text-red-500 mb-4 text-2xl">Has perdido!</h1>
          <button onClick={reloadGame} className="text-white my-4 border-[1px] border-gray-600 rounded hover:bg-gray-500 duration-300">Volver a jugar</button>
        </div>
      }
      {gameStatus === 'won' &&
        <div className="flex flex-col">
          <h1 className="text-green-500 mb-4 text-2xl">Has ganado!</h1>
          <button onClick={reloadGame} className="text-white my-4 border-[1px] border-gray-600 rounded hover:bg-gray-500 duration-300">Volver a jugar</button>
        </div>
      }
      <section className="grid grid-cols-4 md:grid-cols-board-cols grid-flow-row justify-center p-4">
        {
          matrix.map((col, colIndex) => (
            <article key={colIndex}>
              {
              col.map((cell, cellIndex) => 
                <Square 
                square={cell} 
                cellClicked={cellClicked} 
                handleClick={handleClick} 
                key={`${colIndex}-${cellIndex}`} 
                gameStatus={gameStatus}
                keyToCheck={`${colIndex.toString()}-${cellIndex.toString()}`}/>
                )}
            </article>
          ))
        }
      </section>
    </main>
  )
}

export default App
