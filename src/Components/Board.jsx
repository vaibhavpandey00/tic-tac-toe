import React, { useEffect, useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Board = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [circleTurn, setCircleTurn] = useState(true); // Updated initial value to true
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const result = calculateWinner(board);
        if (result) {
            setWinner(result);
            setCircleTurn(null); // Disable further clicks if the game ends
        } else {
            if (!circleTurn) {
                const bestMove = findBestMove(board);
                if (bestMove !== -1) {
                    const newBoard = [...board];
                    newBoard[bestMove] = "O";
                    setBoard(newBoard);
                    setCircleTurn(true);
                }
            }
        }
    }, [board, circleTurn]);

    const calculateWinner = (board) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Check for a winner
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Return the winning symbol
            }
        }

        // Check for a tie
        if (!board.includes("")) {
            return "tie"; // Return "tie" if all cells are filled and no winner
        }
        // no winner or tie
        return null;
    };

    const handleClick = (index) => {
        if (winner || board[index] !== "") return;
        const newBoard = [...board];
        newBoard[index] = "X";
        setBoard(newBoard);
        setCircleTurn(false);
    };

    const handleReset = () => {
        setBoard(["", "", "", "", "", "", "", "", ""]);
        // Reset to player's turn
        setCircleTurn(true);
        setWinner(null);
    };

    const findBestMove = (currentBoard) => {
        let bestMove = -1;
        let bestScore = -Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === "") {
                const newBoard = [...currentBoard];
                newBoard[i] = "O";
                const score = minimax(newBoard, false);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    const minimax = (currentBoard, isMaximizing) => {
        const result = calculateWinner(currentBoard);
        if (result !== null) {
            return result === "O" ? 1 : result === "tie" ? 0 : -1;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (currentBoard[i] === "") {
                    const newBoard = [...currentBoard];
                    newBoard[i] = "O";
                    const score = minimax(newBoard, false);
                    bestScore = Math.max(bestScore, score);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (currentBoard[i] === "") {
                    const newBoard = [...currentBoard];
                    newBoard[i] = "X";
                    const score = minimax(newBoard, true);
                    bestScore = Math.min(bestScore, score);
                }
            }
            return bestScore;
        }
    };

    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-500">
            <div className="text-2xl font-semibold text-white mb-5">You are Player X</div>
            <div className="w-4/6 h-2/6 md:w-2/6 lg:w-2/6 xl:w-1/6 mb-5 grid grid-cols-3 grid-rows-3">
                {board.map((cell, index) => (
                    <div
                        key={index}
                        className="flex justify-center items-center text-[5rem] font-semibold text-white border border-white"
                        onClick={() => handleClick(index)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            {winner && (
                <div className="absolute h-full w-full flex flex-col justify-center items-center bg-lime-500 text-2xl font-semibold text-white mb-5">
                    {winner === "tie" ? <div>It's a Tie!</div> : <div>Winner: {winner}</div>}
                    <div className="flex justify-center items-center py-2 px-4 md:cursor-pointer rounded-2xl border" onClick={handleReset}>Reset</div>
                </div>
            )}

            {/* Add made by and developer contact info and social media links */}

            <div className="flex items-baseline gap-2 mt-5" >
                <p className="text-sm text-gray-300" >Made by:</p>
                <p className="text-md text-white" >Vaibhav Pandey❤️</p>
            </div>

            <div className="flex gap-5 text-2xl text-white" >
                <p className="text-md text-white mt-5"><a href="https://github.com/vaibhavpandey00" target="_blank" rel="noopener noreferrer"><FaGithub /></a></p>
                <p className="text-md text-white mt-5"><a href="http://www.linkedin.com/in/vaibhavpandey0" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a></p>
            </div>
        </div>
    );
};

export default Board;
