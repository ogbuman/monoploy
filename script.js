// Dice Rolling Logic
let rollTimer; // Timer for the 30-second countdown to roll the dice
let rollCount = 0; // Track the number of consecutive rolls in a turn
let hasRolled = false; // Track if the player has already rolled in their turn

function rollDice() {
    if (hasRolled) {
        console.log(`Player ${gameState.currentPlayer} has already rolled. They can manage properties or wait for their turn to end.`);
        return; // Prevent rolling again unless allowed
    }

    hasRolled = true; // Mark that the player has rolled
    updateRollButtonState(); // Update the roll button state
    // clearTimeout(rollTimer); 
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

        console.log(`Player ${gameState.currentPlayer} rolled ${roll1} and ${roll2}.`);

        if (gameState.players[gameState.currentPlayer].inJail) {
            handleJailRoll(roll1, roll2);
        } else {
            handleRegularRoll(roll1, roll2);
        }
    }, 1000);
}

function handleRegularRoll(roll1, roll2) {
    const totalRoll = roll1 + roll2;
    movePlayer(totalRoll); // Move the player based on the dice roll

    if (roll1 === roll2) {
        rollCount++;
        console.log(`Player ${gameState.currentPlayer} rolled doubles! Roll count: ${rollCount}`);

        if (rollCount === 3) {
            console.log(`Player ${gameState.currentPlayer} rolled doubles three times in a row. Sent to Jail for speeding.`);
            sendToJail(gameState.currentPlayer);
            rollCount = 0; // Reset roll count
            endTurn(); // End the turn
        } else {
            console.log(`Player ${gameState.currentPlayer} gets to roll again.`);
            hasRolled = false; // Allow the player to roll again
            updateRollButtonState(); // Update the roll button state
            startRollTimer(); // Restart the timer for the next roll
        }
    } else {
        rollCount = 0; // Reset roll count if no doubles
        console.log(`Player ${gameState.currentPlayer} has finished rolling. They can now manage properties or wait for their turn to end.`);
    }
}

function handleJailRoll(roll1, roll2) {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    if (roll1 === roll2) {
        console.log(`Player ${gameState.currentPlayer} rolled doubles and is released from Jail.`);
        currentPlayer.inJail = false;
        currentPlayer.jailTurns = 0;
        movePlayer(roll1 + roll2); // Move forward based on the dice roll
        hasRolled = true; // End the turn after moving

        // Clear the Jail options dialog
        const dialogArea = document.getElementById('dialog-area');
        if (dialogArea) dialogArea.innerHTML = '';
        enableGameControls()
    } else {
        currentPlayer.jailTurns++;
        console.log(`Player ${gameState.currentPlayer} did not roll doubles. Jail turn count: ${currentPlayer.jailTurns}`);

          // Clear the Jail options dialog
          const dialogArea = document.getElementById('dialog-area');
          if (dialogArea) dialogArea.innerHTML = '';
          enableGameControls()


        if (currentPlayer.jailTurns >= 3) {
            console.log(`Player ${gameState.currentPlayer} has been in Jail for 3 turns. Paying $50 to get out.`);
            payMoney(gameState.currentPlayer, 50);
            currentPlayer.inJail = false;
            currentPlayer.jailTurns = 0;
            movePlayer(roll1 + roll2); // Move forward after paying the fine

            // Clear the Jail options dialog
            const dialogArea = document.getElementById('dialog-area');
            if (dialogArea) dialogArea.innerHTML = '';
        }
    }

    enableGameControls(); // Re-enable game controls after the decision
    // endTurn(); 
}

