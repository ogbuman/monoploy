// Dice Rolling Logic
let rollTimer; // Timer for the 30-second countdown to roll the dice

function rollDice() {
    clearTimeout(rollTimer); // Clear the timer since the dice is being rolled
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
    }, 1000);
}

function startRollTimer() {
    clearTimeout(rollTimer); // Clear any existing timer
    let timeLeft = 30; // Set the countdown time
    const timerElement = document.getElementById('timer');

    rollTimer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            if (timerElement) timerElement.textContent = `Time Left: ${timeLeft}s`; // Update the timer display
        } else {
            clearInterval(rollTimer); // Clear the timer when it reaches 0
            console.log(`Player ${gameState.currentPlayer} failed to roll the dice. Moving to the next player's turn.`);
            endTurn(); // Automatically end the turn
        }
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
const propertyData = [
    { position: 0, name: "GO", type: "go" },
    { position: 1, name: "Mediterranean Avenue", price: 60, rent: 2, color: "brown", owner: null },
    { position: 2, name: "Community Chest", type: "community-chest" },
    { position: 3, name: "Baltic Avenue", price: 60, rent: 4, color: "brown", owner: null },
    { position: 4, name: "Income Tax", type: "tax", amount: 200 },
    { position: 5, name: "Reading Railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 6, name: "Oriental Avenue", price: 100, rent: 6, color: "light-blue", owner: null },
    { position: 7, name: "Chance", type: "chance" },
    { position: 8, name: "Vermont Avenue", price: 100, rent: 6, color: "light-blue", owner: null },
    { position: 9, name: "Connecticut Avenue", price: 120, rent: 8, color: "light-blue", owner: null },
    { position: 10, name: "Jail", type: "jail" },
    { position: 11, name: "St. Charles Place", price: 140, rent: 10, color: "pink", owner: null },
    { position: 12, name: "Electric Company", price: 150, rent: 4, color: "utility", owner: null },
    { position: 13, name: "States Avenue", price: 140, rent: 10, color: "pink", owner: null },
    { position: 14, name: "Virginia Avenue", price: 160, rent: 12, color: "pink", owner: null },
    { position: 15, name: "Pennsylvania Railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 16, name: "St. James Place", price: 180, rent: 14, color: "orange", owner: null },
    { position: 17, name: "Community Chest", type: "community-chest" },
    { position: 18, name: "Tennessee Avenue", price: 180, rent: 14, color: "orange", owner: null },
    { position: 19, name: "New York Avenue", price: 200, rent: 16, color: "orange", owner: null },
    { position: 20, name: "Free Parking", type: "free-parking" },
    { position: 21, name: "Kentucky Avenue", price: 220, rent: 18, color: "red", owner: null },
    { position: 22, name: "Chance", type: "chance" },
    { position: 23, name: "Indiana Avenue", price: 220, rent: 18, color: "red", owner: null },
    { position: 24, name: "Illinois Avenue", price: 240, rent: 20, color: "red", owner: null },
    { position: 25, name: "B. & O. Railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 26, name: "Atlantic Avenue", price: 260, rent: 22, color: "yellow", owner: null },
    { position: 27, name: "Ventnor Avenue", price: 260, rent: 22, color: "yellow", owner: null },
    { position: 28, name: "Water Works", price: 150, rent: 4, color: "utility", owner: null },
    { position: 29, name: "Marvin Gardens", price: 280, rent: 24, color: "yellow", owner: null },
    { position: 30, name: "Go To Jail", type: "go-to-jail" },
    { position: 31, name: "Pacific Avenue", price: 300, rent: 26, color: "green", owner: null },
    { position: 32, name: "North Carolina Avenue", price: 300, rent: 26, color: "green", owner: null },
    { position: 33, name: "Community Chest", type: "community-chest" },
    { position: 34, name: "Pennsylvania Avenue", price: 320, rent: 28, color: "green", owner: null },
    { position: 35, name: "Short Line", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 36, name: "Park Place", price: 350, rent: 35, color: "blue", owner: null },
    { position: 37, name: "Luxury Tax", type: "tax", amount: 100 },
    { position: 38, name: "Boardwalk", price: 400, rent: 50, color: "blue", owner: null },
    { position: 39, name: "Chance", type: "chance" }
];

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
    {
        detail: "Advance to Go (Collect $200)",
        reward: 200,
        positionChange: 0,
        newPosition: 0
    },
    {
        detail: "Go to Jail. Go directly to Jail. Do not pass Go. Do not collect $200.",
        reward: 0,
        positionChange: 0,
        newPosition: 10 // Jail position
    },
    {
        detail: "Advance to Illinois Avenue. If you pass Go, collect $200.",
        reward: 200,
        positionChange: 0,
        newPosition: 24
    },
    {
        detail: "Advance to St. Charles Place. If you pass Go, collect $200.",
        reward: 200,
        positionChange: 0,
        newPosition: 11
    },
    {
        detail: "Take a trip to Reading Railroad. If you pass Go, collect $200.",
        reward: 200,
        positionChange: 0,
        newPosition: 5
    },
    {
        detail: "Take a walk on the Boardwalk. Advance token to Boardwalk.",
        reward: 0,
        positionChange: 0,
        newPosition: 38
    },
    {
        detail: "Go back three spaces.",
        reward: 0,
        positionChange: -3,
        newPosition: null
    },
    {
        detail: "Bank pays you dividend of $50.",
        reward: 50,
        positionChange: 0,
        newPosition: null
    },
    {
        detail: "Get out of Jail Free. This card may be kept until needed or sold.",
        reward: 0,
        positionChange: 0,
        newPosition: null
    },
    {
        detail: "Make general repairs on all your property. For each house pay $25. For each hotel pay $100.",
        reward: -100, // Example penalty
        positionChange: 0,
        newPosition: null
    },
    {
        detail: "Pay poor tax of $15.",
        reward: -15,
        positionChange: 0,
        newPosition: null
    },
    {
        detail: "You have been elected Chairman of the Board. Pay each player $50.",
        reward: -50,
        positionChange: 0,
        newPosition: null
    },
    {
        detail: "Your building loan matures. Collect $150.",
        reward: 150,
        positionChange: 0,
        newPosition: null
    },
    {
        detail: "Advance to the nearest utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
        reward: 0,
        positionChange: 0,
        newPosition: null // Logic to find nearest utility will be implemented
    },
    {
        detail: "Advance to the nearest railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.",
        reward: 0,
        positionChange: 0,
        newPosition: null // Logic to find nearest railroad will be implemented
    },
    {
        detail: "Go back to the nearest railroad and pay double rent if owned.",
        reward: 0,
        positionChange: 0,
        newPosition: null // Logic to find nearest railroad will be implemented
    }
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
    propertyData.forEach(prop => {
        gameState.properties[prop.position] = {
            owner: prop.owner,
            mortgaged: false,
            houses: 0
        };
    });

    // Ensure all positions from 0 to 39 are initialized in gameState.properties
    for (let i = 0; i < 40; i++) {
        if (!gameState.properties[i]) {
            gameState.properties[i] = { owner: null, mortgaged: false, houses: 0 };
        }
    }

    // Initialize shuffled cards
    gameState.chanceCards = shuffleArray([...chanceActions]);
    gameState.communityChestCards = shuffleArray([...communityChestActions]);

    // Ensure tokens for all players are created only once
    const goSpace = document.querySelector('[data-position="0"]');
    if (goSpace) {
        for (let i = 1; i <= 4; i++) {
            // Check if the token already exists to avoid duplicates
            if (!goSpace.querySelector(`.player-token.player-${i}`)) {
                const token = document.createElement('div');
                token.className = `player-token player-${i}`;
                token.style.backgroundColor = getPlayerColor(i); // Ensure correct color
                token.style.display = "block"; // Ensure visibility
                goSpace.appendChild(token); // Place on GO
            }
        }
    }
}

// Map logical positions to visual positions on the board
const positionMapping = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, // Bottom side (GO to Jail)
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, // Left side (Jail to Free Parking)
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, // Top side (Free Parking to Go to Jail)
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39  // Right side (Go to Jail to GO)
];

// Updated movePlayer function to use position mapping
function movePlayer(spaces) {
    const player = gameState.players[gameState.currentPlayer];
    player.position = (player.position + spaces) % 40; // Update logical position

    // Map logical position to visual position
    const visualPosition = positionMapping[player.position];
    const newSpace = document.querySelector(`[data-position="${visualPosition}"]`);
    if (!newSpace) {
        console.error(`Space at visual position ${visualPosition} not found.`);
        return;
    }

    // Update the player's token position
    const token = document.querySelector(`.player-token.player-${gameState.currentPlayer}`);
    if (token) {
        newSpace.appendChild(token); // Move token to the new space
        token.style.display = "block"; // Ensure the token is visible
    } else {
        console.error(`Token for Player ${gameState.currentPlayer} not found.`);
    }

    checkSpaceEffect(player.position); // Check the effect of landing on the new space
}

function checkSpaceEffect(position) {
    const player = gameState.currentPlayer;
    switch (position) {
        case 0: // GO
            console.log(`Player ${player} landed on GO. Collect $200.`);
            addMoney(player, 200);
            break;
        case 4: // Income Tax
            console.log(`Player ${player} landed on Income Tax. Pay $200.`);
            payMoney(player, 200);

            // End the turn after paying tax
            endTurn();
            break;
        case 20: // Free Parking
            console.log(`Player ${player} landed on Free Parking. Nothing happens.`);
            break;
        case 38: // Luxury Tax
            console.log(`Player ${player} landed on Luxury Tax. Pay $100.`);
            payMoney(player, 100);
            break;
        case 30: // Go To Jail
            console.log(`Player ${player} landed on Go To Jail. Moving to Jail.`);
            sendToJail(player);
            break;
        case 2: // Community Chest
        case 17:
        case 33:
            console.log(`Player ${player} landed on Community Chest.`);
            drawCommunityChestCard(player);
            break;
        case 7: // Chance
        case 22:
        case 36:
            console.log(`Player ${player} landed on Chance.`);
            drawChanceCard(player);
            break;
        default:
            handleProperty(position);
    }
}

function drawChanceCard(player) {
    const card = gameState.chanceCards.shift(); // Draw the top card
    gameState.chanceCards.push(card); // Put it back at the bottom of the deck
    console.log(`Player ${player} drew a Chance card: ${card.detail}`);
    // Implement Chance card effects here
}

function drawCommunityChestCard(player) {
    const card = gameState.communityChestCards.shift(); // Draw the top card
    gameState.communityChestCards.push(card); // Put it back at the bottom of the deck
    console.log(`Player ${player} drew a Community Chest card: ${card}`);
    // Implement Community Chest card effects here
}

// Property Management
function handleProperty(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property) {
        console.error(`Property data for position ${position} is undefined.`);
        return; // Exit gracefully
    }

    if (property.type === "community-chest" || property.type === "chance") {
        console.log(`Player landed on ${property.type}.`);
        property.type === "community-chest"
            ? drawCommunityChestCard(gameState.currentPlayer)
            : drawChanceCard(gameState.currentPlayer);
        return;
    }

    if (property.type === "tax") {
        console.log(`Player landed on ${property.name}. Pay $${property.amount}.`);
        payMoney(gameState.currentPlayer, property.amount);

        // End the turn after paying tax
        endTurn();
        return;
    }

    if (!property.owner) {
        showPurchaseDialog(position);
    } else if (property.owner !== gameState.currentPlayer) {
        payRent(position);

        // End the turn after paying rent
        endTurn();
    }
}

