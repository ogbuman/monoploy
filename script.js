// Dice Rolling Logic
function rollDice() {
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');

// Add rolling animation
dice1.parentElement.classList.add('rolling');
dice2.parentElement.classList.add('rolling');

setTimeout(() => {
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;

    dice1.textContent = roll1;
    dice2.textContent = roll2;

    dice1.parentElement.classList.remove('rolling');
    dice2.parentElement.classList.remove('rolling');

    movePlayer(roll1 + roll2); // Moves the player based on the dice roll

    // End the turn after movement
    endTurn();
}, 1000);
}

// Player Money Management
let players = {
    1: 1500,
    2: 1500,
    3: 1500,
    4: 1500
};

function updateFunds() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`player${i}-funds`).textContent =
            `Player ${i}: $${players[i]}`;
    }
}

// Game State Manager
const gameState = {
    currentPlayer: 1,
    players: {
        1: { position: 0, money: 1500, inJail: false, jailTurns: 0 },
        2: { position: 0, money: 1500, inJail: false, jailTurns: 0 },
        3: { position: 0, money: 1500, inJail: false, jailTurns: 0 },
        4: { position: 0, money: 1500, inJail: false, jailTurns: 0 }
    },
    properties: {},
    chanceCards: [],
    communityChestCards: [],
    houses: {},
    hotels: {}
};

// Property Data Model
const propertyData = {
    // Bottom Side
    1: { name: 'Mediterranean Avenue', price: 60, rent: 2, color: 'brown' },
    3: { name: 'Baltic Avenue', price: 60, rent: 4, color: 'brown' },
    5: { name: 'Reading Railroad', price: 200, rent: 25, color: 'railroad' },
    6: { name: 'Oriental Avenue', price: 100, rent: 6, color: 'light-blue' },
    8: { name: 'Vermont Avenue', price: 100, rent: 6, color: 'light-blue' },
    9: { name: 'Connecticut Avenue', price: 120, rent: 8, color: 'light-blue' },

    // Left Side
    11: { name: 'St. Charles Place', price: 140, rent: 10, color: 'pink' },
    12: { name: 'Electric Company', price: 150, rent: 4, color: 'utility' },
    13: { name: 'States Avenue', price: 140, rent: 10, color: 'pink' },
    14: { name: 'Virginia Avenue', price: 160, rent: 12, color: 'pink' },
    15: { name: 'Pennsylvania Railroad', price: 200, rent: 25, color: 'railroad' },
    16: { name: 'St. James Place', price: 180, rent: 14, color: 'orange' },
    18: { name: 'Tennessee Avenue', price: 180, rent: 14, color: 'orange' },
    19: { name: 'New York Avenue', price: 200, rent: 16, color: 'orange' },

    // Top Side
    21: { name: 'Kentucky Avenue', price: 220, rent: 18, color: 'red' },
    23: { name: 'Indiana Avenue', price: 220, rent: 18, color: 'red' },
    24: { name: 'Illinois Avenue', price: 240, rent: 20, color: 'red' },
    25: { name: 'B. & O. Railroad', price: 200, rent: 25, color: 'railroad' },
    26: { name: 'Atlantic Avenue', price: 260, rent: 22, color: 'yellow' },
    27: { name: 'Ventnor Avenue', price: 260, rent: 22, color: 'yellow' },
    28: { name: 'Water Works', price: 150, rent: 4, color: 'utility' },
    29: { name: 'Marvin Gardens', price: 280, rent: 24, color: 'yellow' },

    // Right Side
    31: { name: 'Pacific Avenue', price: 300, rent: 26, color: 'green' },
    32: { name: 'North Carolina Avenue', price: 300, rent: 26, color: 'green' },
    34: { name: 'Pennsylvania Avenue', price: 320, rent: 28, color: 'green' },
    35: { name: 'Short Line', price: 200, rent: 25, color: 'railroad' },
    37: { name: 'Park Place', price: 350, rent: 35, color: 'blue' },
    39: { name: 'Boardwalk', price: 400, rent: 50, color: 'blue' }
};

// Add these above the initGame function
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Initialize card decks
const chanceActions = [
    "Advance to Go (Collect $200)",
    "Go to Jail. Go directly to Jail. Do not pass Go. Do not collect $200.",
    "Advance to Illinois Avenue. If you pass Go, collect $200.",
    "Advance to St. Charles Place. If you pass Go, collect $200.",
    "Take a trip to Reading Railroad. If you pass Go, collect $200.",
    "Take a walk on the Boardwalk. Advance token to Boardwalk.",
    "Go back three spaces.",
    "Bank pays you dividend of $50.",
    "Get out of Jail Free. This card may be kept until needed or sold.",
    "Make general repairs on all your property. For each house pay $25. For each hotel pay $100.",
    "Pay poor tax of $15.",
    "You have been elected Chairman of the Board. Pay each player $50.",
    "Your building loan matures. Collect $150.",
    "Advance to the nearest utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
    "Advance to the nearest railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.",
    "Advance to the nearest railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled."
];

