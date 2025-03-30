// Example player movement logic
function movePlayer(player, diceRoll) {
    const boardSpaces = document.querySelectorAll('.space');
    const totalSpaces = boardSpaces.length;

    // Calculate new position
    player.position = (player.position + diceRoll) % totalSpaces;

    // Update player token position
    const newSpace = boardSpaces[player.position];
    const playerToken = document.querySelector(`.player-token.${player.class}`);
    newSpace.appendChild(playerToken);

    // Trigger space action (e.g., buy property, pay rent)
    handleSpaceAction(player, newSpace);
}

// Example function to handle space actions
function handleSpaceAction(player, space) {
    if (space.classList.contains('property')) {
        // Handle property logic (buy, rent, etc.)
        console.log(`${player.name} landed on a property.`);
    } else if (space.id === 'go-to-jail') {
        // Send player to jail
        console.log(`${player.name} is going to jail.`);
        sendPlayerToJail(player);
    }
    // ...other space actions...
}

// Example function to send player to jail
function sendPlayerToJail(player) {
    const jailSpace = document.querySelector('#jail');
    const playerToken = document.querySelector(`.player-token.${player.class}`);
    jailSpace.appendChild(playerToken);
    player.position = Array.from(document.querySelectorAll('.space')).indexOf(jailSpace);
}

// Example dice roll logic
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Example turn rotation
function nextTurn(players, currentPlayerIndex) {
    return (currentPlayerIndex + 1) % players.length;
}