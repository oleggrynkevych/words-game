import { range } from "../util/array";
import { getRandomWord, isProper } from "../util/dictionary";
import { Keyboard } from "./Keyboard";
import { useEffect, useState, useMemo } from "react";

type CellState = {
    letter: string,
    variant?: "correct" | "semi-correct" | "incorrect"
}

type Board = CellState[][];


const WORD_LENGTH = 5;
const ROWS = 6;

const getEmptyCell = () => ({
    letter: ''
})

const getEmptyBoard = () => range(ROWS)
    .map(() => range(WORD_LENGTH)
    .map(getEmptyCell));


const deepCopyBoard = (board) =>  JSON.parse(JSON.stringify(board))

const getPrevCell = (board: Board): CellState | undefined => {
    const flatArray = board.flat();
    const nextEmptyIndex = flatArray.findIndex((el) => el.letter === '');
    return nextEmptyIndex > 0 ? flatArray[nextEmptyIndex - 1] : undefined;
};

const getCurrentRow = (board) => {
    const prevCell = getPrevCell(board);
    return board.find((row) => (prevCell ? row.includes(prevCell) : undefined));
}


const Field = () => {
    const [board, setBoard] = useState<Board>(getEmptyBoard());

    const [correctWord, setCorrectWord] = useState(getRandomWord());

    const [win, setWin] = useState(false);

    const [blockInput, setBlockInput] = useState(true);

    const currentWord = useMemo(() => {
        const prevCell = getPrevCell(board);
        return board
          .find((row) => (prevCell ? row.includes(prevCell) : undefined))
          ?.map((cell) => cell.letter)
          .join("");
      }, [board]);

    const letterClasses = useMemo(() => {
        return board.flat().reduce((prevValue, currValue) => ({
            ...prevValue,
            [currValue.letter]: currValue.variant
        }), {});
    }, [board]);

    const handlePressed = (letter) => {
        if (blockInput) {
          return;
        }         
        setBoard((prev) => {
          const nextState = deepCopyBoard(prev);
    
          const nextEmptyCell = nextState.flat().find((el) => el.letter === "");
          if (nextEmptyCell) {
            nextEmptyCell.letter = letter;
          }
          return nextState;
        });
      };
    
      
    const handleBackspace = () => {
        if (currentWord && currentWord.length === WORD_LENGTH && !blockInput) {
            return;
        }
        
        setBoard((prev) => {
            const nextBoard = deepCopyBoard(prev);
            const prevCell = getPrevCell(nextBoard);
            if (prevCell) {
                prevCell.letter = "";
            }
                return nextBoard;
        });
    };

      useEffect(() => {
        const onKeydown = (e) => {
          if (e.key === "Backspace") {
            handleBackspace();
          }
          if (e.keyCode >= 65 && e.keyCode <= 90) {
            handlePressed(e.key);
          }
        };
        document.addEventListener("keydown", onKeydown);
        return () => {
          document.removeEventListener("keydown", onKeydown);
        };
      }, [blockInput, currentWord]);

    useEffect(() => {
        if (currentWord && currentWord.length === WORD_LENGTH) {
          if (currentWord === correctWord) {
            setWin(true);
          } else if (isProper(currentWord)) {
            setBoard((prev) => {
              const nextBoard = deepCopyBoard(prev);
              getCurrentRow(nextBoard).forEach((cell: CellState, index) => {
                if (cell.letter === correctWord[index]) {
                  cell.variant = "correct";
                } else if (correctWord.includes(cell.letter)) {
                  cell.variant = "semi-correct";
                } else {
                  cell.variant = "incorrect";
                }
              });
              return nextBoard;
            });
          } else {
            setBlockInput(true);
          }
        } else {
          setBlockInput(false);
        }
      }, [currentWord]);

    useEffect(() => {
        setCorrectWord(getRandomWord());
        setBoard(getEmptyBoard());
        setWin(false);
      }, [win]);

    return (
        <div>
            <div className='board'>
                {
                    board.map((row, rowIndex) => (
                        <div key={rowIndex} className='board-row'>
                            {
                                row.map((cell, index) => (
                                    <div className={`cell ${cell.variant}`} key={index}>
                                        {cell.letter}
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <Keyboard 
                onPressed={handlePressed}
                onBackspace={handleBackspace}
                letterClasses={letterClasses}
            />
        </div>
    )
}

export default Field;
