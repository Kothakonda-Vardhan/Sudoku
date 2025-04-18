"use client";

import { useEffect, useState } from "react";

type Grid = number[][];

export default function Home() {
  const [question, setQuestion] = useState<Grid>(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [solution, setSolution] = useState<Grid>(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [userGrid, setUserGrid] = useState<Grid>(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const parseStringToGrid = (str: string): number[][] => {
    const nums = str.split("").map((ch) => parseInt(ch, 10));
    const grid: number[][] = [];
    for (let i = 0; i < 9; i++) {
      grid.push(nums.slice(i * 9, (i + 1) * 9));
    }
    return grid;
  };
  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const res = await fetch("/api/grid");
        if (!res.ok) throw new Error("Failed to fetch grid");
        const data = await res.json();

    const questionGrid = parseStringToGrid(data.question);
    const solutionGrid = parseStringToGrid(data.solution);
        
        setQuestion(questionGrid);
        setSolution(solutionGrid);
        setUserGrid(questionGrid); // start from the given puzzle
      } catch (error) {
        console.error("Error fetching Sudoku grid:", error);
      }
    };

    fetchGrid();
  }, []);

  const handleChange = (value: string, row: number, col: number) => {
    if (question[row][col] !== 0) return; // Don't edit clue cells

    const newGrid = userGrid.map((r) => [...r]);

    // Clear input
    if (value === "") {
      newGrid[row][col] = 0;
      setUserGrid(newGrid);
      return;
    }

    const num = parseInt(value);
    if (!Number.isInteger(num) || num < 1 || num > 9) return;

    newGrid[row][col] = num;
    setUserGrid(newGrid);
  };

  const resetWrongAnswers = () => {
    const newGrid = userGrid.map((row, r) =>
      row.map((val, c) =>
        question[r][c] === 0 && val !== 0 && val !== solution[r][c] ? 0 : val
      )
    );
    setUserGrid(newGrid);
  };

  const getCellStyle = (row: number, col: number) => {
    const borderStyles = `
      ${col % 3 === 2 ? "border-r-2 border-black" : ""}
      ${row % 3 === 2 ? "border-b-2 border-black" : ""}
    `;

    if (question[row][col] !== 0) {
      return `bg-gray-200 text-black font-bold ${borderStyles}`;
    }

    const isCorrect = userGrid[row][col] === solution[row][col];
    const hasInput = userGrid[row][col] !== 0;
    const color = hasInput ? (isCorrect ? "text-green-700" : "text-red-600") : "text-black";

    return `bg-white ${color} ${borderStyles}`;
  };

  return (
    <main className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Sudoku Grid</h1>

      <div className="grid grid-cols-9 gap-[2px] w-max border border-black bg-black">
        {userGrid.map((row, rowIndex) => row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-20 h-20 border border-gray-900 flex items-center justify-center text-2xl
                ${getCellStyle(rowIndex, colIndex)}
                ${colIndex % 3 === 0 ? 'border-l-2' : ''}
                ${rowIndex % 3 === 0 ? 'border-t-2' : ''}
                ${colIndex === 8 ? 'border-r-2' : ''}
                ${rowIndex === 8 ? 'border-b-2' : ''}
              `}
            >
              {question[rowIndex][colIndex] !== 0 ? (
                question[rowIndex][colIndex]
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-full h-full text-center outline-none bg-transparent"
                  value={userGrid[rowIndex][colIndex] || ""}
                  onChange={(e) => handleChange(e.target.value, rowIndex, colIndex)}
                />
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={resetWrongAnswers}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Reset Wrong Answers
      </button>
    </main>
  );
}