const letters = {
    a:{count:9,points:1},
    b:{count:2,points:3},
    c:{count:2,points:3},
    d:{count:4,points:2},
    e:{count:12,points:1},
    f:{count:2,points:4},
    g:{count:3,points:2},
    h:{count:2,points:4},
    i:{count:9,points:1},
    j:{count:1,points:8},
    k:{count:1,points:5},
    l:{count:4,points:1},
    m:{count:2,points:3},
    n:{count:6,points:1},
    o:{count:8,points:1},
    p:{count:2,points:3},
    q:{count:1,points:10},
    r:{count:6,points:1},
    s:{count:4,points:1},
    t:{count:6,points:1},
    u:{count:4,points:1},
    v:{count:2,points:4},
    w:{count:2,points:4},
    x:{count:1,points:8},
    y:{count:2,points:4},
    z:{count:1,points:10}
}
const gridSize = 15;
let cells = {};
let turn = {};
const grid = document.querySelector('.game-grid');
const multipliers = {trippleWords:[
        [0,0],
        [0,8],
        [0,14],
        [8,0],
        [8,14],
        [14,0],
        [14,8],
        [14,14]
    ],
    doubleWords:[
        [1,1],[1,13],
        [2,2],[2,12],
    ],
    trippleLetters:[],
    doubleLetters:[]
};
const getDragAfterElement = (droppable,x)=>{
    const draggableElements = [...droppable.querySelectorAll('[draggable="true"]:not(.dragging')];
    return draggableElements.reduce((closest,child)=>{
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width/2;
        if(offset < 0 && offset > closest.offset)
        {
            return {offset:offset,elemet:child};
        } else {
            return closest;
        }
    },{offset:Number.NEGATIVE_INFINITY}).elemet
}
const setUpGame = async () => {
    grid.innerHTML = ''
    turn = {};
    await createCells();
    await doubleWords();



    const dragqables = document.querySelectorAll('[draggable="true"]');
    const droppables = document.querySelectorAll('.droppable');
    const sortables = document.querySelectorAll('.sortable');

    dragqables.forEach(draggable=>{
        draggable.addEventListener('dragstart',(e)=>{
            const letter = draggable.dataset.letter;
            console.log(letter)
            localStorage.setItem("letter",letter);
            console.log(e.dataset);
            draggable.classList.add('dragging');
            
        })
        draggable.addEventListener('dragend',(e)=>{
            draggable.classList.remove('dragging');
            
            
        })
    })

    droppables.forEach(droppable=>{
        droppable.addEventListener('dragover',(e)=>{
            e.preventDefault();
            dropLetter(e);
            const draggable = document.querySelector('.dragging');
            droppable.appendChild(draggable);
        })
    })
    
    
    sortables.forEach(sortable=>{
        sortable.addEventListener('dragover',(e)=>{
            e.preventDefault();
            const afterElement = getDragAfterElement(sortable,e.clientX);
            const draggable = document.querySelector('.dragging');
            if(afterElement == null){
                sortable.appendChild(draggable);
            } else {
                sortable.insertBefore(draggable,afterElement)
            }
        })
    })
}
const createCells = () => {
    for(i=0;i<(15);i++)
    {
        cells[i]={}
        for(j=0;j<15;j++)
        {
            cells[i][j] = {};
            htmlCell = document.createElement('div')
            htmlCell.classList.add('cell');
            htmlCell.classList.add('droppable');
            htmlCell.dataset.row = i;
            htmlCell.dataset.col = j;
            htmlCell.dataset.used = false;
            htmlCell.addEventListener('click',(e)=>{
                const row = e.target.dataset.row;
                const col = e.target.dataset.col;
                if(typeof turn[row]=='undefined') turn[row]={}
                if(typeof turn[row][col]=='undefined')
                {
                    turn[row][col] = "a"
                }
                else{
                    delete turn[row][col];
                    if(Object.keys(turn[row]).length == 0) delete turn[row];
                }
            })
            grid.appendChild(htmlCell);
        }

    }
    console.log(cells);
}
const doubleWords = () =>{
    
    let left = 1;
    let right = 13
    for(i = 1; i < 14; i ++)
    {
        if(i != 5 && i !=9)
        {
            cells[i][left].isDoubleWord=true;
            cells[i][right].isDoubleWord=true;
            document.querySelector(`[data-row="${i}"][data-col="${left}"]`).classList.add('trippleWord');
            document.querySelector(`[data-row="${i}"][data-col="${right}"]`).classList.add('trippleWord');
        }
        left ++;
        right --;
    }
}
const addMultipliers = () =>{
    // multipliers.trippleWords.forEach((cell)=>{
    //     cells[cell[0]][cell[1]].isTrippleWord=true
    //     document.querySelector(`[data-row="${cell[0]}"][data-col="${cell[1]}"]`).classList.add('trippleWord')
    // })
    multipliers.doubleWords.forEach((cell)=>{
        cells[cell[0]][cell[1]].isDoubleWord=true
    });
    multipliers.trippleLetters.forEach((cell)=>{
        cells[cell[0]][cell[1]].isTrippleLetter=true
    });
    multipliers.doubleLetters.forEach((cell)=>{
        cells[cell[0]][cell[1]].isDoubleLetter=true
    })
}
setUpGame();
// ability a=1,
const dropLetter = (e)=>{
    console.log(e.dataTransfer)
    const row = e.target.parentNode.dataset.row;
    const col = e.target.parentNode.dataset.col;
    if(typeof turn[row]=='undefined') turn[row]={}
    if(typeof turn[row][col]=='undefined')
    {
        turn[row][col] = localStorage.getItem('letter');
    }
    else{
        delete turn[row][col];
        if(Object.keys(turn[row]).length == 0) delete turn[row];
    }
}



    const word = {
    word:"ability",
    trippleWord:1,
    doubleWord:0,
    letters:{
            0:{letter:"a",points:1,trippleWord:true},
            1:{letter:"b",points:3},
            2:{letter:"i",points:3},
            3:{letter:"l",points:3,doubleLetter:true},
            4:{letter:"i",points:3},
            5:{letter:"t",points:3},
            6:{letter:"y",points:3},
            }
    }

const getScore = (array) =>
{
    multiplier = 1; // can be 2 or 3 also
     array.reduce((letter,score)=>{
        const letterValue = letter.value;
        if(letter.trippleLetter)

        return
    },0)
}