function startRollTimer(remainingTime = 20) {
    clearTimeout(rollTimer); // Clear any existing timer
    let timeLeft = remainingTime; // Use the provided remaining time
    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.onclick = () => {
            clearTimeout(rollTimer); // Clear the timer when the player clicks the timer
            console.log(`Player ${gameState.currentPlayer} manually ended their turn.`);
            endTurn();
        };
    }

    rollTimer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            if (timerElement) timerElement.textContent = `Ends in: ${timeLeft}s`; // Update the timer display
        } else {
            clearInterval(rollTimer); // Clear the timer when it reaches 0
            console.log(`Player ${gameState.currentPlayer}'s turn has ended automatically.`);
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
    { position: 1, name: "Mediterranean Avenue", type: "property", price: 60, rent: 2, color: "brown", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 50, hotelCost: 50, loanableAmount: 30, rentOneHouse: 10, rentTwoHouses: 30, rentThreeHouses: 90, rentHotel: 160 },
    { position: 2, name: "Community Chest", type: "community-chest" },
    { position: 3, name: "Baltic Avenue", type: "property", price: 60, rent: 4, color: "brown", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 50, hotelCost: 50, loanableAmount: 30, rentOneHouse: 20, rentTwoHouses: 60, rentThreeHouses: 180, rentHotel: 320 },
    { position: 4, name: "Income Tax", type: "tax", amount: 200 },
    { position: 5, name: "Reading Railroad", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null, mortgaged: false, loanableAmount: 100 },
    { position: 6, name: "Oriental Avenue", type: "property", price: 100, rent: 6, color: "light-blue", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 50, hotelCost: 50, loanableAmount: 50, rentOneHouse: 30, rentTwoHouses: 90, rentThreeHouses: 270, rentHotel: 400 },
    { position: 7, name: "Chance", type: "chance" },
    { position: 8, name: "Vermont Avenue", type: "property", price: 100, rent: 6, color: "light-blue", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 50, hotelCost: 50, loanableAmount: 50, rentOneHouse: 30, rentTwoHouses: 90, rentThreeHouses: 270, rentHotel: 400 },
    { position: 9, name: "Connecticut Avenue", type: "property", price: 120, rent: 8, color: "light-blue", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 50, hotelCost: 50, loanableAmount: 60, rentOneHouse: 40, rentTwoHouses: 100, rentThreeHouses: 300, rentHotel: 450 },
    { position: 10, name: "Jail", type: "jail" },
    { position: 11, name: "St. Charles Place", type: "property", price: 140, rent: 10, color: "pink", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 100, hotelCost: 100, loanableAmount: 70, rentOneHouse: 50, rentTwoHouses: 150, rentThreeHouses: 450, rentHotel: 625 },
    { position: 12, name: "Electric Company", type: "utility", price: 150, rent: 4, color: "utility", owner: null, mortgaged: false, loanableAmount: 75 },
    { position: 13, name: "States Avenue", type: "property", price: 140, rent: 10, color: "pink", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 100, hotelCost: 100, loanableAmount: 70, rentOneHouse: 50, rentTwoHouses: 150, rentThreeHouses: 450, rentHotel: 625 },
    { position: 14, name: "Virginia Avenue", type: "property", price: 160, rent: 12, color: "pink", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 100, hotelCost: 100, loanableAmount: 80, rentOneHouse: 60, rentTwoHouses: 180, rentThreeHouses: 500, rentHotel: 700 },
    { position: 15, name: "Pennsylvania Railroad", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null, mortgaged: false, loanableAmount: 100 },
    { position: 16, name: "St. James Place", type: "property", price: 180, rent: 14, color: "orange", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 100, hotelCost: 100, loanableAmount: 90, rentOneHouse: 70, rentTwoHouses: 200, rentThreeHouses: 550, rentHotel: 750 },
    { position: 17, name: "Community Chest", type: "community-chest" },
    { position: 18, name: "Tennessee Avenue", type: "property", price: 180, rent: 14, color: "orange", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 100, hotelCost: 100, loanableAmount: 90, rentOneHouse: 70, rentTwoHouses: 200, rentThreeHouses: 550, rentHotel: 750 },
    { position: 19, name: "New York Avenue", type: "property", price: 200, rent: 16, color: "orange", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 100, hotelCost: 100, loanableAmount: 100, rentOneHouse: 80, rentTwoHouses: 220, rentThreeHouses: 600, rentHotel: 800 },
    { position: 20, name: "Free Parking", type: "free-parking" },
    { position: 21, name: "Kentucky Avenue", type: "property", price: 220, rent: 18, color: "red", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 150, hotelCost: 150, loanableAmount: 110, rentOneHouse: 90, rentTwoHouses: 250, rentThreeHouses: 700, rentHotel: 875 },
    { position: 22, name: "Chance", type: "chance" },
    { position: 23, name: "Indiana Avenue", type: "property", price: 220, rent: 18, color: "red", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 150, hotelCost: 150, loanableAmount: 110, rentOneHouse: 90, rentTwoHouses: 250, rentThreeHouses: 700, rentHotel: 875 },
    { position: 24, name: "Illinois Avenue", type: "property", price: 240, rent: 20, color: "red", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 150, hotelCost: 150, loanableAmount: 120, rentOneHouse: 100, rentTwoHouses: 300, rentThreeHouses: 750, rentHotel: 925 },
    { position: 25, name: "B. & O. Railroad", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null, mortgaged: false, loanableAmount: 100 },
    { position: 26, name: "Atlantic Avenue", type: "property", price: 260, rent: 22, color: "yellow", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 150, hotelCost: 150, loanableAmount: 130, rentOneHouse: 110, rentTwoHouses: 330, rentThreeHouses: 800, rentHotel: 975 },
    { position: 27, name: "Ventnor Avenue", type: "property", price: 260, rent: 22, color: "yellow", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 150, hotelCost: 150, loanableAmount: 130, rentOneHouse: 110, rentTwoHouses: 330, rentThreeHouses: 800, rentHotel: 975 },
    { position: 28, name: "Water Works", type: "utility", price: 150, rent: 4, color: "utility", owner: null, mortgaged: false, loanableAmount: 75 },
    { position: 29, name: "Marvin Gardens", type: "property", price: 280, rent: 24, color: "yellow", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 150, hotelCost: 150, loanableAmount: 140, rentOneHouse: 120, rentTwoHouses: 360, rentThreeHouses: 850, rentHotel: 1025 },
    { position: 30, name: "Go To Jail", type: "go-to-jail" },
    { position: 31, name: "Pacific Avenue", type: "property", price: 300, rent: 26, color: "green", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 200, hotelCost: 200, loanableAmount: 150, rentOneHouse: 130, rentTwoHouses: 390, rentThreeHouses: 900, rentHotel: 1100 },
    { position: 32, name: "North Carolina Avenue", type: "property", price: 300, rent: 26, color: "green", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 200, hotelCost: 200, loanableAmount: 150, rentOneHouse: 130, rentTwoHouses: 390, rentThreeHouses: 900, rentHotel: 1100 },
    { position: 33, name: "Community Chest", type: "community-chest" },
    { position: 34, name: "Pennsylvania Avenue", type: "property", price: 320, rent: 28, color: "green", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 200, hotelCost: 200, loanableAmount: 160, rentOneHouse: 150, rentTwoHouses: 450, rentThreeHouses: 1000, rentHotel: 1200 },
    { position: 35, name: "Short Line", type: "railroad", price: 200, rent: 25, color: "railroad", owner: null, mortgaged: false, loanableAmount: 100 },
    { position: 36, name: "Park Place", type: "property", price: 350, rent: 35, color: "blue", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 200, hotelCost: 200, loanableAmount: 175, rentOneHouse: 175, rentTwoHouses: 500, rentThreeHouses: 1100, rentHotel: 1300 },
    { position: 37, name: "Luxury Tax", type: "tax", amount: 100 },
    { position: 38, name: "Boardwalk", type: "property", price: 400, rent: 50, color: "blue", owner: null, mortgaged: false, houses: 0, hasHotel: false, houseCost: 200, hotelCost: 200, loanableAmount: 200, rentOneHouse: 200, rentTwoHouses: 600, rentThreeHouses: 1400, rentHotel: 1700 },
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
}

function drawChanceCard(player) {
    const card = gameState.chanceCards.shift(); // Draw the top card
    gameState.chanceCards.push(card); // Put it back at the bottom of the deck
    console.log(`Player ${player} drew a Chance card: ${card.name}`);

    // Display the card content in the chance-card div
    const chanceCardElement = document.querySelector('.chance-card');
    if (chanceCardElement) {
        chanceCardElement.textContent = card.name;
    }

    // Apply the card's effects
    if (card.price > 0) {
        console.log(`Player ${player} receives $${card.price}.`);
        addMoney(player, card.price); // Add money to the player
    } else if (card.price < 0) {
        console.log(`Player ${player} needs to pay $${Math.abs(card.price)}.`);
        payMoney(player, Math.abs(card.price)); // Use updated payMoney logic
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
                payMoney(player, amount, i); // Pass the creditor (other players)
                addMoney(i, amount);
            }
        }
    }
    if (card.name.includes("Go to Jail")) {
        console.log(`Player ${player} is sent to Jail by a Chance card.`);
        sendToJail(player); // Apply the Jail feature
    }

    if (card.name.includes("Collect from every player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} collects $${amount} from each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(i, amount, player); // Pass the creditor (current player)
                addMoney(player, amount);
            }
        }
    }
}

