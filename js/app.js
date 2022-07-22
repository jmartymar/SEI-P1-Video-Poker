//constants
//state vars
//chached elem references
//event listeners
//functions ill need

const cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];
const cardValues = ['A', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'ro8', 'r09', 'r10', 'J', 'Q', 'K', 'A'];
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
const cardEls = {
    0: document.getElementById('card1'), 
    1: document.getElementById('card2'),
    2: document.getElementById('card3'),
    3: document.getElementById('card4'),
    4: document.getElementById('card5')
}

//console.log(winningHands);
//console.log(cardValues);

let deckArr = [];
let handObj = [];
let handArr = [];

init();
function init() {

const cards = buildCardsObj(); // build the cards obj which returns both the cardsObj and deckArr initial state
cardsObj = cards[0]; // initialize cardsObj - list of all card atributes
deckArr = cards[1]; // initialize deck with full deck of cards used
handArr = [];
//render();
}

//build the cards object;
function buildCardsObj() {
    let cardFace;
    let i = 0;
    const cardsObj = {};
    var cardsArr = [];
    for(let cardSuit of cardSuits) {
        //console.log(cardSuit, " cardsuite");

        // ingore first instance of A in cardValues obj, it's there for A-5 straight but is highest value card otherwise
        for(let cardValue of cardValues.slice(1)) {
            cardFace = cardSuit + '-' + cardValue;
            cardsObj[cardFace] = {
                //name: cardFace,
                suit: cardSuit,
                value: cardValue,
                imgUrl: 'css/card-deck-css/images/' + cardSuit + '/' + cardFace + '.svg'
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

function buildHand(arr) {
    let hand = [];
    for(let i = 0; i < 5; i++) {
        hand.push(pickRandomCard(arr));
    }
return hand;
}

function playHand() {
    init();
    let currentHand = buildHand(deckArr);
    //console.log(currentHand);
    //console.log(cardsObj);
    for(let card in currentHand) {
        //console.log(card);
        //console.log(cardsObj[currentHand[card]]);
        handArr.push({'imgUrl' : cardsObj[currentHand[card]].imgUrl});
        //console.log(handArr);
    }
    
render();
}

function render() {
    //console.log(handArr);
    for(let cardEl in cardEls) {
        //console.log(cardEl, '<-- cardEl');
        cardEls[cardEl].querySelector('img').src = handArr[cardEl].imgUrl;
        //console.log(cardEls[cardEl].src);
        //console.log(handArr[cardEl], '<-- handArr');
    }  
}

