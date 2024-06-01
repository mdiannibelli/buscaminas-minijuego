interface Props {
    square: number | string;
    cellClicked: string[]
    keyToCheck: string;
    handleClick: (colIndex:string, celIndex:string) => void;
    gameStatus: string
}

export const Square = ({square, cellClicked, keyToCheck, gameStatus, handleClick}:Props) => {
    const colIndex  = keyToCheck.split("-")[0]
    const celIndex = keyToCheck.split('-')[1]
  return (
    <div className={`border-2 p-2 bg-gray-800 border-white w-20 h-20 flex justify-center items-center text-2xl cursor-pointer text-white ${cellClicked.includes(keyToCheck) && square === 'B' && 'bg-red-500'} ${cellClicked.includes(keyToCheck) && square !== 'B'  && 'bg-gray-400'}`}>
        {/* {square === 'B' ? '💣' : '💎'} */}
        {
            cellClicked.includes(keyToCheck) ? <span>{square === 'B' ? '💣' : square}</span> : <button disabled={gameStatus === 'won' || gameStatus === 'lost'} onClick={() => handleClick(colIndex, celIndex)} className={`${gameStatus === 'won' || gameStatus === 'lost' && 'bg-black'} cursor-pointer h-full w-full`}></button>
        }
    </div>
  )
}
