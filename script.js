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
            if (timerElement) timerElement.textContent = `Ends in: ${timeLeft}s`; // Update the timer display
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
    { position: 1, name: "Mediterranean Avenue", type: "property", price: 60, rent: 2, color: "brown", owner: null },
    { position: 2, name: "Community Chest", type: "community-chest" },
    { position: 3, name: "Baltic Avenue", type: "property", price: 60, rent: 4, color: "brown", owner: null },
    { position: 4, name: "Income Tax", type: "tax", amount: 200 },
    { position: 5, name: "Reading Railroad", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 6, name: "Oriental Avenue", type: "property", price: 100, rent: 6, color: "light-blue", owner: null },
    { position: 7, name: "Chance", type: "chance" },
    { position: 8, name: "Vermont Avenue", type: "property", price: 100, rent: 6, color: "light-blue", owner: null },
    { position: 9, name: "Connecticut Avenue", type: "property", price: 120, rent: 8, color: "light-blue", owner: null },
    { position: 10, name: "Jail", type: "jail" },
    { position: 11, name: "St. Charles Place", type: "property", price: 140, rent: 10, color: "pink", owner: null },
    { position: 12, name: "Electric Company", type: "utility", price: 150, rent: 4, color: "utility", owner: null },
    { position: 13, name: "States Avenue", type: "property", price: 140, rent: 10, color: "pink", owner: null },
    { position: 14, name: "Virginia Avenue", type: "property", price: 160, rent: 12, color: "pink", owner: null },
    { position: 15, name: "Pennsylvania Railroad", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 16, name: "St. James Place", type: "property", price: 180, rent: 14, color: "orange", owner: null },
    { position: 17, name: "Community Chest", type: "community-chest" },
    { position: 18, name: "Tennessee Avenue", type: "property", price: 180, rent: 14, color: "orange", owner: null },
    { position: 19, name: "New York Avenue", type: "property", price: 200, rent: 16, color: "orange", owner: null },
    { position: 20, name: "Free Parking", type: "free-parking" },
    { position: 21, name: "Kentucky Avenue", type: "property", price: 220, rent: 18, color: "red", owner: null },
    { position: 22, name: "Chance", type: "chance" },
    { position: 23, name: "Indiana Avenue", type: "property", price: 220, rent: 18, color: "red", owner: null },
    { position: 24, name: "Illinois Avenue", type: "property", price: 240, rent: 20, color: "red", owner: null },
    { position: 25, name: "B. & O. Railroad", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 26, name: "Atlantic Avenue", type: "property", price: 260, rent: 22, color: "yellow", owner: null },
    { position: 27, name: "Ventnor Avenue", type: "property", price: 260, rent: 22, color: "yellow", owner: null },
    { position: 28, name: "Water Works", type: "utility", price: 150, rent: 4, color: "utility", owner: null },
    { position: 29, name: "Marvin Gardens", type: "property", price: 280, rent: 24, color: "yellow", owner: null },
    { position: 30, name: "Go To Jail", type: "go-to-jail" },
    { position: 31, name: "Pacific Avenue", type: "property", price: 300, rent: 26, color: "green", owner: null },
    { position: 32, name: "North Carolina Avenue", type: "property", price: 300, rent: 26, color: "green", owner: null },
    { position: 33, name: "Community Chest", type: "community-chest" },
    { position: 34, name: "Pennsylvania Avenue", type: "property", price: 320, rent: 28, color: "green", owner: null },
    { position: 35, name: "Short Line", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null },
    { position: 36, name: "Park Place", type: "property", price: 350, rent: 35, color: "blue", owner: null },
    { position: 37, name: "Luxury Tax", type: "tax", amount: 100 },
    { position: 38, name: "Boardwalk", type: "property", price: 400, rent: 50, color: "blue", owner: null },
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
        name: "Advance to Go (Collect $200)",
        price: 200,
        positionChange: 0,
        position: 0
    },
    {
        name: "Go to Jail. Go directly to Jail. Do not pass Go. Do not collect $200.",
        price: 0,
        positionChange: 0,
        position: 10 // Jail position
    },
    {
        name: "Advance to Illinois Avenue. If you pass Go, collect $200.",
        price: 200,
        positionChange: 0,
        position: 24
    },
    {
        name: "Advance to St. Charles Place. If you pass Go, collect $200.",
        price: 200,
        positionChange: 0,
        position: 11
    },
    {
        name: "Take a trip to Reading Railroad. If you pass Go, collect $200.",
        price: 200,
        positionChange: 0,
        position: 5
    },
    {
        name: "Take a walk on the Boardwalk. Advance token to Boardwalk.",
        price: 0,
        positionChange: 0,
        position: 38
    },
    {
        name: "Go back three spaces.",
        price: 0,
        positionChange: -3,
        position: null
    },
    {
        name: "Bank pays you dividend of $50.",
        price: 50,
        positionChange: 0,
        position: null
    },
    {
        name: "Get out of Jail Free. This card may be kept until needed or sold.",
        price: 0,
        positionChange: 0,
        position: null
    },
    {
        name: "Make general repairs on all your property. For each house pay $25. For each hotel pay $100.",
        price: -100, // Example penalty
        positionChange: 0,
        position: null
    },
    {
        name: "Pay poor tax of $15.",
        price: -15,
        positionChange: 0,
        position: null
    },
    {
        name: "You have been elected Chairman of the Board. Pay each player $50.",
        price: -50,
        positionChange: 0,
        position: null
    },
    {
        name: "Your building loan matures. Collect $150.",
        price: 150,
        positionChange: 0,
        position: null
    },
    {
        name: "Advance to the nearest utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
        price: 0,
        positionChange: 0,
        position: null // Logic to find nearest utility will be implemented
    },
    {
        name: "Advance to the nearest railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.",
        price: 0,
        positionChange: 0,
        position: null // Logic to find nearest railroad will be implemented
    },
    {
        name: "Go back to the nearest railroad and pay double rent if owned.",
        price: 0,
        positionChange: 0,
        position: null // Logic to find nearest railroad will be implemented
    }
];

