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


/*----- app's state (variables) -----*/

let deckArr = [...fullDeckArr];
let handObj = [];
let handArr = [];
let standArr = [];
let newGame = true;
let currentHand = [];
let drawArr = [];
let newHand = false;
let chipTotal = 100;
let betAmount = 0;
//let winningHand = ['New Hand'];

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

const chipTotalEl = document.getElementById('chip-total');
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

document.getElementById('bet-add').addEventListener('click', addBet);
document.getElementById('bet-minus').addEventListener('click', minusBet);
document.getElementById('bet-max').addEventListener('click', addMaxBet);

// TODO need to add new game state between each hand which stores the bet for the next hand. Do not allow bet unless in prehand state
// states: new game, betting, drawing, showdown

init();

/*----- functions -----*/
function init() {
    //console.log(newGame);
    //handArr = [];
    if(newHand) { 
        deckArr = [...fullDeckArr];
        standArr = [];
        drawArr = [];
        currentHand = [];
        //betAmount = 0;
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
    if(newGame) { 
        newGame = false; 
    }
    if(newHand) {
        newHand = false;
    } else {
        newHand = true;
    }
    if(chipTotal <= 0) {
        promptAddFunds(); // prompt user to add funds if playHand is invoked with <= chipTotal
        render;
        return;
    }
    
    // if new game, build full hand, else update hand
    if(newHand) {
        init();
        currentHand = buildHand(deckArr);
        for(let card in currentHand) {
            //console.log(card);
            //console.log(cardsObj[currentHand[card]]);
            handArr[card] = cardsObj[currentHand[card]];
            //console.log(handArr);
        }
        render();
        //newGame = false;
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
        //console.log(getWinningHand(handArr),'<--getWinningHand(handArr)');
        if(getWinningHand(handArr)) {
            chipTotal += (getWinningHand(handArr)[1] * betAmount);
        }
        chipTotal -= betAmount;
        standArr = [];    
        render();
        //newGame = true;
    }
}

function addBet() {
    if(betAmount < 5) {
        betAmount += 1;
        //chipTotal -= 1;
    }
    render();
}
function minusBet() {
    if(betAmount > 0) {
        betAmount -= 1;
        //chipTotal -= 1;
    }
    render();
}
function addMaxBet() {
    if(betAmount < 5) {
        betAmount += (5 - betAmount);
        //chipTotal -= (5 - betAmount);
    }
    render();
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

function render() {
    //update card images
    const winningHand = getWinningHand(handArr);
    if(!newGame) {
        for(const cardEl in cardEls) {
            cardEls[cardEl].querySelector('img').src = handArr[cardEl].imgUrl;
        }
    //update stand card html
        for(const standButton in standButtonEls) {
            cardEls[+standButton].querySelector('img').style.border = standArr.includes(+standButton) ? '2px solid red' : 'none';
            standButtonEls[+standButton].classList.remove(standArr.includes(+standButton) ? 'btn-danger' : 'btn-info');
            standButtonEls[+standButton].classList.add(standArr.includes(+standButton) ? 'btn-info' : 'btn-danger');    
        }
        //update current/winning hand text 
        currentHandValueEl.querySelector('h1').innerText = winningHand ? winningHand[0] : 'Nothing'; // update the hand value text with highest current winning hand
        console.log(winningHand,'<-winningHand');
        if(winningHand) {
            let handId =  winningHand[0].toLowerCase().split(" ").join('-');
            document.getElementById(handId).classList.remove('bg-primary');
            document.getElementById(handId).classList.add('bg-danger');
        } else {
            document.querySelectorAll('.bet-row').forEach(function(el) { 
                el.classList.remove('bg-danger');
                el.classList.add('bg-primary');            
            })
        }

    }
    newHand && !newGame ? currentHandValueEl.classList.remove('bg-primary') : currentHandValueEl.classList.add('bg-primary');
    chipTotalEl.innerText = chipTotal;
    document.getElementById('current-bet').innerText = 'Current bet: ' + betAmount;

}


/*----- hand test functions -----*/
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
    //console.log(cardRanksArr);
    rankMin = Math.min(...cardRanksArr);   //get lowest card value
    rankMax = Math.max(...cardRanksArr);    // get highest card value
    //console.log(cardRanksArr,'<-cardRanksArr');
    //console.log(rankMin, rankMax, '<-rankMin/Max');
    //console.log(countDuplicates(cardRanksArr, '<-cardRanksArr'));
    if(cardRanksArr.every(value => (value >= rankMin) && (value <= rankMax) && (countDuplicates(cardRanksArr) === 0) && (rankMax - rankMin === 4) && handArr.length > 0)) { // if highest and lowest are within 4, not duplicates, and within the min/max range then it's a straight
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
    let valueMatches;
    for(const elem of handArr) {          
        valueArr.push(elem.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});
    //console.log(valueMatches,'<-valueMatches');
    if(Object.values(valueMatches).some(value => value == 3)) {
        return true;
    } else {
        return false;
    }
}

function isPair(handArr) {
    const valueArr = [];
    let valueMatches;
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
    let valueMatches;
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
    let valueMatches;
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
    for(const elem of handArr) {          
        valueArr.push(elem.value);
    }
    valueMatches = valueArr.reduce((acc, value) => {
        acc[value] ? acc[value]++ : acc[value] = 1
        return acc;
    }, {});

    for(const elem in valueMatches) {
        if(+Object.keys(cardValues).find(key => cardValues[key] === elem) >= 9 && valueMatches[elem] == 2) {
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
    // handArr = [
    //     {suit: 'diamonds', value: 'A', imgUrl: 'images/hearts/hearts-r07.svg'},
    //     {suit: 'diamonds', value: 'A', imgUrl: 'images/diamonds/diamonds-r06.svg'},
    //     {suit: 'clubs', value: 'r04', imgUrl: 'images/diamonds/diamonds-r08.svg'},
    //     {suit: 'diamonds', value: 'A', imgUrl: 'images/diamonds/diamonds-J.svg'},
    //     {suit: 'diamonds', value: 'r10', imgUrl: 'images/diamonds/diamonds-J.svg'}
    // ]
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
    // itterate through winning hands, return first hand with all true values else return false
    for(const hand in winningHands) {
        //console.log(hand,'<-hand');
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



