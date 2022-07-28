/*----- constants -----*/
const cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];
const cardValues = ['r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'J', 'Q', 'K', 'A'];
const cards = buildCardsObj(); // build the cards obj which returns both the cardsObj and deckArr initial state
const cardsObj = cards[0]; // initialize cardsObj - list of all card atributes
const fullDeckArr = cards[1]; // initialize fullDeckArr - list of all card names in a deck

/*----- app's state (variables) -----*/
let deckArr = [...fullDeckArr];
let handObj = [];
let handArr = [];
let standArr = [];
let newGame = true;
let currentHand = [];
let drawArr = [];
let newHand = false;
let chipTotal = 0;
let betAmount = 0;
let venmo = false;

/*----- cached element references -----*/
const cardEls = {
    0: document.getElementById('card1'), 
    1: document.getElementById('card2'),
    2: document.getElementById('card3'),
    3: document.getElementById('card4'),
    4: document.getElementById('card5')
}

const standButtonEls = {
    0: document.getElementById('stand1'), 
    1: document.getElementById('stand2'),
    2: document.getElementById('stand3'),
    3: document.getElementById('stand4'),
    4: document.getElementById('stand5')
}
const betButtonEls = document.querySelectorAll('.bet-btns');

const chipTotalEl = document.getElementById('chip-total');
const chipPileEl = document.getElementById('chip-pile');
const currentBetEl = document.getElementById('current-bet');
const currentHandValueEl = document.getElementById('hand-value');
const dealButtonEl = document.getElementById('deal-button');
const depositAmountEl = document.getElementById('deposit-amount-input'); 
const venmoInputEl = document.getElementById('venmo-input');
const venmoAlertEl = document.getElementById('venmo-alert');
const playMusicButtonEl = document.getElementById('play-music-btn');
const addFundsSaveButtonEl = document.getElementById('add-funds-save');
const addFundsConfirmEl = document.getElementById('add-funds-alert');
const addFundsButtonEl = document.getElementById('add-funds-button');

/*----- sprite constants -----*/
const chipCanvasEl = document.getElementById('chip-canvas');
const ctx = chipCanvasEl.getContext('2d');
const spriteWidth = 128;
const spriteHeight = 72;
const spriteCols = 5;
const spriteRows = 2;
const chipImages = new Image();
chipImages.crossOrigin='anonymous';
chipImages.src = 
    'https://raw.githubusercontent.com/jmartymar/SEI-P1-Video-Poker/gh-pages/images/chips-spritesheet-128x72.png';
const spriteMapObj = {
    7: {
        increment: 1000000,
        chipSpriteX: 0,
        chipSpriteY: 1
    },
    6: {
        increment: 100000,
        chipSpriteX: 1,
        chipSpriteY: 1
    },
    5: {
        increment: 10000,
        chipSpriteX: 2,
        chipSpriteY: 1
    },
    4: {
        increment: 1000,
        chipSpriteX: 4,
        chipSpriteY: 0
    },
    3: {
        increment: 100,
        chipSpriteX: 2,
        chipSpriteY: 0
    },
    2: {
        increment: 10,
        chipSpriteX: 1,
        chipSpriteY: 0
    },
    1: {
        increment: 1,
        chipSpriteX: 3,
        chipSpriteY: 0
    }
}

/*----- audio constants ------*/
const backgroundMusic = new Audio('audio/Kenny_Rogers_-_The_Gambler-Totally-Paid-For.mp3');
const volume = document.querySelector('#volume-control');

/*----- event listeners -----*/
standButtonEls[0].addEventListener('click', function(){standCard(0)});
standButtonEls[1].addEventListener('click', function(){standCard(1)});
standButtonEls[2].addEventListener('click', function(){standCard(2)});
standButtonEls[3].addEventListener('click', function(){standCard(3)});
standButtonEls[4].addEventListener('click', function(){standCard(4)});

cardEls[0].addEventListener('click', function(){standCard(0)});
cardEls[1].addEventListener('click', function(){standCard(1)});
cardEls[2].addEventListener('click', function(){standCard(2)});
cardEls[3].addEventListener('click', function(){standCard(3)});
cardEls[4].addEventListener('click', function(){standCard(4)});

document.getElementById('bet-add').addEventListener('click', addBet);
document.getElementById('bet-minus').addEventListener('click', minusBet);
document.getElementById('bet-max').addEventListener('click', addMaxBet);
document.getElementById('add-funds-save').addEventListener('click', addFunds);

playMusicButtonEl.addEventListener('click', playMusic);

volume.addEventListener('input', function(e) {
    backgroundMusic.volume = e.currentTarget.value / 100;
});

addFundsSaveButtonEl.addEventListener('click', () => {
    setTimeout(function(){
        venmoAlertEl.classList.add('d-none');
        venmoInputEl.classList.remove('d-none');
        $('#add-funds-button-modal').modal('hide');
    }, 2000);

});

dealButtonEl.addEventListener('click', () => {
    resetBoard();    
    playHand();
});

addFundsButtonEl.addEventListener('click', () => {
    addFundsConfirmEl.classList.add('d-none');    
});

function playMusic() {
    if(!backgroundMusic.paused) {        
        backgroundMusic.pause();
        playMusicButtonEl.innerText = "Play Music";
        playMusicButtonEl.classList.add('btn-warning');
        playMusicButtonEl.classList.remove('btn-danger');
    } else {
        backgroundMusic.play();
        playMusicButtonEl.innerText = "Pause Music";
        playMusicButtonEl.classList.add('btn-danger');
        playMusicButtonEl.classList.remove('btn-warning');
    }
}

init();
/*----- functions -----*/
function init() {
    if(newHand) { 
        deckArr = [...fullDeckArr];
        standArr = [];
        drawArr = [];
        currentHand = [];
    }
    backgroundMusic.volume = 0.5;
    render();
}

function addFunds() {
    let depositAmount;
    if(venmoInputEl.value) {
        venmo = true;
    }
    depositAmountEl.value != '' ? 
        depositAmount = depositAmountEl.value.replace(/\$|,/g, '') :
        depositAmount = 0;
    if(!isNaN(depositAmount)) {
        chipTotal += +depositAmount;
        addFundsConfirmEl.classList.remove('d-none');
        addFundsConfirmEl.classList.add('alert-success');
        addFundsConfirmEl.classList.remove('alert-danger');
        addFundsConfirmEl.innerText = 'Added ' + depositAmount + " dollary doos!";
    } else {
        addFundsConfirmEl.classList.remove('d-none');
        addFundsConfirmEl.classList.remove('alert-success');
        addFundsConfirmEl.classList.add('alert-danger');
        addFundsConfirmEl.innerText = 'Enter a number silly';
    }
    depositAmountEl.value = '';
    render();
}

function addBet() {
    if(betAmount < 5) {
        betAmount += 1;
    }
    render();
}

function minusBet() {
    if(betAmount > 0) {
        betAmount -= 1;
    }
    render();
}

function addMaxBet() {
    if(betAmount < 5) {
        betAmount += (5 - betAmount);
    }
    render();
}

function standCard(num) {
    if(newHand) {
        if(standArr.includes(num)) {
            standArr = standArr.filter(value => value != num);
        } else {
            standArr.push(num);
        }
    }
    render();
}

function buildCardsObj() {
    let cardFace;
    let i = 0;
    const cardsObj = {};
    const cardsArr = [];
    for(let cardSuit of cardSuits) {
        for(let cardValue of cardValues) {
            cardFace = cardSuit + '-' + cardValue;
            cardsObj[cardFace] = {
                suit: cardSuit,
                value: cardValue,
                imgUrl: 'images/' + cardSuit + '/' + cardFace + '.svg'
            }
            cardsArr.push(cardFace);
        i++;
        }
    }
    return [cardsObj,cardsArr];
}

function pickRandomCard(arr) {
    const rand = Math.floor(Math.random()*arr.length);
    const randomCard = arr.splice(rand,1);
    return randomCard; 
}

function buildHand(deckArr, cardsWantedArr = [0, 1, 2, 3, 4]) {
    for(i = 0; i <= 4; i++) {
        if(cardsWantedArr.includes(i)) {
            currentHand[i] = pickRandomCard(deckArr);
        } else {
            currentHand[i] = currentHand[i];
        }
    }
    return currentHand;
}

function playHand() {
    if(newGame) { 
        newGame = false;      
    }
    if(newHand) {
        newHand = false;
    } else {
        newHand = true;
    }    
    // if new game, build full hand, else update hand
    if(newHand) {
        init();
        currentHand = buildHand(deckArr);
        for(let card in currentHand) {
            handArr[card] = cardsObj[currentHand[card]];
        }
        if(chipTotal < betAmount){
            betAmount = chipTotal;
        }
        chipTotal -= betAmount;
    } else {
        //standArr.sort();
        for(i = 0; i <= 4; i++) {            
            if(!standArr.includes(i)) { drawArr.push(i) }
        }
        drawArr.sort();
        currentHand = buildHand(deckArr, drawArr);
        for(let card in currentHand) {
            handArr[card] = cardsObj[currentHand[card]];
        } 
        if(getWinningHand(handArr)) {
            chipTotal += (getWinningHand(handArr)[1] * betAmount);
        }
        standArr = [];    
    }
    render();
}

// https://www.tutorialspoint.com/convert-number-to-tens-hundreds-thousands-and-so-on-javascript
const placeValue = (num, res = [], factor = 1) => {
    if(num){
       const val = (num % 10) * factor;
       res.unshift(val);
       return placeValue(Math.floor(num / 10), res, factor * 10);
    };
    return res;
 };

/*----- view functions -----*/
function resetBoard() {
    for(let cardEl in cardEls) {
        if(!standArr.includes(+cardEl)) {
            cardEls[cardEl].querySelector('img').src = 'images/backs/blue.svg';
        }
    }
}

function getTile(x, y, chipX, chipY) {
    ctx.drawImage(
        chipImages, 
        x * spriteWidth + 1, 
        y * spriteHeight + 1, 
        spriteWidth, 
        spriteHeight, 
        chipX, 
        chipY, 
        64, 
        32);
    return chipCanvasEl.toDataURL('image/png');
}

function drawChips() {
    ctx.clearRect(0, 0, chipCanvasEl.width, chipCanvasEl.height);
    chipCanvasEl.innerHTML = '';
    if(chipTotal > 0) {     
        let chip;
        const chipNode = document.createElement('img');
        const chipTensArr = placeValue(chipTotal);
        let xStart = 0;
        // build chips image from spritemap
        for(let value of chipTensArr) {
            let yStart = 120;
            let spriteObj = spriteMapObj[value.toString().length];
            for(i = 0; i < value; i += spriteObj.increment) {        
                chipNode.src = getTile(
                    spriteObj.chipSpriteX,
                    spriteObj.chipSpriteY,
                    xStart,
                    yStart);
                yStart -= 6;
            }
            xStart += 50;
        }           
    chipCanvasEl.prepend(chipNode);
    } 
}

function render() {
    // update card images
    const winningHand = getWinningHand(handArr);
    let betClass;
    if(!newGame) {
        let i = 1;
        currentHandValueEl.querySelector('h1').innerText = '';
        for(let cardEl in cardEls) {
             setTimeout(function(){
                 cardEls[cardEl].querySelector('img').src = handArr[cardEl].imgUrl;
             }, 200 * i);
        i++;
        }
        // update stand card html
        for(const standButton in standButtonEls) {
            if(newHand) {
                cardEls[+standButton].querySelector('img').style.border = 
                standArr.includes(+standButton) ? '2px solid red' : 'none';
                standButtonEls[+standButton].classList.remove(standArr.includes(+standButton) ?
                    'btn-danger' : 
                    'btn-info');
                standButtonEls[+standButton].classList.add(standArr.includes(+standButton) ? 
                    'btn-info' : 
                    'btn-danger');    
                standButtonEls[+standButton].disabled = false;    
            } else {
                standButtonEls[+standButton].disabled = true;

            }
        }
        // reset all bet rows
        document.querySelectorAll('.bet-row').forEach(function(el) { 
            el.classList.remove('bg-danger');           
        })
        if(winningHand) {
            let handId =  winningHand[0].toLowerCase().split(' ').join('-');
            document.getElementById(handId).classList.add('bg-danger');        
            setTimeout(function(){
                // update winning hand text
                currentHandValueEl.querySelector('h1').innerText = newHand ? 
                    'You have: ' + winningHand[0] : 
                    'You won with: ' + winningHand[0] + '!'; 
            }, 1000);
        } else {
            setTimeout(function(){
                //update losing hand text
                currentHandValueEl.querySelector('h1').innerText = newHand ? 
                'Nothing yet' : 
                "You're a LOOOOOOOSER";
            }, 1000);            
        }
        for(i = 1; i <= 5; i++) {
            betClass = '.bet-' + i;
            // reset all bet columns
            document.querySelectorAll(betClass).forEach(function(el) { 
                el.classList.remove('bg-danger');          
            })
            if(i === betAmount) {
                // update current bet column
                document.querySelectorAll(betClass).forEach(function(el) { 
                    el.classList.add('bg-danger');            
                })
            }
        }
    }
    if(!newHand || newGame) {
        betAmount <= 0 || chipTotal <= 0 ? 
            dealButtonEl.disabled = true : 
            dealButtonEl.disabled = false;
    }
    if((newHand && newGame) || !newHand) {
        dealButtonEl.innerText = 'Deal Hand';
        betButtonEls.forEach((buttonEl) => {
            buttonEl.disabled = false;
        })
     } else {
        dealButtonEl.innerText = 'Draw New Cards';
        betButtonEls.forEach((buttonEl) => {
            buttonEl.disabled = true;
        })

     }
    
    // update chip total text
    chipTotalEl.innerText = '$' + chipTotal.toLocaleString('en-US'); 
    document.getElementById('current-bet').innerText = 'Current bet: ' + betAmount;
    if(venmo) {
        venmoInputEl.value = '';
        venmoInputEl.classList.add('d-none');
        venmoAlertEl.classList.remove('d-none');
        venmo = false;
    } else {
        venmoInputEl.classList.remove('d-none');
        venmoAlertEl.classList.add('d-none');
    }
    if(chipTotal >= 0) {
        drawChips();
    }
    
    if(chipTotal === 0 && betAmount === 0) {
        document.getElementById('deal-hand-tooltip').setAttribute('title', 'Add a bet and funds to play!');
        $(function () {
            $('[data-bs-toggle="tooltip"]').tooltip();
        });
    } else if(chipTotal === 0 && betAmount > 0) {
        $(function () {
            $('[data-bs-toggle="tooltip"]').tooltip('dispose');
        })
        document.getElementById('deal-hand-tooltip').setAttribute('title', 'Add funds to play!');
        $(function () {
            $('[data-bs-toggle="tooltip"]').tooltip();
        });
    } else if(betAmount === 0 && chipTotal > 0) {
        $(function () {
            $('[data-bs-toggle="tooltip"]').tooltip('dispose');
        })
        document.getElementById('deal-hand-tooltip').setAttribute('title', 'Make a bet to play!');
        $(function () {
            $('[data-bs-toggle="tooltip"]').tooltip();
        });
    } else {
        $(function () {
            $('[data-bs-toggle="tooltip"]').tooltip('dispose');
        })
    }
}

/*----- hand test functions -----*/
function isStraight(handArr) {
    let rankMin;
    let rankMax;
    let aceLowStraight = [0, 1, 2, 3, 12];
    const cardRanksArr = getCardRanksArr(handArr);
    rankMin = Math.min(...cardRanksArr);  //get lowest card value
    rankMax = Math.max(...cardRanksArr);  // get highest card value
    if(cardRanksArr.every(value => (value >= rankMin) && (value <= rankMax) && 
        // if highest and lowest are within 4, not duplicates, 
        // and within the min/max range then it's a straight
        (countDuplicates(cardRanksArr) === 0) && (rankMax - rankMin === 4) && 
        handArr.length > 0)) { 
        return true;
    } else if(cardRanksArr.every(value => aceLowStraight.includes(value))) {
        return true;
    } else {
        return false;
    }
}

function isFlush(handArr) {
    const suitsArr = [];
    let suitMatches;
    for(const card of handArr) {
        suitsArr.push(card.suit);  // create array of suites
    }
    suitMatches = suitsArr.reduce((acc, value) => {  // reduce suits to get count of each suit
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
    if(Math.max(...Object.values(suitMatches)) === 5) {  // check if any suits have a count of 5
        return true;
    } else {
        return false;
    }
}

function isThreeOfKind(handArr) {
    const valueArr = [];
    let valueMatches;
    for(const card of handArr) {          
        valueArr.push(card.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
    if(Object.values(valueMatches).some(value => value == 3)) {
        return true;
    } else {
        return false;
    }
}

function isPair(handArr) {
    const valueArr = [];
    let valueMatches;
    for(const card of handArr) {          
        valueArr.push(card.value);
    }
    valueMatches = getValueMatches(valueArr);
    if(Object.values(valueMatches).some(value => value == 2)) {
        return true;
    } else {
        return false;
    }
}

function isFourOfKind(handArr) {
    const valueArr = [];
    let valueMatches;
    for(const card of handArr) {          
        valueArr.push(card.value);
    }
    valueMatches = getValueMatches(valueArr);
    if(Object.values(valueMatches).some(value => value == 4)) {
        return true;
    } else {
        return false;
    }
}

function isTwoPair(handArr) {
    const valueArr = [];
    let valueMatches;
    let pairs = 0;
    for(const card of handArr) {          
        valueArr.push(card.value);
    }
    valueMatches = getValueMatches(valueArr);
    for(const key in valueMatches) {
        if(valueMatches[key] === 2) {
            pairs++
        }        
    }
    if(pairs === 2) {
        return true;
    } else {
        return false;
    }  
}

function countJackPlus(handArr) {
    let jacksCount = 0;
    const cardRanksArr = getCardRanksArr(handArr);
    for(const rank of cardRanksArr) {
        if(rank >= 9) {
            jacksCount++;
        }
    }
    return jacksCount;
}

function countTenPlus(handArr) {
    let tensCount = 0;
    const cardRanksArr = getCardRanksArr(handArr);
    for(const rank of cardRanksArr) {
        if(rank >= 8) {
            tensCount++;
        }
    }
    return tensCount;
}

function isPairJacksPlus(handArr) {
    const valueArr = [];
    let valueMatches;
    const cardRanksArr = getCardRanksArr(handArr);
    for(const card of handArr) {          
        valueArr.push(card.value);
    }
    valueMatches = getValueMatches(valueArr);
    for(const cardValue in valueMatches) {
        if(+Object.keys(cardValues).find(key => 
            cardValues[key] === cardValue) >= 9 && valueMatches[cardValue] == 2) {
            return true;
        }
    } 
    return false;    
}

function isFourAces(handArr) {
    let acesCount = 0;
    const cardRanksArr = getCardRanksArr(handArr);
    for(const rank of cardRanksArr) {
        if(rank === 12) {
            acesCount++;
        }
    }
    if(acesCount === 4) {
        return true;
    } else {
        return false;
    }
}

function getWinningHand(handArr) {
    const winningHands = {
        'Royal Flush' : {
            value: 250,
            rules: {
                isFlush: isFlush(handArr),                    
                isStraight: isStraight(handArr),                 
                countTenPlus: countTenPlus(handArr) === 5                
            }
        },
        'Four Aces': {
            value: 160,
            rules: {
                isFourAces: isFourAces(handArr)
            }
        },
        'Four Jacks thru Kings': {
            value: 80,
            rules: {
                isFourOfKind: isFourOfKind(handArr),
                countJackPlus: countJackPlus(handArr) >= 4
            }
        },
        'Straight Flush': {
            value: 50,
            rules: {
                isStraight: isStraight(handArr),
                isFlush: isFlush(handArr)
            }
        },
        '4 2s thru 10s': {
            value: 50,
            rules: {
                countJackPlus: countJackPlus(handArr) <= 1,
                isFourOfKind: isFourOfKind(handArr)
            }
        },
        'Full House': {
            value: 9,
            rules: {
                isPair: isPair(handArr),
                isThreeOfKind: isThreeOfKind(handArr)
            }
        },
        'Flush': {
            value: 5,
            rules: {
                isFlush: isFlush(handArr)
            }
        },
        'Straight': {
            value: 4,
            rules: {
                isStraight: isStraight(handArr)
            }
        },
        '3 of a Kind': {
            value: 3,
            rules: {
                isThreeOfKind: isThreeOfKind(handArr)
            }
        },
        'Two Pair': {
            value: 1,
            rules: {
                isTwoPair: isTwoPair(handArr)
            }
        },
        'Jacks or Better': {
            value: 1,
            rules: {
                isPairJacksPlus: isPairJacksPlus(handArr)
            }
        }
    }
    // iterate through winning hands, return first hand with all true values else return false
    for(const hand in winningHands) {
        if(Object.values(winningHands[hand].rules).every(value => value === true)) { 
            return [hand,winningHands[hand].value];
        }
    }
    return false;
}

/*----- utility functions -----*/
function getCardRanksArr(handArr) {
    const cardRanksArr = [];
    for(const elem of handArr) {
        // compare card to card values array to determine rank
        cardRanksArr.push(+Object.keys(cardValues).find(key => 
            cardValues[key] === elem.value)); 
    }
    return cardRanksArr;
}

// stack overflow function to count duplicate values
function countDuplicates(arr) {
    const countsByItem = {};
    for(const item of arr) {
      countsByItem[item] = (countsByItem[item] || 0) + 1;
    }
    return Object.values(countsByItem).filter(val => val >= 2).length;
}
function getValueMatches(arr) {
    return arr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
}