const communityChestActions = [
    {
        name: "Advance to Go (Collect $200)",
        price: 200,
        positionChange: 0,
        position: 0
    },
    {
        name: "Bank error in your favor. Collect $200.",
        price: 200,
        positionChange: 0,
        position: null
    },
    {
        name: "Doctor's fees. Pay $50.",
        price: -50,
        positionChange: 0,
        position: null
    },
    {
        name: "From sale of stock, you get $50.",
        price: 50,
        positionChange: 0,
        position: null
    },
    {
        name: "Get out of Jail Free. This card may be kept until needed or sold.",
        price: 0,
        positionChange: 0,
        position: null
    },
    {
        name: "Go to Jail. Go directly to Jail. Do not pass Go. Do not collect $200.",
        price: 0,
        positionChange: 0,
        position: 10 // Jail position
    },
    {
        name: "Grand Opera Night. Collect $50 from every player for opening night seats.",
        price: 50,
        positionChange: 0,
        position: null
    },
    {
        name: "Holiday Fund matures. Receive $100.",
        price: 100,
        positionChange: 0,
        position: null
    },
    {
        name: "Income tax refund. Collect $20.",
        price: 20,
        positionChange: 0,
        position: null
    },
    {
        name: "It is your birthday. Collect $10 from every player.",
        price: 10,
        positionChange: 0,
        position: null
    },
    {
        name: "Life insurance matures. Collect $100.",
        price: 100,
        positionChange: 0,
        position: null
    },
    {
        name: "Pay hospital fees of $100.",
        price: -100,
        positionChange: 0,
        position: null
    },
    {
        name: "Pay school fees of $150.",
        price: -150,
        positionChange: 0,
        position: null
    },
    {
        name: "Receive $25 consultancy fee.",
        price: 25,
        positionChange: 0,
        position: null
    },
    {
        name: "You are assessed for street repairs. $40 per house. $115 per hotel.",
        price: -40, // Example penalty for houses
        positionChange: 0,
        position: null
    },
    {
        name: "You have won second prize in a beauty contest. Collect $10.",
        price: 10,
        positionChange: 0,
        position: null
    }
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
    const previousPosition = player.position;
    player.position = (player.position + spaces) % 40; // Update logical position

    // Reward the player with $200 if they pass or land on GO (position 0)
    if (player.position < previousPosition) {
        console.log(`Player ${gameState.currentPlayer} passed GO. Collect $200.`);
        addMoney(gameState.currentPlayer, 200);
    }

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
    const property = propertyData.find(p => p.position === position);

    if (!property) {
        console.error(`Property data for position ${position} is undefined.`);
        return;
    }

    console.log(`Player ${player} landed on ${property.name}.`);

    switch (position) {
        case 0: // GO
            console.log(`Player ${player} collects $200 for landing on GO.`);
            addMoney(player, 200);
            break;

        case 1:
        case 3:
        case 6:
        case 8:
        case 9:
        case 11:
        case 13:
        case 14:
        case 16:
        case 18:
        case 19:
        case 21:
        case 23:
        case 24:
        case 26:
        case 27:
        case 29:
        case 31:
        case 32:
        case 34:
        case 36:
        case 38:
            if (property.type === "property" || property.type === "railroad" || property.type === "utility") {
                if (property.owner) {
                    if (property.owner !== player) {
                        console.log(`Player ${player} landed on "${property.name}" owned by Player ${property.owner}.`);
                        payRent(position); // Pay rent to the owner
                    } else {
                        console.log(`Player ${player} landed on their own property "${property.name}".`);
                    }
                } else {
                    console.log(`Property "${property.name}" is unowned. Offering to Player ${player}.`);
                    showPurchaseDialog(position); // Open dialog to buy or auction
                    return; // Do not end the turn yet
                }
            }
            break;

        case 2:
        case 17:
        case 33:
            console.log(`Player ${player} landed on Community Chest.`);
            drawCommunityChestCard(player);
            break;

        case 7:
        case 22:
        case 39:
            console.log(`Player ${player} landed on Chance.`);
            drawChanceCard(player);
            break;

        case 4: // Income Tax
            console.log(`Player ${player} landed on Income Tax. Pay $200.`);
            payMoney(player, 200);
            break;

        case 37: // Luxury Tax
            console.log(`Player ${player} landed on Luxury Tax. Pay $100.`);
            payMoney(player, 100);
            break;

        case 5:
        case 15:
        case 25:
        case 35:
            if (property.type === "railroad") {
                if (property.owner) {
                    if (property.owner !== player) {
                        console.log(`Player ${player} landed on "${property.name}" owned by Player ${property.owner}.`);
                        payRent(position); // Pay rent to the owner
                    } else {
                        console.log(`Player ${player} landed on their own railroad "${property.name}".`);
                    }
                } else {
                    console.log(`Railroad "${property.name}" is unowned. Offering to Player ${player}.`);
                    showPurchaseDialog(position); // Open dialog to buy or auction
                    return; // Do not end the turn yet
                }
            }
            break;

        case 12:
        case 28:
            if (property.type === "utility") {
                if (property.owner) {
                    if (property.owner !== player) {
                        console.log(`Player ${player} landed on "${property.name}" owned by Player ${property.owner}.`);
                        payRent(position); // Pay rent to the owner
                    } else {
                        console.log(`Player ${player} landed on their own utility "${property.name}".`);
                    }
                } else {
                    console.log(`Utility "${property.name}" is unowned. Offering to Player ${player}.`);
                    showPurchaseDialog(position); // Open dialog to buy or auction
                    return; // Do not end the turn yet
                }
            }
            break;

        case 10: // Jail (Just Visiting)
            console.log(`Player ${player} is just visiting Jail.`);
            break;

        case 20: // Free Parking
            console.log(`Player ${player} landed on Free Parking. Nothing happens.`);
            break;

        case 30: // Go To Jail
            console.log(`Player ${player} landed on Go To Jail. Moving to Jail.`);
            sendToJail(player);
            break;

        default:
            console.error(`Unhandled position: ${position}`);
    }

    // End the turn after handling the space effect
    endTurn();
}

