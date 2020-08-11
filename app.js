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
let tempLetters = {}
const wordsObj = {0:{word:'',letters:{}}};//before confirming word/s rest words to this.
let emptyTurnObj = {
                player:0,
                playedTiles:{},
                words:wordsObj
                };// on new turn this is the object template to reset back to.
let turn = emptyTurnObj; // this is the working turn object
const grid = document.querySelector('.game-grid');
const buttonTest = document.querySelector('#testWord');

const getDragAfterElement = (droppable,x)=>{
    // this enables you to sort the letters while dragging them in the hand container
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
const tileDraggable = (e)=>{
    e.target.classList.add('dragging');
    if(e.target.parentNode.classList.contains('cell')) tileAction(e.target.parentNode,e.target,"remove");
}
const tileDragEnd = (e)=>{
    e.target.classList.remove('dragging');
    const square = e.target.parentNode
    tileAction(square,e.target,'addOwn')
};

const createTilesArr = () => {
    // creates an array with all the tiles... this is the equivilent of putting all the tiles into a bag
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
    // this shuffles the tiles 3 times 
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
    // this determines if your word is set out verticly or horizontally
    return Object.keys(turn.playedTiles).length > 1
}
const isValidWord = (word) => {
    // using wordsapi check if word is a valid word
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
const buildWord = (letters) => {
    let word = '';
    let multiplier = 1
    for(let row in letters){
        for(let col in letters[row]){
            word = word+letters[row][col].letter
            if(letters[row][col].multiplier == 'doubleWord') multiplier = multiplier * 2
            if(letters[row][col].multiplier == 'trippleWord') multiplier = multiplier * 2
        }
    }
    return {word,multiplier};
}
const wordScore = (word) => {
    const letters = word.letters
    const wordMultiplier = word.multiplier;
    let letterScore = 0;
    let total = 0;
    for(let letter in letters){
        // TODO: finish Word Scoring mechanism
        // NOTE: apply row and column properties to get score and multiplier for the letter
        letterScore = letters[letter].points;
        if(letters[letter].multiplier == 'doubleLetter') letterScore = letterScore * 2;
        if(letters[letter].multiplier == 'trippleLetter') letterScore = letterScore * 3;
        console.log(letterScore)
    }
}
const confirmTurn = (submitWord=false) => {
    turn.words = wordsObj;
    wordNo = 0;
    turn.words[0].letters = turn.playedTiles;
    completeWord(isVertical(turn.words.playedTiles));
    word = buildWord(turn.words[0].letters);
    turn.words[0].word = word.word;
    turn.words[0].wordMultiplier = word.multiplier
    //wordScore(turn.words[0]);
    // TODO: check for more words
    if(submitWord){
        // TODO: Add move to history and reset players turnObject
    }
}

buttonTest.addEventListener('click',confirmTurn);

const completeWord = (isVertical,wordNo = 0) => {
    // In this function we will check for additional letters that make up our word thaat were already on the board
    let square;
    let tile;
    let firstSquare;// this is the first square in our played Tiles object
    let altNumber;// words run either horizontally (in rows) when this will represent the row, or vertically(in columns) when this will represent the column
    let lastSquare;// this is the last square in our played tiles object
    let newCell;//??
    let newLetter;// if this is a nely played letter then this will be true otherwise it will be false
    if(wordNo == 0) tempLetters = turn.words[wordNo].letters;
    if(isVertical)
    {
        const noOfRows = Object.keys(tempLetters).length; // no of rows used by
        firstSquare = Object.keys(tempLetters)[0];// row one
        altNumber = Object.keys(tempLetters[firstSquare])[0];
        lastSquare = Object.keys(tempLetters)[noOfRows-1];// last row
        if(firstSquare != 0) {
            currentRow = firstSquare
            cell = cells[currentRow-1][altNumber]
            if(typeof tempLetters[currentRow-1] == 'undefined' && cell.letter){
                tempLetters[cell.row] = {};
                tempLetters[cell.row][altNumber] = cell
            }
            // TEST: Test Recursion!
            completeWord(isVertical,wordNo)
        }
        // TODO: Add logic for checking for next letters

    }
    else
    {
        // TEST: Test Horizontal Word
        const noOfCols = Object.keys(tempLetters)[0].length; // no of rows used by
        firstSquare = Object.keys(tempLetters)[0][0];// row one
        altNumber = Object.keys(tempLetters[firstSquare])[0];
        lastSquare = Object.keys(tempLetters)[0][noOfCols-1];// last row
        if(firstSquare != 0) {
            currentCol = firstSquare
            cell = cells[altNumber][currentCol-1]
            if(cell.letter){
                tempLetters[altNumber] = {};
                tempLetters[altNumber][cell.col] = cell
            }
            completeWord(isVertical,wordNo)
        }
        // TODO: Add logic for checking for next letters

    }
    turn.words[wordNo].letters = tempLetters;
    tempLetters = {};
}
const tileAction = (cell,tile,action)=>{
    /*
        When dropping a tile on to a square we add this letter to the turn object under playedTiles property
    */
   const row = cell.dataset.row;
   const col = cell.dataset.col;
    if(row == 'undefined' || col == 'undefined') return;// exit function

    const multiplier = action=='addOwn'?cell.dataset.multiplier:false
    const playedTile = action=='addOwn'?true:false
    const letter = tile.dataset.letter;
    
    if(action == 'remove'){
        delete turn.playedTiles[row][col]
        if(Object.keys(turn.playedTiles[row]).length == 0) delete turn.playedTiles[row];
    } 
    else 
    {
        if(typeof turn.playedTiles[row] == 'undefined') turn.playedTiles[row] = {}
        if(typeof turn.playedTiles[row][col] == 'undefined') turn.playedTiles[row][col] = {letter,row,col,multiplier,playedTile}
        setTileAttributes(tile);
    }
    console.log(turn)
}








const setTileAttributes = (tile)=>{
    const droppedOn = tile.parentNode;
    const row = droppedOn.dataset.row;
    const col = droppedOn.dataset.col;
    const letter = tile.dataset.letter
    tile.dataset.row = row;
    tile.dataset.col = col;
}

const setConfirmed = () => {
    let row,col;
    const allTilesOnBoard = grid.querySelectorAll('.letterContainer');
    allTilesOnBoard.forEach(tileOnBoard=>{
        tileOnBoard.parentNode.dataset.used = true;
        tileOnBoard.removeEventListener('dragstart',tileDraggable)
        tileOnBoard.removeEventListener('dragend',tileDragEnd)
        tileOnBoard.setAttribute('draggable',false)
        row = tileOnBoard.dataset.row;
        col = tileOnBoard.dataset.col;
        cells[row][col].letter = tileOnBoard.dataset.letter
    });
    turn = {player:0,playedTiles:{},words:{0:{letters:{},word:''}}};
    
}
const testBoard = async () =>{
    return new Promise(resolved=>{
        createTileElem("h").then((res,rej)=>{
            document.querySelector('#square76').appendChild(res);
            tileAction(document.querySelector('#square76'),res,'addOwn')
        })
        createTileElem("a").then((res,rej)=>{
            document.querySelector('#square77').appendChild(res);
            tileAction(document.querySelector('#square77'),res,'addOwn')
        })
        createTileElem("p").then((res,rej)=>{
            document.querySelector('#square78').appendChild(res);
            tileAction(document.querySelector('#square78'),res,'addOwn')
        })
        createTileElem("p").then((res,rej)=>{
            document.querySelector('#square79').appendChild(res);
            tileAction(document.querySelector('#square79'),res,'addOwn')
        })
        createTileElem("y").then((res,rej)=>{
            document.querySelector('#square710').appendChild(res);
            tileAction(document.querySelector('#square710'),res,'addOwn')
        })
        
        createTileElem("r").then((res,rej)=>{
            document.querySelector('#square89').appendChild(res);
            tileAction(document.querySelector('#square89'),res,'addOwn')
        })
        createTileElem("i").then((res,rej)=>{
            document.querySelector('#square99').appendChild(res);
            tileAction(document.querySelector('#square99'),res,'addOwn')
        })
        createTileElem("z").then((res,rej)=>{
            document.querySelector('#square109').appendChild(res);
            tileAction(document.querySelector('#square109'),res,'addOwn')
        })
        createTileElem("e").then((res,rej)=>{
            document.querySelector('#square119').appendChild(res);
            tileAction(document.querySelector('#square119'),res,'addOwn')
        })
        
        createTileElem("g").then((res,rej)=>{
            document.querySelector('#square118').appendChild(res);
            tileAction(document.querySelector('#square118'),res,'addOwn')
        })
        createTileElem("a").then((res,rej)=>{
            document.querySelector('#square1110').appendChild(res);
            tileAction(document.querySelector('#square1110'),res,'addOwn')
        })
        createTileElem("r").then((res,rej)=>{
            document.querySelector('#square1111').appendChild(res);
            tileAction(document.querySelector('#square1111'),res,'addOwn')
        })
        createTileElem("o").then((res,rej)=>{
            document.querySelector('#square1011').appendChild(res);
            tileAction(document.querySelector('#square1011'),res,'addOwn')
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

const createBoard = () => {
    for(row=0;row<(15);row++)
    {
        cells[row]={}
        for(col=0;col<15;col++)
        {
            cells[row][col] = {row,col,multiplier:false,letter:false,playedTile:false};
            createSquare(row,col);
        }

    }
    // console.log(cells);
}
const createSquare = (row,col) => {
    htmlCell = document.createElement('div')
    htmlCell.classList.add('cell');
    htmlCell.classList.add('droppable');
    htmlCell.setAttribute('id',`square${row}${col}`)
    htmlCell.dataset.row = row;
    htmlCell.dataset.col = col;
    htmlCell.dataset.used = false;
    htmlCell.dataset.multiplier = "false";
    htmlCell.dataset.letter="false"
    grid.appendChild(htmlCell);
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
            leftCell = document.querySelector(`[data-row="${i}"][data-col="${left}"]`);
            rightCell = document.querySelector(`[data-row="${i}"][data-col="${right}"]`);
            leftCell.classList.add('doubleWord');
            rightCell.classList.add('doubleWord');
            leftCell.dataset.multiplier = 'doubleWord';
            rightCell.dataset.multiplier = 'doubleWord';
            cells[i][left].multiplier = 'doubleWord'
            cells[i][right].multiplier = 'doubleWord'
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




const setUpGame = async () => {
    grid.innerHTML = ''
    turn = {player:0,playedTiles:{},words:{primary:{letters:{},word:''}}};
    tiles = [];
    await createBoard();
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

setUpGame();