type MatrixState = Array<Array<number | string>>;
type CellClickedState = string[];

export const regenerateGame = (
  bombsQuantity: number,
  setMatrix: React.Dispatch<React.SetStateAction<MatrixState>>,
  setCellClicked: React.Dispatch<React.SetStateAction<CellClickedState>>,
  setScore: React.Dispatch<React.SetStateAction<number>>
) => {
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
    const initialMatrix = Array.from({ length: $GRID_SIZE }, () => Array.from({ length: $GRID_SIZE }, () => 0 as number | string));

    // Place bombs randomly
    let bombsPlaced = 0;
    while (bombsPlaced < bombsQuantity) {
      const colRandom = Math.floor(Math.random() * $GRID_SIZE);
      const cellRandom = Math.floor(Math.random() * $GRID_SIZE);
      
      if (initialMatrix[colRandom][cellRandom] !== 'B') {
        initialMatrix[colRandom][cellRandom] = 'B';
        bombsPlaced++;
      }
    }

    // Calculate numbers around bombs
    for (let colIndex = 0; colIndex < $GRID_SIZE; colIndex++) {
      for (let cellIndex = 0; cellIndex < $GRID_SIZE; cellIndex++) {
        if (initialMatrix[colIndex][cellIndex] === 'B') continue;

        let bombCount = 0;
        for (const match of MATCHES) {
          const newCol = colIndex + match[0];
          const newCell = cellIndex + match[1];
          if (newCol >= 0 && newCol < $GRID_SIZE && newCell >= 0 && newCell < $GRID_SIZE) {
            if (initialMatrix[newCol][newCell] === 'B') {
              bombCount++;
            }
          }
        }

        initialMatrix[colIndex][cellIndex] = bombCount;
      }
    }

    setMatrix(initialMatrix);
    setScore(0);
    setCellClicked([]);
  };