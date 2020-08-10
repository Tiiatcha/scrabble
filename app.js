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
    z:{count:1,points:10},
    0:{count:2,points:0}
};
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
let tiles = [];
const gridSize = 15;
let cells = {};
let history = {};
let turn = {player:0,
            originalTiles:[],
            words:{
                primary:{
                    letters:{},
                    word:''}
                }
            };
const grid = document.querySelector('.game-grid');
const buttonTest = document.querySelector('#testWord');
const tileDraggable = (e)=>{
    e.target.classList.add('dragging');
    if(e.target.parentNode.classList.contains('cell')) dropLetter(e.target.parentNode,e.target,"remove");
}
const tileDragEnd = (e)=>{
    e.target.classList.remove('dragging');
    const square = e.target.parentNode
    dropLetter(square,e.target,'addOwn')
};

const setDetails = (tile)=>{
    const droppedOn = tile.parentNode;
    const row = droppedOn.dataset.row;
    const col = droppedOn.dataset.col;
    const letter = tile.dataset.letter
    tile.dataset.row = row;
    tile.dataset.col = col;
    //dropLetter(droppedOn,tile,'addOwn')
}
const shuffleTiles = () => {
    let tempArray = [];
    while(letters.length != 0){
        let rIndex = Math.floor(Math.random()*letters.length);
        tempArray.push(tempArray[rIndex]);
        letters.splice(rIndex,1);
    }
    letters = tempArray;
}
const createTilesArr = () => {
    for(let letter in letters){
        for(i=0;i<letters[letter]['count'];i++){
            tiles.push({
                "letter":letter,
                "instance":i,
                "count":letters[letter]['count'],
                "points":letters[letter]['points'],
                "used":false
           });
        }
    }
    tiles.sort(()=> Math.random() -0.5);
    tiles.sort(()=> Math.random() -0.5);
    tiles.sort(()=> Math.random() -0.5);
}
const getNextLetterTile = (letter)=>{
    //const tile = tiles.find( tile => {return tile.letter == letter && tile.used == false});
    return new Promise(resolve =>{
        const tile = tiles.findIndex( tile => { 
            return tile.letter===letter && tile.used === false 
        } )
        tiles[tile].used = true
        resolve(tiles[tile]);
    })
}