function drawCommunityChestCard(player) {
    const card = gameState.communityChestCards.shift(); // Draw the top card
    gameState.communityChestCards.push(card); // Put it back at the bottom of the deck
    console.log(`Player ${player} drew a Community Chest card: ${card.name}`);

    // Display the card content in the community-chest-card div
    const communityChestCardElement = document.querySelector('.community-chest-card');
    if (communityChestCardElement) {
        communityChestCardElement.textContent = card.name;
    }

    // Apply the card's effects
    if (card.price > 0) {
        console.log(`Player ${player} receives $${card.price}.`);
        addMoney(player, card.price); // Add money to the player
    } else if (card.price < 0) {
        console.log(`Player ${player} needs to pay $${Math.abs(card.price)}.`);
        payMoney(player, Math.abs(card.price)); // Use updated payMoney logic
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

    if (card.name.includes("Go to Jail")) {
        console.log(`Player ${player} is sent to Jail by a Community Chest card.`);
        sendToJail(player); // Apply the Jail feature
    }

    if (card.name.includes("Pay each player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} pays $${amount} to each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(player, amount, i); // Pass the creditor (other players)
                addMoney(i, amount);
            }
        }
    }

    if (card.name.includes("Collect from every player")) {
        const amount = Math.abs(card.price);
        console.log(`Player ${player} collects $${amount} from each other player.`);
        for (let i = 1; i <= 4; i++) {
            if (i !== player) {
                payMoney(i, amount, player); // Pass the creditor (current player)
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

    // Disable game controls while the dialog is active
    disableGameControls();

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
        <p class="timer">Decide In: <span id="action-timer">60</span> seconds</p>
    `;
    dialogArea.appendChild(dialog);

    // Start the 30-second countdown
    startActionTimer(() => {
        console.log(`No action taken for property "${property.name}". Moving to the next player's turn.`);
        dialogArea.innerHTML = ''; // Clear the dialog
        enableGameControls(); // Re-enable game controls
        endTurn(); // Automatically end the turn
    });
}

function startActionTimer(callback, timerId = 'action-timer') {
    clearTimeout(actionTimer); // Clear any existing timer
    let timeLeft = 20; // Set the countdown time
    const timerElement = document.getElementById(timerId);

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
    const property = propertyData.find(p => p.position === position);
    const player = gameState.currentPlayer;

    if (!property) {
        console.error(`Property at position ${position} not found.`);
        return;
    }

    if (property.owner) {
        alert(`${property.name} is already owned.`);
        return;
    }

    console.log(`Player ${player} needs $${property.price} to buy ${property.name}.`);
    payMoney(player, property.price); // Use updated payMoney logic

    // Check if the player is bankrupt after attempting to pay
    if (gameState.players[player].isBankrupt) {
        console.log(`Player ${player} could not afford ${property.name} and is bankrupt. Starting auction.`);
        startAuction(position); // Start auction for the property
        return; // Exit the function to prevent assigning ownership
    }

    if (gameState.players[player].money >= 0 && !property.owner) {
        property.owner = player;
        updatePropertiesDisplay();

        console.log(`Property "${property.name}" purchased by Player ${player}`);
        alert(`Player ${player} purchased ${property.name} for $${property.price}.`);

        // Remove the dialog
        const dialog = document.querySelector('.property-dialog');
        if (dialog) dialog.remove();

        enableGameControls(); // Re-enable game controls
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

    // Disable other features during the auction
    disableGameControls();

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

        // Update property display to reflect ownership
        const space = document.querySelector(`[data-position="${position}"]`);
        if (space) {
            let ownershipMarker = space.querySelector('.ownership-marker');
            if (!ownershipMarker) {
                ownershipMarker = document.createElement('div');
                ownershipMarker.className = 'ownership-marker';
                space.appendChild(ownershipMarker);
            }
            ownershipMarker.style.backgroundColor = getPlayerColor(winner);
        }

        updatePropertiesDisplay(); // Ensure the correct color and ownership are applied
    } else {
        console.log('No bids were placed. The property remains unowned.');
        alert('No bids were placed. The property remains unowned.');

        // Mark the property as unowned and unmortgage it
        const property = propertyData.find(p => p.position === position);
        if (property) {
            property.owner = null;
            property.mortgaged = false; // Ensure the property is not mortgaged
        }

        updatePropertiesDisplay(); // Update the UI to reflect the unowned state
    }

    // Clear auction state
    gameState.auction = null;

    // Re-enable game controls after the auction
    enableGameControls();

    // Trigger the auction end callback if it exists
    if (gameState.auctionEndCallback) {
        const callback = gameState.auctionEndCallback;
        gameState.auctionEndCallback = null; // Clear the callback
        callback(); // Execute the callback
    }
}

function updatePropertiesDisplay() {
    propertyData.forEach(property => {
        const space = document.querySelector(`[data-position="${property.position}"]`);
        if (space) {
            let ownershipMarker = space.querySelector('.ownership-marker');
            if (!ownershipMarker) {
                ownershipMarker = document.createElement('div');
                ownershipMarker.className = 'ownership-marker';
                space.appendChild(ownershipMarker);
            }

            if (property.owner) {
                ownershipMarker.style.backgroundColor = getPlayerColor(property.owner);
              
                // Add or remove the 'mortgaged' class based on the property's state
                if (property.mortgaged) {
                    space.classList.add('mortgaged');
                } else {
                    space.classList.remove('mortgaged');
                }

                ownershipMarker.onclick = property.mortgaged ? () => unmortgageProperty(property.position) : null;
            } else {
                ownershipMarker.style.backgroundColor = 'transparent';
                ownershipMarker.textContent = '';
                ownershipMarker.onclick = null;

                // Ensure the 'mortgaged' class is removed if the property is unowned
                space.classList.remove('mortgaged');
            }

            // Update building icons
            let buildingIcons = space.querySelector('.building-icons');
            if (!buildingIcons) {
                buildingIcons = document.createElement('div');
                buildingIcons.className = 'building-icons';
                space.appendChild(buildingIcons);
            }
            buildingIcons.innerHTML = ''; // Clear existing icons

            if (property.hasHotel) {
                const hotelIcon = document.createElement('div');
                hotelIcon.className = 'hotel-icon';
                buildingIcons.appendChild(hotelIcon);
            } else {
                for (let i = 0; i < property.houses; i++) {
                    const houseIcon = document.createElement('div');
                    houseIcon.className = 'house-icon';
                    buildingIcons.appendChild(houseIcon);
                }
            }
        }
    });
}

// Money Management
function addMoney(player, amount) {
    gameState.players[player].money += Number(amount); // Ensure amount is a number
    updateFundsDisplay();
}

function payMoney(player, amount, creditor = null) {
    amount = Number(amount); // Ensure amount is a number

    if (isNaN(amount) || amount <= 0) {
        console.error(`Invalid payment amount: ${amount}. Payment aborted.`);
        return; // Exit the function if the amount is invalid
    }

    if (gameState.players[player].money >= amount) {
        addMoney(player, -amount);
        if (creditor !== null) {
            addMoney(creditor, amount);
            console.log(`Player ${player} pays $${amount} to Player ${creditor}.`);
        }
    } else {
        console.log(`Player ${player} only has $${gameState.players[player].money} and cannot afford to pay $${amount}. Attempting to raise funds...`);
        if (attemptToRaiseFunds(player, amount)) {
            console.log(`Player ${player} successfully raised enough funds to pay $${amount}.`);
            payMoney(player, amount, creditor); // Retry payment after raising funds
        } else {
            console.log(`Player ${player} could not raise enough funds. Declaring bankruptcy.`);
            handleBankruptcy(player);

            // If the player is bankrupt, ensure their properties are auctioned
            propertyData.forEach(property => {
                if (property.owner === player) {
                    property.owner = null; // Remove ownership
                    startAuction(property.position); // Start auction for the property
                }
            });
        }
    }
}

function attemptToRaiseFunds(player, amountNeeded) {
    const currentPlayer = gameState.players[player];

    // Helper function to sell a hotel
    const sellHotel = () => {
        for (const property of propertyData) {
            if (property.owner === player && property.hasHotel) {
                const hotelValue = property.hotelCost / 2;
                console.log(`Selling hotel on ${property.name} for $${hotelValue}.`);
                property.hasHotel = false;
                property.houses = 4; // Convert hotel back to 4 houses
                addMoney(player, hotelValue);
                return true;
            }
        }
        return false;
    };

    // Helper function to sell a house
    const sellHouse = () => {
        const colorGroups = propertyData.reduce((groups, property) => {
            if (property.owner === player && property.houses > 0) {
                if (!groups[property.color]) groups[property.color] = [];
                groups[property.color].push(property);
            }
            return groups;
        }, {});

        for (const group of Object.values(colorGroups)) {
            const maxHouses = Math.max(...group.map(p => p.houses));
            for (const property of group) {
                if (property.houses === maxHouses) {
                    const houseValue = property.houseCost / 2;
                    console.log(`Selling house on ${property.name} for $${houseValue}.`);
                    property.houses--;
                    addMoney(player, houseValue);
                    return true;
                }
            }
        }
        return false;
    };

    // Helper function to mortgage a property
    const mortgageProperty = () => {
        for (const property of propertyData) {
            if (property.owner === player && !property.mortgaged && property.houses === 0 && !property.hasHotel) {
                console.log(`Mortgaging ${property.name} for $${property.loanableAmount}.`);
                property.mortgaged = true;
                addMoney(player, property.loanableAmount);
                updatePropertiesDisplay(); // Update the UI to reflect the mortgaged state
                return true;
            }
        }
        return false;
    };

    // Attempt to raise funds until the player has enough money or no more assets
    while (currentPlayer.money < amountNeeded) {
        if (sellHotel()) continue;
        if (sellHouse()) continue;
        if (mortgageProperty()) continue;

        // If no more assets can be converted to money, return false
        return false;
    }

    // If enough funds are raised, return true
    return true;
}

function calculateRent(property) {
    if (!property) return 0;

    // Check if the property is part of a color group
    if (property.type === "property") {
        const colorGroup = propertyData.filter(p => p.color === property.color && p.type === "property");
        const owner = property.owner;

        // Check if the owner owns all properties in the color group
        const ownsAllGroup = colorGroup.every(p => p.owner === owner);

        if (ownsAllGroup && property.houses === 0 && !property.hasHotel) {
            // Double rent for unimproved properties in a complete color group
            return property.rent * 2;
        }
    }

    // Calculate rent based on houses or hotel
    if (property.houses === 1) return property.rentOneHouse;
    if (property.houses === 2) return property.rentTwoHouses;
    if (property.houses === 3) return property.rentThreeHouses;
    if (property.houses === 4) return property.rentFourHouses; // Ensure rent for 4 houses is handled
    if (property.hasHotel) return property.rentHotel; // Properly calculate rent for hotels

    // Default rent for unimproved properties
    return property.rent;
}

function payRent(position) {
    const property = propertyData.find(p => p.position === position);
    const currentPlayer = gameState.currentPlayer;

    if (!property || !property.owner || property.owner === currentPlayer || property.mortgaged) {
        if (property.mortgaged) {
            console.log(`Player ${currentPlayer} landed on "${property.name}", but it is mortgaged. No rent is paid.`);
        }
        return;
    }

    // Ensure the owner is not bankrupt
    if (gameState.players[property.owner].isBankrupt) {
        console.log(`Player ${currentPlayer} landed on "${property.name}", but the owner (Player ${property.owner}) is bankrupt. No rent is paid.`);
        return;
    }

    const rent = calculateRent(property);
    const owner = property.owner;

    console.log(`Player ${currentPlayer} owes $${rent} in rent to Player ${owner}.`);
    payMoney(currentPlayer, rent, owner); // Use updated payMoney logic
}

function mortgageProperty(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property || property.owner !== gameState.currentPlayer) {
        alert('You can only mortgage properties you own.');
        return;
    }

    if (property.houses > 0 || property.hasHotel) {
        alert('You must sell all buildings on this property before mortgaging it.');
        return;
    }

    if (property.mortgaged) {
        alert(`${property.name} is already mortgaged.`);
        return;
    }

    property.mortgaged = true;
    addMoney(gameState.currentPlayer, property.loanableAmount);
    alert(`${property.name} has been mortgaged for $${property.loanableAmount}.`);
    updatePropertiesDisplay();
}

