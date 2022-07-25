/*----- constants -----*/
/*----- app's state (variables) -----*/
/*----- cached element references -----*/
/*----- event listeners -----*/
/*----- functions -----*/

/*----- constants -----*/
const cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];
const cardValues = ['r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'J', 'Q', 'K', 'A'];
const cards = buildCardsObj(); // build the cards obj which returns both the cardsObj and deckArr initial state
const cardsObj = cards[0]; // initialize cardsObj - list of all card atributes
const fullDeckArr = cards[1]; // initialize fullDeckArr - list of all card names in a deck
const winningHands = {

    'Royal Flush' : {
        suitMatches: 5,                     // how many cards must have matching suits
        valueMatches: null,                 // how many cards must match a single or multiple values ie. [4] = 4 cards must all have the same value, [2,3] = 2 cards AND 3 other cards must match values
        straightMatches: 5,                 // how many cards must be in a straight
        areValueRange: '>== r10',           // if cards must be in a range, what is that range
        areValueRangeMatches: 5,            // how many cards must match the areValueRange
        baseWinValue: 250                   // winning hand value at 1 bet
    },
    'Four Aces': {
        suitMatches: null,
        valueMatches: [4],
        straightMatches: null,
        areRoyal: null,
        areValueRange: '=== A',
        areValueRangeMatches: 4,
        baseWinValue: 160
    },
    'Four Jacks thru Kings': {
        suitMatches: null,
        valueMatches: [4],
        straightMatches: null,
        areValueRange: '>== J',
        areValueRangeMatches: 4,
        baseWinValue: 80
    },
    'Straight Flush': {
        suitMatches: 5,
        valueMatches: null,
        straightMatches: 5,
        areRoyal: null,
        areValueRange: '<== r10',
        areValueRangeMatches: 4,
        baseWinValue: 50
    },
    '4 2s thru 10s': {
        suitMatches: null,
        valueMatches: [4],
        straightMatches: null,
        areValueRange: '>== r2 && <== r10',
        areValueRangeMatches: 4,
        baseWinValue: 50
    },
    'Full House': {
        suitMatches: null,
        valueMatches: [2,3],
        straightMatches: null,
        areValueRange: null,
        areValueRangeMatches: null,
        baseWinValue: 9
    },
    'Flush': {
        suitMatches: 5,
        valueMatches: null,
        straightMatches: null,
        areValueRange: null,
        areValueRangeMatches: null,
        baseWinValue: 5
    },
    'Straight': {
        suitMatches: null,
        valueMatches: null,
        straightMatches: 5,
        areValueRange: null,
        areValueRangeMatches: null,
        baseWinValue: 4
    },
    '3 of a Kind': {
        suitMatches: null,
        valueMatches: [3],
        straightMatches: null,
        areValueRange: null,
        areValueRangeMatches: null,
        baseWinValue: 3
    },
    'Two Pair': {
        suitMatches: null,
        valueMatches: [2,2],
        straightMatches: null,
        areValueRange: null,
        areValueRangeMatches: null,
        baseWinValue: 1
    },
    'Jacks or Better': {
        suitMatches: null,
        valueMatches: [2],
        straightMatches: null,
        areValueRange:  '>== J',
        areValueRangeMatches: 2,
        baseWinValue: 1
    }
}

/*----- app's state (variables) -----*/

let deckArr = [...fullDeckArr];
let handObj = [];
let handArr = [];
let standArr = [];
let newGame = true;
let currentHand = [];
let drawArr = [];


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

const chipTotalEl = document.getElementById('chipTotal');
const chipPileEl = document.getElementById('chip-pile');
const currentBetEl = document.getElementById('current-bet');
const currentHandValueEl = document.getElementById('hand-value');


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


document.getElementById('deal-button').addEventListener('click', playHand);



init();

/*----- functions -----*/
function init() {
    //console.log(newGame);
    //handArr = [];
    if(newGame) { 
        deckArr = [...fullDeckArr];
        standArr = [];
        drawArr = [];
        currentHand = [];
    } else {
        render();
    }
    
}

//build the cards object;
function buildCardsObj() {
    let cardFace;
    let i = 0;
    const cardsObj = {};
    var cardsArr = [];
    for(let cardSuit of cardSuits) {
        //console.log(cardSuit, " cardsuite");

        for(let cardValue of cardValues) {
            cardFace = cardSuit + '-' + cardValue;
            cardsObj[cardFace] = {
                //name: cardFace,
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
    let rand = Math.floor(Math.random()*arr.length);
    //console.log(rand);
    //let randomCard = deckArr.slice(rand,rand+1);
    let randomCard = arr.splice(rand,1);
    //console.log(randomCard);
    return randomCard; 
}

function buildHand(deckArr, cardsWantedArr = [0, 1, 2, 3, 4]) {
    //let hand = [];
    for(i = 0; i <= 4; i++) {
        if(cardsWantedArr.includes(i)) {
            //console.log('true');
            currentHand[i] = pickRandomCard(deckArr);
        } else {
            //console.log(cardsWantedArr[i], 'false');
            currentHand[i] = currentHand[i];
        }
    }
    //console.log(currentHand, '<-currentHand')
return currentHand;
}

function playHand() {
    
    // if new game, build full hand, else update hand
    if(newGame) {
        init();
        currentHand = buildHand(deckArr);
        for(let card in currentHand) {
            //console.log(card);
            //console.log(cardsObj[currentHand[card]]);
            handArr[card] = cardsObj[currentHand[card]];
            //console.log(handArr);
        }
        render();
        newGame = false;
    } else {
        for(i = 0; i <= 4; i++) {
            
            if(!standArr.includes(i)) { drawArr.push(i) }
            // console.log(drawArr, "<- drawArr");
            // console.log(standArr[i], "<- standCardInd");
        }
        currentHand = buildHand(deckArr, drawArr);
        //console.log(currentHand, '<-currentHand');
        for(let card in currentHand) {
            //console.log(card);
            //console.log(cardsObj[currentHand[card]]);
            handArr[card] = cardsObj[currentHand[card]];
            //console.log(handArr);
        } 
        standArr = [];    
        render();
        newGame = true;
    }  
    //console.log(standArr, '<---standArr'); 
    


}

function standCard(num) {
    if(standArr.includes(num)) {
        standArr = standArr.filter(value => value != num);
    } else {
        standArr.push(num);
    }
    //console.log(standArr, '<-- standArr');
render();
}

function getHandValue() {
    let suitMatches;
    const suitsArr = [];
    const valueArr = [];
    for(idx in handArr) {    
    //create arrays of suits and values from hand
    suitsArr.push(handArr[idx].suit);        
    valueArr.push(handArr[idx].value);

    }
    //console.log(suitsArr, '<-suitsArr');
    // return an object of suit counts
    // suitMatches = suitsArr.reduce((acc, value) => {
    //     acc[value] ? acc[value]++ : acc[value] = 1
    //     return acc;
    // }, {});
    // return an object of value counts
    // valueMatches = valueArr.reduce((acc, value) => {
    //     acc[value] ? acc[value]++ : acc[value] = 1
    //     return acc;
    // }, {});
    //console.log(suitMatches, '<-suitMatches');
    //console.log(suitMatches.some(arrVal => '2' === arrVal));
    //if(Object.values(suitMatches).includes(2)) { console.log('got 2 suits')}
    const suitMatchMax = Math.max(...Object.values(suitMatches));
    const valueMatchMax = Math.max(...Object.values(valueMatches));
    console.log(handArr);
    console.log(suitMatchMax, "<- suitMatches");
    console.log(valueMatchMax, "<- valueMatches");
//console.log(suitMatches, "<- suitMatches");
//console.log(valueMatches, "<- valueMatches");

    //

    // 'Royal Flush' : {
    //     suitMatches: 5,                     // how many cards must have matching suits
    //     valueMatches: null,                 // how many cards must match a single or multiple values ie. [4] = 4 cards must all have the same value, [2,3] = 2 cards AND 3 other cards must match values
    //     straightMatches: 5,                 // how many cards must be in a straight
    //     areValueRange: '>== r10',           // if cards must be in a range, what is that range
    //     areValueRangeMatches: 5,            // how many cards must match the areValueRange
    //     baseWinValue: 250                   // winning hand value at 1 bet
    // },

}

function render() {
    //console.log(handArr);
    for(const cardEl in cardEls) {
        //console.log(cardEl, '<-- cardEl');
        //console.log(cardEls, '<-- cardEls');
        //console.log(handArr, '<--handArr');
        //console.log(handArr[cardEl], '<-- handArr[cardEl]');
        cardEls[cardEl].querySelector('img').src = handArr[cardEl].imgUrl;
        //console.log(cardEls[cardEl].src);
        //console.log(handArr[cardEl], '<-- handArr');
    }
    for(const standButton in standButtonEls) {
        //console.log(typeof standButton);
        //console.log(standArr, '<-standArr');
        //console.log(standArr.includes(+standButton), '<-stand button bool');
        //console.log(standButton, '<<-stand button')
        cardEls[+standButton].querySelector('img').style.border = standArr.includes(+standButton) ? '2px solid red' : 'none';
        standButtonEls[+standButton].classList.remove(standArr.includes(+standButton) ? 'btn-danger' : 'btn-info');
        standButtonEls[+standButton].classList.add(standArr.includes(+standButton) ? 'btn-info' : 'btn-danger');    
    }
    currentHandValueEl.innerText = newGame ? 'New Hand' : 'SomeValue'; // update the hand value text with highest current winning hand

}

function isStraight(handArr) {

    let rankMin;
    let rankMax;
    //console.log(handArr);
    // handArr = [
    //     {suit: 'hearts', value: 'r07', imgUrl: 'images/hearts/hearts-r07.svg'},
    //     {suit: 'diamonds', value: 'r06', imgUrl: 'images/diamonds/diamonds-r06.svg'},
    //     {suit: 'diamonds', value: 'r08', imgUrl: 'images/diamonds/diamonds-r08.svg'},
    //     {suit: 'diamonds', value: 'r05', imgUrl: 'images/diamonds/diamonds-J.svg'},
    //     {suit: 'hearts', value: 'r09', imgUrl: 'images/diamonds/diamonds-J.svg'}
    // ]

    //console.log(handArr,'<-handArr');
    const cardRanksArr = getCardRanksArr(handArr);
    console.log(cardRanksArr);
    rankMin = Math.min(...cardRanksArr);   //get lowest card value
    rankMax = Math.max(...cardRanksArr);    // get highest card value
    //console.log(cardRanksArr,'<-cardRanksArr');
    //console.log(rankMin, rankMax, '<-rankMin/Max');
    //console.log(countDuplicates(cardRanksArr, '<-cardRanksArr'));
    if(cardRanksArr.every(value => (value >= rankMin) && (value <= rankMax) && (countDuplicates(cardRanksArr) === 0) && (rankMax - rankMin === 4))) { // if highest and lowest are within 4, not duplicates, and within the min/max range then it's a straight
        return true;
    } else {
        return false;
    }
        //TODO Need to account for Ace low straight
    //console.log(rankMin, rankMax, '<---rankMin/RankMax');
}

function isFlush(handArr) {
    // handArr = [
    //     {suit: 'diamonds', value: 'r07', imgUrl: 'images/hearts/hearts-r07.svg'},
    //     {suit: 'diamonds', value: 'r06', imgUrl: 'images/diamonds/diamonds-r06.svg'},
    //     {suit: 'diamonds', value: 'r08', imgUrl: 'images/diamonds/diamonds-r08.svg'},
    //     {suit: 'diamonds', value: 'r05', imgUrl: 'images/diamonds/diamonds-J.svg'},
    //     {suit: 'clubs', value: 'r10', imgUrl: 'images/diamonds/diamonds-J.svg'}
    // ]
    //console.log(handArr,'<-handArr');
    const suitsArr = [];
    let suitMatches;
    for(const elem of handArr) {
        //console.log(elem);
        //console.log(handArr[elem], '<-handArr[elem]');
        suitsArr.push(elem.suit);        // create array of suites
    }
    suitMatches = suitsArr.reduce((acc, value) => {  // reduce suits to get count of each suit
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});

    //console.log(suitMatches,'<-suitMatches');

    if(Math.max(...Object.values(suitMatches)) === 5) { // check if any suits have a count of 5
        return true;
    } else {
        return false;
    }
}

function isThreeOfKind(handArr) {
    const valueArr = [];
    for(const elem of handArr) {          
        valueArr.push(elem.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
    console.log(valueMatches,'<-valueMatches');
    if(Object.values(valueMatches).some(value => value == 3)) {
        return true;
    } else {
        return false;
    }
}

function isPair(handArr) {
    const valueArr = [];
    for(const elem of handArr) {          
        valueArr.push(elem.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
    //console.log(valueMatches,'<-valueMatches');
    if(Object.values(valueMatches).some(value => value == 2)) {
        return true;
    } else {
        return false;
    }
}

function isFourOfKind(handArr) {
    const valueArr = [];
    for(const elem of handArr) {          
        valueArr.push(elem.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
    //console.log(valueMatches,'<-valueMatches');
    if(Object.values(valueMatches).some(value => value == 4)) {
        return true;
    } else {
        return false;
    }
}

function isTwoPair(handArr) {
    const valueArr = [];
    let pairs = 0;
    for(const elem of handArr) {          
        valueArr.push(elem.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});

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

function isFullHouse(handArr) {
    if(isPair(handArr) && isThreeOfKind(handArr)) {
        return true;
    } else {
        return false;
    }
}

function countJackPlus(handArr) {
    let jacksCount = 0;
    handArr = [
        {suit: 'diamonds', value: 'J', imgUrl: 'images/hearts/hearts-r07.svg'},
        {suit: 'diamonds', value: 'K', imgUrl: 'images/diamonds/diamonds-r06.svg'},
        {suit: 'diamonds', value: 'A', imgUrl: 'images/diamonds/diamonds-r08.svg'},
        {suit: 'diamonds', value: 'r05', imgUrl: 'images/diamonds/diamonds-J.svg'},
        {suit: 'clubs', value: 'r10', imgUrl: 'images/diamonds/diamonds-J.svg'}
    ]
    const cardRanksArr = getCardRanksArr(handArr);
    console.log(cardRanksArr);
    for(const rank of cardRanksArr) {
        if(rank >= 9) {
            jacksCount++;
        }
    }
    return jacksCount;
}

function countTenPlus(handArr) {

}

/*----- utility functions -----*/

function getCardRanksArr(handArr) {
    const cardRanksArr = [];
    for(const elem of handArr) {
        cardRanksArr.push(+Object.keys(cardValues).find(key => cardValues[key] === elem.value)); // compare card to card values array to determine rank
    }
    return cardRanksArr;
}

// stack overflow function to count duplicate values
function countDuplicates(arr) {
    const countsByItem = {};
    for(const item of arr) {
      countsByItem[item] = (countsByItem[item] || 0) + 1;
    }
    return Object.values(countsByItem)
      .filter(val => val >= 2)
      .length;
}