let actionTimer; // Timer for the 30-second countdown

function showPurchaseDialog(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property) return;

    const dialogArea = document.getElementById('dialog-area');
    if (!dialogArea) {
        console.error('Dialog area not found.');
        return;
    }

    // Clear any existing dialog
    dialogArea.innerHTML = '';

    // Create the dialog inside the dialog area
    const dialog = document.createElement('div');
    dialog.className = 'property-dialog';
    dialog.innerHTML = `
        <h3>${property.name}</h3>
        <p>Price: $${property.price}</p>
        <p>Rent: $${property.rent}</p>
        <button onclick="buyProperty(${position})">Buy</button>
        <button onclick="startAuction(${position})">Auction</button>
        <p class="timer">Time left: <span id="action-timer">30</span> seconds</p>
    `;
    dialogArea.appendChild(dialog);

    // Start the 30-second countdown
    startActionTimer(() => {
        console.log(`No action taken for property "${property.name}". Moving to the next player's turn.`);
        dialogArea.innerHTML = ''; // Clear the dialog
        endTurn(); // Automatically end the turn
    });
}

function startActionTimer(callback) {
    clearTimeout(actionTimer); // Clear any existing timer
    let timeLeft = 30; // Set the countdown time
    const timerElement = document.getElementById('action-timer');

    actionTimer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            if (timerElement) timerElement.textContent = timeLeft; // Update the timer display
        } else {
            clearInterval(actionTimer); // Clear the timer when it reaches 0
            callback(); // Execute the callback
        }
    }, 1000);
}