const createTileElem = (letter,draggable = false) => {
    
        return getNextLetterTile(letter).then((res,rej)=>{
            const newTileDetail =  res;
            const tileId = newTileDetail.letter+newTileDetail.instance;
            const tile = document.createElement('div');
            const letterDiv = document.createElement('div');
            const scoreDiv = document.createElement('div');
            tile.setAttribute('draggable',draggable)
            tile.addEventListener('dragstart',tileDraggable)
            tile.addEventListener('dragend',tileDragEnd)
            tile.classList.add('letterContainer');
            tile.setAttribute('draggable',true);
            tile.dataset.letter = newTileDetail.letter;
            tile.setAttribute('id',tileId);
            letterDiv.classList.add('letter');
            letterDiv.innerHTML = newTileDetail.letter.toUpperCase();
            scoreDiv.classList.add('letterScore');
            scoreDiv.innerHTML = newTileDetail.points;
            tile.appendChild(letterDiv);
            tile.appendChild(scoreDiv);
            return tile;
        });
}
const isVertical = () => {
    return Object.keys(turm['originalLetters']).length > 1
}
const isValidWord = (word) => {
    return new Promise(resolve =>{
        const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/usageOf`
        fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": hostKey
            }
        })
        .then(response => {
            resolve(response.statusText == 'OK');
        })
        .catch(err => {
            resolve(err);
        });

    });
}
const completeWord = (isVerticle,wordNo = 0) => {
    let firstSquare,lastSquare,altNumber,newCell,newLetter;
    let tempLetters = turn[originalLetters];

    if(isVertical)
    {
        const noOfRows = Object.keys(tempLetters).length
    }

    
    turn['words']['primary']['letters'] = tempLetters;
}
const moreMidLetters = (isVerticle)=>
{
    let firstSquare,lastSquare,altNumber,newCell,newLetter;
    if(isVertical)
    {
        const noOfRows = Object.keys(turm['words']['primary']['letters']).length;
        firstSquare = parseInt(Object.keys(turn['words']['primary']['letters'])[0])
        lastSquare = parseInt(Object.keys(turn['words']['primary']['letters'])[noOfRows-1]);
        altNumber = Object.keys(turn['words']['primary']['letters'][firstSquare])[0];
        let i = firstSquare-1;
        // loop through current object properties and compare current cell with previous cell,
        // if j > i+1
        for(let cell in turn['words']['primary']['letters'])
        {
            if(parseInt(cell) > i+1){
                newCell = document.querySelector(`[data-row="${i+1}"][data-col="${altNumber}"]`)
                newLetter = newCell.firstChild;
                dropLetter(newCell,newLetter,'add');
            }
            i = parseInt(cell)
        }
    }
    else
    {
        const noOfCols = Object.keys(turm['words']['primary']['letters'][0]).length;
        firstSquare = parseInt(Object.keys(turn['words']['primary']['letters'])[0][0])
        lastSquare = parseInt(Object.keys(turn['words']['primary']['letters'])[0][noOfCols-1]);
        altNumber = Object.keys(turn['words']['primary']['letters'][firstSquare]);
        let i = firstSquare-1;
        // loop through current object properties and compare current cell with previous cell,
        // if j > i+1
        for(let cell in turn['words']['primary']['letters'])
        {
            if(parseInt(cell) > i+1){
                newCell = document.querySelector(`[data-col="${i+1}"][data-row="${altNumber}"]`)
                newLetter = newCell.firstChild;
                dropLetter(newCell,newLetter,'add');
            }
            i = parseInt(cell)
        }
    }
}
const moreEndLetters = (isVerticle) =>
{
    return new Promise(resolve =>{
        let firstSquare,lastSquare,altNumber;
        if(isVertical){
            firstSquare = Object.keys(turn)[0]
            lastSquare = Object.keys(turn)[Object.keys(turn).length-1];
            altNumber = Object.keys(turn[firstSquare])[0];
            if(firstSquare != 0){
                previousSquare = document.querySelector(`[data-row="${firstSquare-1}"][data-col="${altNumber}"]`)
                if(letter = previousSquare.firstChild){
                    dropLetter(previousSquare,letter,'add');
                    moreEndLetters(isVerticle)
                }
            }
            if(lastSquare != 14){
                nextSquare = document.querySelector(`[data-row="${parseInt(lastSquare)+1}"][data-col="${altNumber}"]`)
                if(letter = nextSquare.firstChild){
                    dropLetter(nextSquare,letter,'add');
                    moreEndLetters(isVerticle)
                }
            }
        }
        else
        {
            firstSquare = Object.keys(turn)[0][0]
            lastSquare = Object.keys(turn)[0][Object.keys(turn).length-1];
            altNumber = Object.keys(turn[firstSquare]);
            if(firstSquare != 0){
                previousSquare = document.querySelector(`[data-col="${firstSquare-1}"][data-row="${altNumber}"]`)
                if(letter = previousSquare.firstChild){
                    dropLetter(previousSquare,letter,'add');
                    moreEndLetters(isVerticle)
                }
            }
            if(lastSquare != 14){
                nextSquare = document.querySelector(`[data-col="${parseInt(lastSquare)+1}"][data-row="${altNumber}"]`)
                if(letter = nextSquare.firstChild){
                    dropLetter(nextSquare,letter,'add');
                    moreEndLetters(isVerticle)
                }
            }
        }
        resolve(true);
    });
}

const testWord = async ()=>{
    const vert = await isVertical();
    turm['words']['primary'][letters]=turn['originalLetters']

    await moreEndLetters(vert);
    await moreMidLetters(vert);

    let word = '';
    for(let row in turn["words"]["primary"]){
        for(let col in turn["words"]["primary"]["letters"][row]){
            word = word+turn["words"]["primary"]["letters"][row][col]["letter"]
        }
    }
    const found = await isValidWord(word);
    console.log(found);
    turn["words"] = {"primary":word};
}
buttonTest.addEventListener('click',testWord);



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
    turn = {player:0,originalTiles:{},words:{primary:{letters:{},word:''}}};
    tiles = [];
    await createSquares();
    await doubleWords();
    createTilesArr()
    const draggables = document.querySelectorAll('[draggable="true"]');
    const droppables = document.querySelectorAll('.droppable');
    const handContainer = document.querySelector('.sortable');

    handContainer.addEventListener('dragover',(e)=>{
        e.preventDefault();
        const afterElement = getDragAfterElement(handContainer,e.clientX);
        console.log(handContainer);
        console.log(e.target)
        const draggable = document.querySelector('.dragging');
        if(afterElement == null){
            handContainer.appendChild(draggable);
        } else {
            handContainer.insertBefore(draggable,afterElement)
        }
    });
    draggables.forEach(draggable=>{
        draggable.addEventListener('dragstart',tileDraggable)
        draggable.addEventListener('dragend',tileDragEnd)
    })

    droppables.forEach(droppable=>{
        droppable.addEventListener('dragover',(e)=>{
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            droppable.appendChild(draggable);
        })
        droppable.addEventListener('dragenter',e=>{
            const coords = `${e.target.dataset.row}/${e.target.dataset.col}`
            console.log(`Entered: ${coords}`)
        })
    })
    
    
    await testBoard();
    setConfirmed();
    testHand()
}
const setConfirmed = () => {
    const allTilesOnBoard = grid.querySelectorAll('.letterContainer');
    allTilesOnBoard.forEach(tileOnBoard=>{
        tileOnBoard.parentNode.dataset.used = true;
        tileOnBoard.removeEventListener('dragstart',tileDraggable)
        tileOnBoard.removeEventListener('dragend',tileDragEnd)
        tileOnBoard.setAttribute('draggable',false)
    });
    turn = {player:0,originalTiles:{},words:{primary:{letters:{},word:''}}};
}
const testBoard = async () =>{
    return new Promise(resolved=>{
        createTileElem("h").then((res,rej)=>{
            document.querySelector('#cell76').appendChild(res);
            dropLetter(document.querySelector('#cell76'),res,'addOwn')
        })
        createTileElem("a").then((res,rej)=>{
            document.querySelector('#cell77').appendChild(res);
            dropLetter(document.querySelector('#cell77'),res,'addOwn')
        })
        createTileElem("p").then((res,rej)=>{
            document.querySelector('#cell78').appendChild(res);
            dropLetter(document.querySelector('#cell78'),res,'addOwn')
        })
        createTileElem("p").then((res,rej)=>{
            document.querySelector('#cell79').appendChild(res);
            dropLetter(document.querySelector('#cell79'),res,'addOwn')
        })
        createTileElem("y").then((res,rej)=>{
            document.querySelector('#cell710').appendChild(res);
            dropLetter(document.querySelector('#cell710'),res,'addOwn')
        })
        
        createTileElem("r").then((res,rej)=>{
            document.querySelector('#cell89').appendChild(res);
            dropLetter(document.querySelector('#cell89'),res,'addOwn')
        })
        createTileElem("i").then((res,rej)=>{
            document.querySelector('#cell99').appendChild(res);
            dropLetter(document.querySelector('#cell99'),res,'addOwn')
        })
        createTileElem("z").then((res,rej)=>{
            document.querySelector('#cell109').appendChild(res);
            dropLetter(document.querySelector('#cell109'),res,'addOwn')
        })
        createTileElem("e").then((res,rej)=>{
            document.querySelector('#cell119').appendChild(res);
            dropLetter(document.querySelector('#cell119'),res,'addOwn')
        })
        
        createTileElem("g").then((res,rej)=>{
            document.querySelector('#cell118').appendChild(res);
            dropLetter(document.querySelector('#cell118'),res,'addOwn')
        })
        createTileElem("a").then((res,rej)=>{
            document.querySelector('#cell1110').appendChild(res);
            dropLetter(document.querySelector('#cell1110'),res,'addOwn')
        })
        createTileElem("r").then((res,rej)=>{
            document.querySelector('#cell1111').appendChild(res);
            dropLetter(document.querySelector('#cell1111'),res,'addOwn')
        })
        createTileElem("o").then((res,rej)=>{
            document.querySelector('#cell1011').appendChild(res);
            dropLetter(document.querySelector('#cell1011'),res,'addOwn')
        })
        
        resolved();
    })
}
const testHand = () => {
    createTileElem("o",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
    createTileElem("a",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
    createTileElem("t",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
    createTileElem("s",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
    //createTileElem("a",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
    createTileElem("b",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
    createTileElem("c",true).then((res,rej)=>{document.querySelector('.handContainer').appendChild(res)});
}

const createSquares = () => {
    for(i=0;i<(15);i++)
    {
        cells[i]={}
        for(j=0;j<15;j++)
        {
            cells[i][j] = {};
            htmlCell = document.createElement('div')
            htmlCell.classList.add('cell');
            htmlCell.classList.add('droppable');
            htmlCell.setAttribute('id',`cell${i}${j}`)
            htmlCell.dataset.row = i;
            htmlCell.dataset.col = j;
            htmlCell.dataset.used = false;
            htmlCell.dataset.multiplier = "false";
            htmlCell.addEventListener('click',(e)=>{
                const row = e.target.dataset.row;
                const col = e.target.dataset.col;
                if(typeof turn['originalTiles'][row]=='undefined') turn['originalTiles'][row]={}
                if(typeof turn['originalTiles'][row][col]=='undefined')
                {
                    turn['originalTiles'][row][col] = "a"
                }
                else{
                    delete turn['originalTiles'][row][col];
                    if(Object.keys(turn['originalTiles'][row]).length == 0) delete turn['originalTiles'][row];
                }
            })
            grid.appendChild(htmlCell);
        }

    }
    // console.log(cells);
}
const doubleWords = () =>{
    
    let left = 1;
    let right = 13;
    let leftCell = '';
    let rightCell = '';
    for(i = 1; i < 14; i ++)
    {
        if(i != 5 && i !=9)
        {
            cells[i][left].isDoubleWord=true;
            cells[i][right].isDoubleWord=true;
            leftCell = document.querySelector(`[data-row="${i}"][data-col="${left}"]`);
            rightCell = document.querySelector(`[data-row="${i}"][data-col="${right}"]`);
            leftCell.classList.add('trippleWord');
            rightCell.classList.add('trippleWord');
            leftCell.dataset.multiplier = 'doubleWord';
            rightCell.dataset.multiplier = 'doubleWord';
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
const dropLetter = (cell,tile,action)=>{
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const letter = tile.dataset.letter
    if(row == 'undefined' || col == 'undefined') return;
    if(action == 'remove'){
        delete turn['originalTiles'][row][col]
        if(Object.keys(turn['originalTiles'][row]).length == 0) delete turn[row];
    } else {
        turn.originalTiles.push({
            row,
            col,
            letter
        })

        if(typeof turn['originalTiles'][row]=='undefined') turn[row]={}
        if(typeof turn['originalTiles'][row][col]=='undefined')
        {
            turn['originalTiles'][row][col] = {};
        }
        turn['originalTiles'][row][col]["letter"] = letter;
        turn['originalTiles'][row][col]["new"] = false;
        setDetails(tile);
    }
    if(action == 'addOwn'){
        turn['originalTiles'][row][col]["multiplier"] = cell.dataset.multiplier;
        turn['originalTiles'][row][col]["new"] = true;
    }
    console.log(turn)
}