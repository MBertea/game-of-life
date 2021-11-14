import { useCallback, useRef, useState } from "react";
import styled from 'styled-components';
import Cell from "./Cell";
import useInterval from "./_useInterval";
import { Button } from "@mui/material";

const rowNo = 20;
const colNo = 20;

export const PageHolder = styled.div`
    width: 100vw;
    height: 100vh;
    
    background-color: black;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 75px;
`;

const GridHolder = styled.div`
    height: 600px;
    width: 800px;

    background-color: black;

    display: grid;
    grid-template-columns: repeat(${rowNo}, 35px);
    grid-template-rows: repeat(${colNo}, 25px);
    gap: 5px;
`;

const GenHolder = styled.div`
    font-size: 20px;
    color: white;
`;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
];

function calcNoOfNeighbours (grid, i, j) {
    
    let neighbors = 0;
    
    operations.forEach(([x, y]) => {
        const newI = i + x;
        const newJ = j + y;
        if (newI >= 0 && newI < rowNo && newJ >= 0 && newJ < colNo) {
            neighbors += grid[newI][newJ];
        }
    });

    return neighbors;
}

function randomizeGrid (oldGrid) {

    oldGrid.forEach((row, indexr, arr) => {
        row.forEach((cell, indexc) => {
            arr[indexr][indexc] = Math.random() > 0.75 ? 1 : 0;
        });
    });

    return oldGrid;
}

export default function Grid () {

    const [grid, setGrid] = useState(randomizeGrid(Array(rowNo).fill().map(() => Array(colNo).fill(0))));
    const [running, setRunning] = useState(false);
    const [genCounter, setGenCounter] = useState(1);

    const gridRef = useRef(grid);
    gridRef.current = grid;
    const runningRef = useRef(running);
    runningRef.current = running;


    const getNewGrid = (oldGrid) => {
        let noOfNeigh;
    
        let newGrid = oldGrid.map((row, indexr, arr) => 
            row.map((cell, indexc) => {
                noOfNeigh = calcNoOfNeighbours(arr, indexr, indexc);
    
                if (noOfNeigh < 2 || noOfNeigh > 3) {
                    cell = 0;
                } else {
                    if (cell === 0 && noOfNeigh === 3) {
                        cell = 1;
                    }
                }
                return cell;
            })
        );
        return newGrid;
    }

    const generateGrid = useCallback(() => {
        let newGrid = getNewGrid(gridRef.current);
        setGrid(newGrid);
    }, []);

    const intervalFunction = () => {
        setGenCounter(genCounter+1); 
        generateGrid();
    }

    useInterval(grid, intervalFunction, running ? 1000 : null);

    return(
        <PageHolder>
            <GenHolder>Generation: <b>{genCounter}</b></GenHolder>
            <GridHolder>
                {
                    gridRef.current.map((rows, i) =>
                        rows.map((col, j) => 
                            <Cell key={`${i}-${j}`} valueOfCell={gridRef.current[i][j]} />
                        ))
                }
            </GridHolder>
            <Button variant="outlined" onClick={() => {setRunning(!running); if (!running) {runningRef.current = true;}}}>{!running ? "Start" : "Stop"}</Button>
        </PageHolder>
    );
}