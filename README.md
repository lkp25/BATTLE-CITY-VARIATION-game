This is a simple game aspiring to be famous Battle City's clone, yet a bit different.

This is a working prototype. Changes might occur later.

For now: 
1. There is a square map with two 'Tanks' - red (player 1) and blue - (player 2)


2. CONTROLS:

Player 1
up - arrow up
down - arrow down
left - arrow left
right - arrow right
FIRE - 'P' key

Player 2
up - w
down - s
left - a
right - d
FIRE - 'Q' key

3. The goal is to destroy the other player's tank by shooting to it. Each time a tank gets hit,
it loses 10% of "life" which is opacity. After 10 hits it disappears and game is over - 
winner is logged in the console.

//03.03.2021 - optimized missle/tank boundaries, fixed no-collision bug when tanks were charging on
one another(one would slide under the other), set map to be sligtly bigger, 
tanks size is exactly 1/13 of the map size now. 
Added bounce effect on tanks collision.