function unmortgageProperty(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property || property.owner !== gameState.currentPlayer) {
        alert('You can only unmortgage properties you own.');
        return;
    }

    if (!property.mortgaged) {
        alert(`${property.name} is not mortgaged.`);
        return;
    }

    const unmortgageCost = Math.ceil(property.loanableAmount * 1.1); // 10% interest
    if (gameState.players[gameState.currentPlayer].money < unmortgageCost) {
        alert(`You do not have enough money to unmortgage ${property.name}. It costs $${unmortgageCost}.`);
        return;
    }

    property.mortgaged = false;
    payMoney(gameState.currentPlayer, unmortgageCost);
    alert(`${property.name} has been unmortgaged for $${unmortgageCost}.`);
    updatePropertiesDisplay();
}

function handleMortgagedPropertyPurchase(position, buyer) {
    const property = propertyData.find(p => p.position === position);
    if (!property || !property.mortgaged) {
        alert('This property is not mortgaged.');
        return;
    }

    const interest = Math.ceil(property.loanableAmount * 0.1); // 10% interest
    const totalCost = property.loanableAmount + interest;

    const liftMortgage = confirm(`This property is mortgaged. Do you want to lift the mortgage immediately? It will cost $${totalCost}.`);

    if (liftMortgage) {
        if (gameState.players[buyer].money >= totalCost) {
            payMoney(buyer, totalCost);
            property.mortgaged = false;
            alert(`${property.name} has been unmortgaged by Player ${buyer}.`);
        } else {
            alert(`Player ${buyer} does not have enough money to lift the mortgage.`);
        }
    } else {
        if (gameState.players[buyer].money >= interest) {
            payMoney(buyer, interest);
            alert(`Player ${buyer} has paid the interest of $${interest}. The property remains mortgaged.`);
        } else {
            alert(`Player ${buyer} does not have enough money to pay the interest.`);
        }
    }

    property.owner = buyer;
    updatePropertiesDisplay();
}