function drawChanceCard(player) {
    const card = gameState.chanceCards.shift(); // Draw the top card
    gameState.chanceCards.push(card); // Put it back at the bottom of the deck
    console.log(`Player ${player} drew a Chance card: ${card.name}`);

    // Apply the card's effects
    if (card.price > 0) {
        console.log(`Player ${player} receives $${card.price}.`);
        addMoney(player, card.price); // Add money to the player
    } else if (card.price < 0) {
        console.log(`Player ${player} pays $${Math.abs(card.price)}.`);
        payMoney(player, Math.abs(card.price)); // Deduct money from the player
    }

    if (card.position !== null) {
        console.log(`Player ${player} moves to position ${card.position}.`);
        gameState.players[player].position = card.position; // Update player's position
        movePlayer(0); // Trigger effects of the new position
    }

    if (card.name.includes("Get out of Jail Free")) {
        console.log(`Player ${player} receives a "Get Out of Jail Free" card.`);
        gameState.players[player].getOutOfJailFree = true; // Add a flag for the card
    }

    if (card.name.includes("Go back")) {
        const spaces = Math.abs(card.positionChange);
        console.log(`Player ${player} moves back ${spaces} spaces.`);
        gameState.players[player].position = (gameState.players[player].position - spaces + 40) % 40; // Move back
        movePlayer(0); // Trigger effects of the new position
    }

    if (card.name.includes("Advance to the nearest utility")) {
        console.log(`Player ${player} advances to the nearest utility.`);
        const utilities = [12, 28];
        const currentPosition = gameState.players[player].position;
        const nearestUtility = utilities.find(pos => pos > currentPosition) || utilities[0];
        gameState.players[player].position = nearestUtility;
        movePlayer(0); // Trigger effects of the new position
    }

    if (card.name.includes("Advance to the nearest railroad")) {
        console.log(`Player ${player} advances to the nearest railroad.`);
        const railroads = [5, 15, 25, 35];
        const currentPosition = gameState.players[player].position;
        const nearestRailroad = railroads.find(pos => pos > currentPosition) || railroads[0];
        gameState.players[player].position = nearestRailroad;
        movePlayer(0); // Trigger effects of the new position
    }

    if (card.name.includes("Pay each player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} pays $${amount} to each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(player, amount);
                addMoney(i, amount);
            }
        }
    }

    if (card.name.includes("Collect from every player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} collects $${amount} from each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(i, amount);
                addMoney(player, amount);
            }
        }
    }
}