function buyProperty(position) {
    clearTimeout(actionTimer); // Clear the timer since an action is taken
    const property = propertyData.find(p => p.position === position);
    const player = gameState.currentPlayer;

    if (gameState.players[player].money >= property.price) {
        property.owner = player;
        addMoney(player, -property.price);
        updatePropertiesDisplay();

        // Debugging information
        console.log(`Property "${property.name}" purchased by Player ${player}`);
        console.log(`Owner: Player ${property.owner}`);
        console.log(`Token Color: ${getPlayerColor(player)}`);
        console.log(`Property Color: ${document.querySelector(`[data-position="${position}"]`).style.backgroundColor}`);

        // Remove the dialog and end the turn
        document.querySelector('.property-dialog').remove();
        endTurn();
    } else {
        console.error(`Player ${player} does not have enough money to buy "${property.name}".`);
    }
}

function startAuction(position) {
    clearTimeout(actionTimer); // Clear the timer since an action is taken
    console.log(`Auction started for property at position ${position}.`);
    // Implement auction logic here

    // Remove the dialog and end the turn
    document.querySelector('.property-dialog').remove();
    endTurn();
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
    console.log(`Ending Player ${gameState.currentPlayer}'s turn.`);
    gameState.currentPlayer = (gameState.currentPlayer % 4) + 1;
    updateTurnDisplay(); // Update the UI to show the current player's turn
    console.log(`It's now Player ${gameState.currentPlayer}'s turn.`);
    startRollTimer(); // Start the roll timer for the next player
}