// Jail System
function sendToJail(player) {
    const currentPlayer = gameState.players[player];
    currentPlayer.inJail = true;
    currentPlayer.jailTurns = 0; // Reset jail turn count
    currentPlayer.position = 10; // Move directly to Jail

    // Update the player's token position to the Jail space
    const jailSpace = document.querySelector('[data-position="10"]');
    const token = document.querySelector(`.player-token.player-${player}`);
    if (jailSpace && token) {
        jailSpace.appendChild(token);
        token.style.display = "block"; // Ensure the token is visible
    }

    console.log(`Player ${player} is sent to Jail.`);
    updateTurnDisplay();
    
}

function showJailOptions(player) {
    const dialogArea = document.getElementById('dialog-area');
    if (!dialogArea) {
        console.error('Dialog area not found.');
        return;
    }

    // Clear any existing dialog
    dialogArea.innerHTML = '';

    // Create the Jail options dialog
    const currentPlayer = gameState.players[player];
    const hasGetOutOfJailCard = currentPlayer.getOutOfJailFree;

    const dialog = document.createElement('div');
    dialog.className = 'jail-options-dialog';
    dialog.innerHTML = `
        <h3>Player ${player} is in Jail</h3>
        <p>Choose an option to get out of Jail:</p>
        ${hasGetOutOfJailCard ? `<button onclick="useGetOutOfJailCard(${player})">Use Get Out of Jail Free Card</button>` : ''}
        <button onclick="payJailFine(${player})">Pay $50 Fine</button>
        <button onclick="rollDice()">Try Rolling Doubles</button>
        <p class="timer">Decide In: <span id="jail-action-timer">20</span> seconds</p>
    `;
    dialogArea.appendChild(dialog);

    // Start the decision timer
    startActionTimer(() => {
        console.log(`Player ${player} did not make a decision in time. Ending their turn.`);
        resetDialog(); // Clear the dialog
        // endTurn(); // Automatically end the turn
        enableGameControls(); // Re-enable game controls
    }, 'jail-action-timer');
}

function useGetOutOfJailCard(player) {
    const currentPlayer = gameState.players[player];
    if (currentPlayer.getOutOfJailFree) {
        console.log(`Player ${player} used a GET OUT OF JAIL FREE card.`);
        currentPlayer.getOutOfJailFree = false;
        currentPlayer.inJail = false;
        currentPlayer.jailTurns = 0;

        // Clear the Jail options dialog
        const dialogArea = document.getElementById('dialog-area');
        if (dialogArea) dialogArea.innerHTML = '';

        enableGameControls(); // Re-enable game controls
        updateTurnDisplay();
    } else {
        alert('You do not have a GET OUT OF JAIL FREE card.');
    }
}

function payJailFine(player) {
    const currentPlayer = gameState.players[player];
    const fineAmount = 50;

    console.log(`Player ${player} needs to pay $${fineAmount} to get out of Jail.`);
    payMoney(player, fineAmount); // Use updated payMoney logic

    if (gameState.players[player].money >= 0) { // Ensure the player has enough money after paying
        currentPlayer.inJail = false;
        currentPlayer.jailTurns = 0;

        console.log(`Player ${player} paid the fine and is released from Jail.`);

        // Clear the Jail options dialog
        const dialogArea = document.getElementById('dialog-area');
        if (dialogArea) dialogArea.innerHTML = '';

        enableGameControls(); // Re-enable game controls
        updateTurnDisplay(); // Update the UI to reflect the player's status
    } else {
        console.log(`Player ${player} could not pay the fine. Remaining in Jail.`);
    }
}

// Turn Management
function endTurn() {
    console.log(`Ending Player ${gameState.currentPlayer}'s turn.`);
    hasRolled = false; // Reset the roll status for the next player
    rollCount = 0; // Reset the roll count
    updateRollButtonState(); // Update the roll button state

    // Clear any active dialog
    resetDialog();

    // Find the next active player
    do {
        gameState.currentPlayer = (gameState.currentPlayer % 4) + 1;
    } while (gameState.players[gameState.currentPlayer].isBankrupt);

    updateTurnDisplay(); // Update the UI to show the current player's turn
    console.log(`It's now Player ${gameState.currentPlayer}'s turn.`);

    // Check for a winner
    checkForWinner();

    // Start the next turn if no winner
    if (Object.keys(gameState.players).filter(player => !gameState.players[player].isBankrupt).length > 1) {
        startTurn();
    }
}

function resetDialog() {
    const dialogArea = document.getElementById('dialog-area');
    if (dialogArea) {
        dialogArea.innerHTML = ''; // Clear the dialog content
    }
}

function startTurn() {
    const currentPlayer = gameState.currentPlayer;
    const playerState = gameState.players[currentPlayer];

    if (playerState.inJail) {
        console.log(`Player ${currentPlayer} is in Jail. Showing Jail options.`);
        disableGameControls()
        showJailOptions(currentPlayer);
    } else {
        console.log(`Player ${currentPlayer}'s turn. They are not in Jail.`);
        startRollTimer(); // Start the roll timer for the player's turn
    }
}