const communityChestActions = [
    "Advance to Go (Collect $200)",
    "Bank error in your favor. Collect $200.",
    "Doctor's fees. Pay $50.",
    "From sale of stock, you get $50.",
    "Get out of Jail Free. This card may be kept until needed or sold.",
    "Go to Jail. Go directly to Jail. Do not pass Go. Do not collect $200.",
    "Grand Opera Night. Collect $50 from every player for opening night seats.",
    "Holiday Fund matures. Receive $100.",
    "Income tax refund. Collect $20.",
    "It is your birthday. Collect $10 from every player.",
    "Life insurance matures. Collect $100.",
    "Pay hospital fees of $100.",
    "Pay school fees of $150.",
    "Receive $25 consultancy fee.",
    "You are assessed for street repairs. $40 per house. $115 per hotel.",
    "You have won second prize in a beauty contest. Collect $10."
];

// Modified initGame function
function initGame() {
    // Initialize properties
    Object.keys(propertyData).forEach(pos => {
        gameState.properties[pos] = {
            owner: null,
            mortgaged: false,
            houses: 0
        };
    });
    
    // Initialize shuffled cards
    gameState.chanceCards = shuffleArray([...chanceActions]);
    gameState.communityChestCards = shuffleArray([...communityChestActions]);
}

// Updated movePlayer function to use data-position
function movePlayer(spaces) {
    const player = gameState.players[gameState.currentPlayer];
    player.position = (player.position + spaces) % 40; // Update position (board has 40 spaces)

    // Find the new space on the board using data-position
    const newSpace = document.querySelector(`[data-position="${player.position}"]`);
    if (!newSpace) {
        console.error(`Space at position ${player.position} not found.`);
        return;
    }

    // Update the player's token position
    const token = document.querySelector(`.player-token.player-${gameState.currentPlayer}`);
    newSpace.appendChild(token); // Move token to the new space

    checkSpaceEffect(player.position); // Check the effect of landing on the new space
}

function checkSpaceEffect(position) {
    const player = gameState.currentPlayer;
    switch(position) {
        case 0: // GO
            addMoney(player, 200);
            break;
        case 4: // Income Tax
            payMoney(player, 200);
            break;
        case 38: // Luxury Tax
            payMoney(player, 100);
            break;
        case 30: // Go To Jail
            sendToJail(player);
            break;
        default:
            handleProperty(position);
    }
}

// Property Management
function handleProperty(position) {
    const property = gameState.properties[position];
    if(!property.owner) {
        showPurchaseDialog(position);
    } else if(property.owner !== gameState.currentPlayer) {
        payRent(position);
    }
}

function showPurchaseDialog(position) {
    const propData = propertyData[position];
    const dialog = document.createElement('div');
    dialog.innerHTML = `
        <div class="property-dialog">
            <h3>${propData.name}</h3>
            <p>Price: $${propData.price}</p>
            <button onclick="buyProperty(${position})">Buy</button>
            <button onclick="startAuction(${position})">Auction</button>
        </div>
    `;
    document.body.appendChild(dialog);
}

function buyProperty(position) {
    const player = gameState.currentPlayer;
    const price = propertyData[position].price;
    
    if(gameState.players[player].money >= price) {
        gameState.properties[position].owner = player;
        addMoney(player, -price);
        updatePropertiesDisplay();
    }
}

// Money Management
function addMoney(player, amount) {
    gameState.players[player].money += amount;
    updateFundsDisplay();
}

function payMoney(player, amount) {
    if(gameState.players[player].money >= amount) {
        addMoney(player, -amount);
    } else {
        handleBankruptcy(player);
    }
}

// Jail System
function sendToJail(player) {
    gameState.players[player].inJail = true;
    gameState.players[player].position = 10; // Jail position
    // Update visual position
}

// Turn Management
function endTurn() {
    gameState.currentPlayer = gameState.currentPlayer % 4 + 1; // Cycle through players 1 to 4
    updateTurnDisplay(); // Update the UI to show the current player's turn
    console.log(`It's now Player ${gameState.currentPlayer}'s turn.`);
}

// UI Updates
function updateFundsDisplay() {
    for(let i = 1; i <= 4; i++) {
        document.getElementById(`player${i}-funds`).textContent = 
            `Player ${i}: $${gameState.players[i].money}`;
    }
}

function updatePropertiesDisplay() {
    Object.keys(gameState.properties).forEach(pos => {
        const prop = gameState.properties[pos];
        const space = document.querySelectorAll('.space')[pos];
        if(prop.owner) {
            space.classList.add(`owned-${prop.owner}`);
        }
    });
}

// UI Updates
function updateTurnDisplay() {
    const turnDisplay = document.getElementById('turn-display');
    if (turnDisplay) {
        turnDisplay.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    }
}

// Initialize the game
initGame();
updateFundsDisplay();
updateTurnDisplay();