function drawCommunityChestCard(player) {
    const card = gameState.communityChestCards.shift(); // Draw the top card
    gameState.communityChestCards.push(card); // Put it back at the bottom of the deck
    console.log(`Player ${player} drew a Community Chest card: ${card.name}`);

    // Apply the card's effects
    if (card.price > 0) {
        console.log(`Player ${player} receives $${card.price}.`);
        addMoney(player, card.price); // Add money to the player
    } else if (card.price < 0) {
        console.log(`Player ${player} pays $${Math.abs(card.price)}.`);
        payMoney(player, Math.abs(card.price)); // Deduct money from the player
    }

    if (card.position !== null) {
        console.log(`Player ${player} moves to position ${card.position}.`);
        gameState.players[player].position = card.position; // Update player's position
        movePlayer(0); // Trigger effects of the new position
    }

    if (card.name.includes("Get out of Jail Free")) {
        console.log(`Player ${player} receives a "Get Out of Jail Free" card.`);
        gameState.players[player].getOutOfJailFree = true; // Add a flag for the card
    }

    if (card.name.includes("Pay each player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} pays $${amount} to each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(player, amount);
                addMoney(i, amount);
            }
        }
    }

    if (card.name.includes("Collect from every player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} collects $${amount} from each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(i, amount);
                addMoney(player, amount);
            }
        }
    }
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
        <p class="timer">Decide In: <span id="action-timer">30</span> seconds</p>
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
            if (timerElement) timerElement.textContent = ` ${timeLeft}s`; // Update the timer display
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
    const property = propertyData.find(p => p.position === position);
    if (!property) {
        console.error(`Property data for position ${position} is undefined.`);
        return;
    }

    console.log(`Auction started for property at position ${position}: ${property.name}`);

    const dialogArea = document.getElementById('dialog-area');
    if (!dialogArea) {
        console.error('Dialog area not found.');
        return;
    }

    // Clear any existing dialog
    dialogArea.innerHTML = '';

    // Create the auction dialog
    const auctionDialog = document.createElement('div');
    auctionDialog.className = 'property-dialog';
    auctionDialog.innerHTML = `
        <h3>Auction: ${property.name}</h3>
        <p>Starting Price: $${property.price}</p>
        <div id="auction-bids">Highest Bid: $0</div>
        <p>Select a player to place a bid:</p>
        <div class="timer-area">
            <div class="timer" id="action-timer">Auction ends in: 30s</div>
        </div>
    `;
    dialogArea.appendChild(auctionDialog);

    // Initialize auction state
    gameState.auction = {
        property: position,
        highestBid: 0,
        highestBidder: null,
        activePlayers: Object.keys(gameState.players).filter(
            player => !gameState.players[player].isBankrupt
        )
    };

    // Add click event listeners to player funds
    gameState.auction.activePlayers.forEach(player => {
        const playerFundsElement = document.getElementById(`player${player}-funds`);
        if (playerFundsElement) {
            playerFundsElement.style.cursor = 'pointer';
            playerFundsElement.onclick = () => selectBidder(player);
        }
    });

    // Start the auction timer
    startActionTimer(() => {
        console.log('Auction timer reached 0. Ending the auction automatically.');
        endAuction(position);
    });
}