// UI Updates
function updateFundsDisplay() {
    for (let i = 1; i <= 4; i++) { // Ensure all 4 players are updated
        const fundsElement = document.getElementById(`player${i}-funds`);
        if (fundsElement) {
            fundsElement.style.display = "block"; // Ensure visibility
            const colorIndicator = fundsElement.querySelector('.player-color-indicator');
            if (!colorIndicator) {
                // Add the color indicator if it doesn't exist
                const indicator = document.createElement('span');
                indicator.className = 'player-color-indicator';
                fundsElement.prepend(indicator);
            }

            // Update the color and text
            const playerState = gameState.players[i];
            if (playerState.isBankrupt) {
                fundsElement.style.color = 'grey'; // Dim the text
                fundsElement.style.opacity = '0.5'; // Dim the entire element
                colorIndicator.style.backgroundColor = 'grey'; // Dim the color indicator
            } else {
                fundsElement.style.color = 'black'; // Reset text color
                fundsElement.style.opacity = '1'; // Reset opacity
                colorIndicator.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--color-player-${i}`);
            }

            fundsElement.lastChild.textContent = `Player ${i}: $${playerState.money}`; // Update text
        } else {
            console.error(`Funds element for Player ${i} not found.`);
        }
    }
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
    const validPlayer = Number(player); // Convert to a number
    switch (validPlayer) {
        case 1: return 'var(--color-player-1)'; // Blue
        case 2: return 'var(--color-player-2)'; // Green
        case 3: return 'var(--color-player-3)'; // Yellow
        case 4: return 'var(--color-player-4)'; // Purple
        default:
            console.error(`Invalid player number: ${player}`);
            return 'transparent';
    }
}

// Add the missing `updateRollButtonState` function
function updateRollButtonState() {
    const rollButton = document.querySelector('.control-panel button');
    if (rollButton) {
        rollButton.disabled = hasRolled; // Disable the button if the player has rolled
    }
}

function handleBankruptcy(player) {
    console.log(`Player ${player} is bankrupt!`);

    const creditor = gameState.players[player].creditor; // Determine the creditor (another player or the Bank)
    const auctionQueue = []; // Queue for properties to be auctioned

    // Handle buildings: Sell them back to the Bank for half their cost
    propertyData.forEach(property => {
        if (property.owner === player) {
            if (property.houses > 0 || property.hasHotel) {
                const buildingValue = property.hasHotel
                    ? property.hotelCost / 2
                    : property.houses * (property.houseCost / 2);
                console.log(`Selling buildings on ${property.name} for $${buildingValue}.`);
                addMoney(player, buildingValue);
                property.houses = 0;
                property.hasHotel = false;
            }
        }
    });

    // Handle mortgaged and non-mortgaged properties
    propertyData.forEach(property => {
        if (property.owner === player) {
            if (property.mortgaged) {
                const interest = Math.ceil(property.loanableAmount * 0.1); // 10% interest
                if (creditor && !gameState.players[creditor].isBankrupt) {
                    console.log(`Transferring mortgaged property ${property.name} to Player ${creditor}.`);
                    property.owner = creditor;
                    payMoney(creditor, interest, null); // Creditor pays the interest
                } else {
                    console.log(`Adding mortgaged property ${property.name} to auction queue.`);
                    property.owner = null; // Bank takes ownership
                    auctionQueue.push(property.position); // Add to auction queue
                }
            } else {
                if (creditor && !gameState.players[creditor].isBankrupt) {
                    console.log(`Transferring property ${property.name} to Player ${creditor}.`);
                    property.owner = creditor;
                } else {
                    console.log(`Adding property ${property.name} to auction queue.`);
                    property.owner = null; // Bank takes ownership
                    auctionQueue.push(property.position); // Add to auction queue
                }
            }
        }
    });

    // Remove the bankrupt player's token from the board
    const token = document.querySelector(`.player-token.player-${player}`);
    if (token) {
        token.remove();
    }

    // Mark the player as bankrupt and remove them from the game
    gameState.players[player].money = 0;
    gameState.players[player].isBankrupt = true;

    console.log(`Player ${player} has been removed from the game.`);
    alert(`Player ${player} is bankrupt and has been removed from the game!`);

    // Start the auction process for queued properties
    if (auctionQueue.length > 0) {
        console.log(`Starting auction for properties: ${auctionQueue}`);
        startAuctionQueue(auctionQueue);
    } else {
        // End the turn and move to the next player if no properties to auction
        endTurn();
    }
}

function startAuctionQueue(auctionQueue) {
    if (auctionQueue.length === 0) {
        console.log("Auction queue is empty. Ending turn.");
        endTurn();
        return;
    }

    const propertyPosition = auctionQueue.shift(); // Get the next property in the queue
    console.log(`Starting auction for property at position ${propertyPosition}.`);
    startAuction(propertyPosition);

    // After the auction ends, continue with the next property in the queue
    const auctionEndCallback = () => {
        console.log(`Auction for property at position ${propertyPosition} completed.`);
        startAuctionQueue(auctionQueue); // Start the next auction
    };

    // Attach the callback to the auction end logic
    gameState.auctionEndCallback = auctionEndCallback;
}

function manageProperties() {
    const currentPlayer = gameState.currentPlayer;
    const playerProperties = propertyData.filter(property => property.owner === currentPlayer);

    if (playerProperties.length === 0) {
        alert(`Player ${currentPlayer} has no properties to manage.`);
        return;
    }

    const dialogArea = document.getElementById('dialog-area');
    if (!dialogArea) {
        console.error('Dialog area not found.');
        return;
    }

    // Clear any existing dialog
    dialogArea.innerHTML = '';

    // Create the property management dialog
    const dialog = document.createElement('div');
    dialog.className = 'property-management-dialog';
    dialog.innerHTML = `
        <h3>Manage Properties</h3>
        <ul>
            ${playerProperties.map(property => `
                <li>
                    ${property.name} (${property.color})
                    <button onclick="toggleMortgageProperty(${property.position})">
                        ${property.mortgaged ? 'Unmortgage' : 'Mortgage'}
                    </button>
                    <button onclick="buildHouse(${property.position})">Build House</button>
                    <button onclick="sellHouse(${property.position})">Sell House</button>
                    <button onclick="offerProperty(${property.position})">Offer to Player</button>
                </li>
            `).join('')}
        </ul>
        <h4>Make an Offer</h4>
        <label for="offer-property">Property to Buy:</label>
        <select id="offer-property">
            ${propertyData.filter(property => property.owner && property.owner !== currentPlayer).map(property => `
                <option value="${property.position}">${property.name} (Player ${property.owner})</option>
            `).join('')}
        </select>
        <label for="offer-price">Offer Price:</label>
        <input type="number" id="offer-price" min="1" />
        <button onclick="makeOffer()">Make Offer</button>
        <button onclick="closeDialog()">Close</button>
    `;
    dialogArea.appendChild(dialog);
}

function toggleMortgageProperty(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property || property.owner !== gameState.currentPlayer) {
        alert('You can only manage properties you own.');
        return;
    }

    if (property.houses > 0 || property.hasHotel) {
        alert('You cannot mortgage a property with buildings on it.');
        return;
    }

    if (property.mortgaged) {
        const unmortgageCost = Math.ceil(property.loanableAmount * 1.1); // 10% interest
        if (gameState.players[gameState.currentPlayer].money < unmortgageCost) {
            alert(`You do not have enough money to unmortgage ${property.name}. It costs $${unmortgageCost}.`);
            return;
        }

        property.mortgaged = false;
        payMoney(gameState.currentPlayer, unmortgageCost);
        alert(`${property.name} has been unmortgaged for $${unmortgageCost}.`);
    } else {
        property.mortgaged = true;
        addMoney(gameState.currentPlayer, property.loanableAmount);
        alert(`${property.name} has been mortgaged for $${property.loanableAmount}.`);
    }

    updatePropertiesDisplay();
    manageProperties();
}

function buildHouse(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property || property.owner !== gameState.currentPlayer) {
        alert('You can only build houses on properties you own.');
        return;
    }

    if (property.mortgaged) {
        alert('You cannot build houses on a mortgaged property.');
        return;
    }

    const colorGroup = propertyData.filter(p => p.color === property.color && p.type === 'property');
    const ownsAllGroup = colorGroup.every(p => p.owner === gameState.currentPlayer);

    if (!ownsAllGroup) {
        alert('You must own all properties in the color group to build houses.');
        return;
    }

    const minHouses = Math.min(...colorGroup.map(p => p.houses));
    if (property.houses > minHouses) {
        alert('You must build evenly across all properties in the color group.');
        return;
    }

    if (property.houses === 4) {
        if (property.hasHotel) {
            alert('This property already has a hotel.');
            return;
        }

        const allHaveFourHouses = colorGroup.every(p => p.houses === 4);
        if (!allHaveFourHouses) {
            alert('All properties in the color group must have four houses before building a hotel.');
            return;
        }

        const hotelCost = property.hotelCost;
        if (gameState.players[gameState.currentPlayer].money < hotelCost) {
            alert(`You do not have enough money to build a hotel on ${property.name}. It costs $${hotelCost}.`);
            return;
        }

        // Exchange four houses for a hotel
        property.houses = 0;
        property.hasHotel = true;
        payMoney(gameState.currentPlayer, hotelCost);
        alert(`A hotel has been built on ${property.name} for $${hotelCost}.`);
    } else {
        const houseCost = property.houseCost;
        if (gameState.players[gameState.currentPlayer].money < houseCost) {
            alert(`You do not have enough money to build a house on ${property.name}. It costs $${houseCost}.`);
            return;
        }

        property.houses++;
        payMoney(gameState.currentPlayer, houseCost);
        alert(`A house has been built on ${property.name} for $${houseCost}.`);
    }

    updatePropertiesDisplay();
    manageProperties();
    // Do not end the turn here
}

function sellHouse(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property || property.owner !== gameState.currentPlayer) {
        alert('You can only sell houses on properties you own.');
        return;
    }

    const colorGroup = propertyData.filter(p => p.color === property.color && p.type === 'property');
    const maxHouses = Math.max(...colorGroup.map(p => p.houses));

    if (property.hasHotel) {
        // Selling a hotel converts it back to 4 houses
        property.hasHotel = false;
        property.houses = 4;
        addMoney(gameState.currentPlayer, property.hotelCost / 2);
        alert(`The hotel on ${property.name} has been sold for $${property.hotelCost / 2}.`);
    } else if (property.houses > 0) {
        if (property.houses < maxHouses) {
            alert('You must sell houses evenly across all properties in the color group.');
            return;
        }

        property.houses--;
        addMoney(gameState.currentPlayer, property.houseCost / 2);
        alert(`A house on ${property.name} has been sold for $${property.houseCost / 2}.`);
    } else {
        alert('There are no houses or hotels to sell on this property.');
        return;
    }

    updatePropertiesDisplay();
    manageProperties();
}

function offerProperty(position) {
    const property = propertyData.find(p => p.position === position);
    if (!property || property.owner !== gameState.currentPlayer) {
        alert('You can only offer properties you own.');
        return;
    }

    // Check if the property is part of a color group with buildings
    if (property.type === 'property') {
        const colorGroup = propertyData.filter(p => p.color === property.color && p.type === 'property');
        const hasBuildings = colorGroup.some(p => p.houses > 0 || p.hasHotel);
        if (hasBuildings) {
            alert('You cannot sell this property because there are buildings on properties in this color group.');
            return;
        }
    }

    const price = prompt(`Enter the price to offer ${property.name}:`);
    if (!price || isNaN(price) || price <= 0) {
        alert('Invalid price.');
        return;
    }

    const dialogArea = document.getElementById('dialog-area');
    if (!dialogArea) {
        console.error('Dialog area not found.');
        return;
    }

    // Clear any existing dialog
    dialogArea.innerHTML = '';

    // Create the offer dialog
    const dialog = document.createElement('div');
    dialog.className = 'offer-dialog';
    dialog.innerHTML = `
        <h3>Offer ${property.name} for $${price}</h3>
        <ul>
            ${Object.keys(gameState.players).filter(player => player != gameState.currentPlayer).map(player => `
                <li>
                    Player ${player}
                    <button onclick="sendOffer(${position}, ${player}, ${price})">Send Offer</button>
                </li>
            `).join('')}
        </ul>
        <button onclick="closeDialog()">Close</button>
    `;
    dialogArea.appendChild(dialog);
}

function sendOffer(position, player, price) {
    price = Number(price); // Ensure price is a number
    const property = propertyData.find(p => p.position === position);
    if (!property) {
        alert('Invalid property.');
        return;
    }

    const accept = confirm(`Player ${player}, do you accept the offer to buy ${property.name} for $${price}?`);
    if (accept) {
        if (gameState.players[player].money >= price) {
            property.owner = player;
            addMoney(gameState.currentPlayer, price);
            payMoney(player, price);
            alert(`Player ${player} bought ${property.name} for $${price}.`);
            updatePropertiesDisplay();
            closeDialog();
        } else {
            alert(`Player ${player} does not have enough money.`);
        }
    } else {
        alert(`Player ${player} declined the offer.`);
    }
}

function makeOffer() {
    const propertyPosition = document.getElementById('offer-property').value;
    const price = Number(document.getElementById('offer-price').value); // Ensure price is a number

    if (!propertyPosition || isNaN(price) || price <= 0) {
        alert('Invalid offer. Please select a property and enter a valid price.');
        return;
    }

    const property = propertyData.find(p => p.position == propertyPosition);
    if (!property) {
        alert('Invalid property selected.');
        return;
    }

    const seller = property.owner;
    const buyer = gameState.currentPlayer;

    if (!seller || seller === buyer) {
        alert('You cannot make an offer for this property.');
        return;
    }

    const accept = confirm(`Player ${seller}, do you accept the offer to sell ${property.name} for $${price}?`);
    if (accept) {
        if (gameState.players[buyer].money >= price) {
            // Transfer ownership and update funds
            property.owner = buyer;
            payMoney(buyer, price);
            addMoney(seller, price);

            alert(`Player ${buyer} successfully purchased ${property.name} from Player ${seller} for $${price}.`);
            updatePropertiesDisplay();
            closeDialog();
        } else {
            alert(`Player ${buyer} does not have enough money to complete this purchase.`);
        }
    } else {
        alert(`Player ${seller} declined the offer.`);
    }
}

function closeDialog() {
    const dialogArea = document.getElementById('dialog-area');
    if (dialogArea) {
        dialogArea.innerHTML = ''; // Clear the dialog
    }

    // Re-enable game controls when the dialog is closed
    enableGameControls();
}

function disableGameControls() {
    // Disable the "Roll" button
    const rollButton = document.querySelector('.control-panel button[onclick="rollDice()"]');
    if (rollButton) rollButton.disabled = true;

    // Disable the "Manage Properties" button
    const managePropertiesButton = document.querySelector('.control-panel button[onclick="manageProperties()"]');
    if (managePropertiesButton) managePropertiesButton.disabled = true;

    // Disable the "End Turn" button
    const endTurnButton = document.getElementById('end-turn-button');
    if (endTurnButton) {
        endTurnButton.disabled = true;
        // endTurnButton.onclick = null; 
    }

    // Pause the roll timer
    clearTimeout(rollTimer);
}

function enableGameControls() {
    // Enable the "Roll" button
    const rollButton = document.querySelector('.control-panel button[onclick="rollDice()"]');
    if (rollButton) {
        rollButton.disabled = hasRolled; // Disable the button if the player has already rolled
        rollButton.classList.toggle('disabled', hasRolled); // Add or remove the 'disabled' class
    }

    // Enable the "Manage Properties" button
    const managePropertiesButton = document.querySelector('.control-panel button[onclick="manageProperties()"]');
    if (managePropertiesButton) managePropertiesButton.disabled = false;

    // Enable the "End Turn" button
    const endTurnButton = document.getElementById('end-turn-button');
    if (endTurnButton) endTurnButton.disabled = false;

    // Restart the roll timer with the remaining time
    const timerElement = document.getElementById('timer');
    let remainingTime = 20; // Default to 20 seconds if no timer element is found
    if (timerElement && timerElement.textContent.includes('Ends in:')) {
        const match = timerElement.textContent.match(/\d+/); // Extract the remaining time
        if (match) remainingTime = parseInt(match[0], 10);
    }
    startRollTimer(remainingTime); // Pass the remaining time to the timer
}

// Initialize the game and add the "End Turn" button
initGame();
updateFundsDisplay();
updateTurnDisplay();
startRollTimer();

function checkForWinner() {
    const activePlayers = Object.keys(gameState.players).filter(player => !gameState.players[player].isBankrupt);

    if (activePlayers.length === 1) {
        const winner = activePlayers[0];
        console.log(`Player ${winner} is the last player remaining and wins the game!`);
        alert(`Player ${winner} wins the game! Congratulations!`);

        // End the game
        endGame(winner);
    }
}

function endGame(winner) {
    // Disable all game controls
    disableGameControls();

    // Display a winning message
    const dialogArea = document.getElementById('dialog-area');
    if (dialogArea) {
        dialogArea.innerHTML = `
            <h2>Game Over</h2>
            <p>Player ${winner} is the winner!</p>
        `;
    }

    // Optionally, reset the game or reload the page
    console.log("Game has ended. Reload the page to start a new game.");
}
  
// Modify `endTurn` to check for a winner after each turn
function endTurn() {
    console.log(`Ending Player ${gameState.currentPlayer}'s turn.`);
    hasRolled = false; // Reset the roll status for the next player
    rollCount = 0; // Reset the roll count
    updateRollButtonState(); // Update the roll button state

    // Clear any active dialog
    resetDialog();

    // Find the next active player
    do {
        gameState.currentPlayer = (gameState.currentPlayer % 4) + 1;
    } while (gameState.players[gameState.currentPlayer].isBankrupt);

    updateTurnDisplay(); // Update the UI to show the current player's turn
    console.log(`It's now Player ${gameState.currentPlayer}'s turn.`);

    // Check for a winner
    checkForWinner();

    // Start the next turn if no winner
    if (Object.keys(gameState.players).filter(player => !gameState.players[player].isBankrupt).length > 1) {
        startTurn();
    }
}

function handleRentPayment(player, rent, creditor) {
    console.log(`Player ${player} cannot afford the rent of $${rent}. Attempting to raise funds...`);

    const currentPlayer = gameState.players[player];
    let remainingRent = rent;

    // Helper function to pay incrementally
    const payIncrementally = (amount) => {
        const payment = Math.min(amount, remainingRent);
        addMoney(creditor, payment);
        remainingRent -= payment;
        console.log(`Player ${player} paid $${payment} to Player ${creditor}. Remaining rent: $${remainingRent}`);
    };

    // Helper function to sell a hotel
    const sellHotel = () => {
        for (const property of propertyData) {
            if (property.owner === player && property.hasHotel) {
                const hotelValue = property.hotelCost / 2;
                console.log(`Selling hotel on ${property.name} for $${hotelValue}.`);
                property.hasHotel = false;
                property.houses = 4; // Convert hotel back to 4 houses
                addMoney(player, hotelValue);
                console.log(`Player ${player} raised $${hotelValue} by selling a hotel.`);
                payIncrementally(hotelValue);
                return true;
            }
        }
        return false;
    };

    // Helper function to sell a house
    const sellHouse = () => {
        const colorGroups = propertyData.reduce((groups, property) => {
            if (property.owner === player && property.houses > 0) {
                if (!groups[property.color]) groups[property.color] = [];
                groups[property.color].push(property);
            }
            return groups;
        }, {});

        for (const group of Object.values(colorGroups)) {
            const maxHouses = Math.max(...group.map(p => p.houses));
            for (const property of group) {
                if (property.houses === maxHouses) {
                    const houseValue = property.houseCost / 2;
                    console.log(`Selling house on ${property.name} for $${houseValue}.`);
                    property.houses--;
                    addMoney(player, houseValue);
                    console.log(`Player ${player} raised $${houseValue} by selling a house.`);
                    payIncrementally(houseValue);
                    return true;
                }
            }
        }
        return false;
    };

    // Helper function to mortgage a property
    const mortgageProperty = () => {
        for (const property of propertyData) {
            if (property.owner === player && !property.mortgaged && property.houses === 0 && !property.hasHotel) {
                console.log(`Mortgaging ${property.name} for $${property.loanableAmount}.`);
                property.mortgaged = true;
                addMoney(player, property.loanableAmount);
                console.log(`Player ${player} raised $${property.loanableAmount} by mortgaging a property.`);
                payIncrementally(property.loanableAmount);
                return true;
            }
        }
        return false;
    };

    // Attempt to raise funds incrementally
    while (remainingRent > 0) {
        if (sellHotel()) continue;
        if (sellHouse()) continue;
        if (mortgageProperty()) continue;

        console.log(`Player ${player} cannot raise enough funds to pay the rent. Declaring bankruptcy.`);
        handleBankruptcy(player);
        return;
    }

    // If enough funds are raised, confirm the rent is fully paid
    console.log(`Player ${player} has successfully paid the rent of $${rent} to Player ${creditor}.`);
}