// UI Updates
function updateFundsDisplay() {
    for (let i = 1; i <= 4; i++) { // Ensure all 4 players are updated
        const fundsElement = document.getElementById(`player${i}-funds`);
        if (fundsElement) {
            fundsElement.style.display = "block"; // Ensure visibility
            fundsElement.textContent = `Player ${i}: $${gameState.players[i].money}`;
        } else {
            console.error(`Funds element for Player ${i} not found.`);
        }
    }
}

function updatePropertiesDisplay() {
    propertyData.forEach(property => {
        const space = document.querySelector(`[data-position="${property.position}"]`);
        if (property.owner) {
            space.style.backgroundColor = getPlayerColor(property.owner); // Assign player's color
            space.classList.add(`owned-${property.owner}`);

            // Debugging information
            console.log(`Updated property "${property.name}" at position ${property.position}`);
            console.log(`Owner: Player ${property.owner}`);
            console.log(`Assigned Color: ${getPlayerColor(property.owner)}`);
        }
    });
}

// UI Updates
function updateTurnDisplay() {
    const turnDisplay = document.getElementById('turn-display');
    const rollButton = document.querySelector('.control-panel button'); // Movement button

    // Update the turn display text and color
    if (turnDisplay) {
        turnDisplay.textContent = `Player ${gameState.currentPlayer}'s Turn`;
        turnDisplay.style.color = getPlayerColor(gameState.currentPlayer);
        turnDisplay.classList.add('active');
    }

    // Update the roll button color
    if (rollButton) {
        rollButton.style.backgroundColor = getPlayerColor(gameState.currentPlayer);
    }

    // Reset all player funds to default color
    for (let i = 1; i <= 4; i++) {
        const fundsElement = document.getElementById(`player${i}-funds`);
        if (fundsElement) {
            fundsElement.style.color = 'black'; // Default color
            fundsElement.classList.remove('active');
        }
    }

    // Highlight the current player's funds
    const currentPlayerFunds = document.getElementById(`player${gameState.currentPlayer}-funds`);
    if (currentPlayerFunds) {
        currentPlayerFunds.style.color = getPlayerColor(gameState.currentPlayer);
        currentPlayerFunds.classList.add('active');
    }
}

function getPlayerColor(player) {
    switch (player) {
        case 1: return 'var(--color-player-1)'; // Blue
        case 2: return 'var(--color-player-2)'; // Green
        case 3: return 'var(--color-player-3)'; // Yellow
        case 4: return 'var(--color-player-4)'; // Purple
        default: return 'var(--color-border)';
    }
}

// Initialize the game
initGame();
updateFundsDisplay();
updateTurnDisplay();
startRollTimer();

