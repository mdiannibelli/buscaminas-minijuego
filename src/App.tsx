import { useEffect, useState } from "react"
import { Square } from "./components/Square"
import { useStartGame } from "./hooks/start-game"
import { regenerateGame } from "./hooks/regenerate-game"

const GAME_STATUS = {
  START: 'starting',
  PLAYING: 'is-playing',
  WON: 'won',
  LOST: 'lost'
}

function App() {
  const { matrix, setMatrix, bombsQuantity, setBombsQuantity , $GRID_SIZE } = useStartGame()
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.START)
  const [score, setScore] = useState(0)
  const [cellClicked, setCellClicked] = useState<string[]>([])

  const handleClick = (colIndex:string, celIndex:string) => {
    const cellToAdd = `${colIndex}-${celIndex}`
    
    setGameStatus(GAME_STATUS.PLAYING)
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
    const totalNoBombsCell = Math.pow($GRID_SIZE, 2) - bombsQuantity
    if((cellClicked.length + 1) === totalNoBombsCell) {
      setGameStatus(GAME_STATUS.WON)
    }
  }

  const reloadGame = () => {
    setScore(0)
    setMatrix(Array.from({length: $GRID_SIZE}, () => Array.from({length: $GRID_SIZE}, () => 0 as number | string)))
    setCellClicked([])
    regenerateGame(bombsQuantity, setMatrix, setCellClicked, setScore);
    setGameStatus(GAME_STATUS.START)
    //window.location.reload()
  }

  const handleBombsQuantity = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const newsBombQuantity = parseInt(e.target.value)
    setBombsQuantity(newsBombQuantity)
  }

  useEffect(() => {
    regenerateGame(bombsQuantity, setMatrix, setCellClicked, setScore);
    setGameStatus(GAME_STATUS.START)
  }, [bombsQuantity, setMatrix]);



  return (
    <main className="min-h-screen flex flex-col justify-center items-center mt-6">
      <h1 className="text-5xl text-white mb-4 uppercase font-bold">Buscaminas</h1>
      <span className="text-white text-xs mb-2">Seleccionar cantidad de bombas</span>
      <select disabled={gameStatus !== 'starting'} onChange={handleBombsQuantity} name="difficulty" id="difficulty" className="bg-gray-800 border-2 border-gray-800 text-white mb-4 select-none outline-none">
        <option value="2">2 bombas</option>
        <option value="4">4 bombas</option>
        <option value="8">8 bombas</option>
        <option value="12">12 bombas</option>
      </select>
      <span className="text-lg text-white my-4">Puntuación: <strong>{score}</strong></span>
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
                showAll={false} // show cells
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