function selectBidder(player) {
    const auction = gameState.auction;
    if (!auction) {
        console.error('No active auction.');
        return;
    }

    const playerMoney = gameState.players[player].money;
    const bidAmount = prompt(`Player ${player}, enter your bid (current highest: $${auction.highestBid}):`);
    const bid = parseInt(bidAmount, 10);

    if (isNaN(bid) || bid <= auction.highestBid) {
        alert('Invalid bid. Your bid must be higher than the current highest bid.');
        return;
    }

    if (bid > playerMoney) {
        alert('You do not have enough money to place this bid.');
        return;
    }

    auction.highestBid = bid;
    auction.highestBidder = player;

    const auctionBids = document.getElementById('auction-bids');
    if (auctionBids) {
        auctionBids.innerHTML = `Highest Bid: $${auction.highestBid} by Player ${auction.highestBidder}`;
    }

    console.log(`Player ${player} placed a bid of $${bid} for ${propertyData[auction.property].name}`);
}

function endAuction(position) {
    const auction = gameState.auction;
    if (!auction || auction.property !== position) {
        console.error('No active auction for this property.');
        return;
    }

    const dialogArea = document.getElementById('dialog-area');
    if (dialogArea) {
        dialogArea.innerHTML = ''; // Clear the auction dialog
    }

    // Remove click event listeners from player funds
    auction.activePlayers.forEach(player => {
        const playerFundsElement = document.getElementById(`player${player}-funds`);
        if (playerFundsElement) {
            playerFundsElement.style.cursor = 'default';
            playerFundsElement.onclick = null;
        }
    });

    if (auction.highestBidder) {
        const winner = auction.highestBidder;
        const bidAmount = auction.highestBid;

        // Deduct money and assign property
        addMoney(winner, -bidAmount);
        propertyData[position].owner = winner;

        console.log(`Player ${winner} won the auction for ${propertyData[position].name} with a bid of $${bidAmount}`);
        alert(`Player ${winner} won the auction for ${propertyData[position].name} with a bid of $${bidAmount}`);
    } else {
        console.log('No bids were placed. The property remains unowned.');
        alert('No bids were placed. The property remains unowned.');
    }

    // Clear auction state
    gameState.auction = null;

    // End the turn
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

function payRent(position) {
    const property = propertyData.find(p => p.position === position);
    const currentPlayer = gameState.currentPlayer;

    if (!property || !property.owner || property.owner === currentPlayer) {
        console.error(`Invalid property or no rent to pay for position ${position}.`);
        return;
    }

    const rent = property.rent;
    const owner = property.owner;

    if (gameState.players[currentPlayer].money >= rent) {
        console.log(`Player ${currentPlayer} pays $${rent} in rent to Player ${owner}.`);
        payMoney(currentPlayer, rent);
        addMoney(owner, rent);
    } else {
        console.log(`Player ${currentPlayer} cannot afford the rent of $${rent}.`);
        handleBankruptcy(currentPlayer);
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

    // Find the next active player
    do {
        gameState.currentPlayer = (gameState.currentPlayer % 4) + 1;
    } while (gameState.players[gameState.currentPlayer].isBankrupt);

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

function handleBankruptcy(player) {
    console.log(`Player ${player} is bankrupt!`);

    // Remove ownership of all properties owned by the bankrupt player
    propertyData.forEach(property => {
        if (property.owner === player) {
            property.owner = null;
            console.log(`Property "${property.name}" is now unowned.`);
        }
    });

    // Set the player's money to 0
    gameState.players[player].money = 0;

    // Mark the player as bankrupt and remove them from the game
    gameState.players[player].isBankrupt = true;

    // Notify other players
    alert(`Player ${player} is bankrupt and has been removed from the game!`);

    // Skip the bankrupt player's turn
    endTurn();
}

