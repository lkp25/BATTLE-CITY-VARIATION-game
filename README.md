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



//03.03.2021 
- optimized missle/tank boundaries, 
- fixed no-collision bug when tanks were charging on one another(one would slide under the other), 
- set map to be sligtly bigger, tanks size is exactly 1/13 of the map size now. 
- Added bounce effect on tanks collision.

//04.03.2021 
- created factory function for generating wall-obstacles (crimson square).
- added wall-tank collision detection - tanks can not move through walls
- added missle-wall hit detection - when missle hits the wall, wall disappears.

- fixed major performance issue by clearing amassing intervals(every time a missle
was shot - there was an interval set to run and never stop, even after the missle was removed from game area and it was no longer needed as a movement function for this particular missle)

//05.03.2021 
- optimized tanks' movement speed 
- perfected tank-obstacle collision detection, added strict block-movement functionality
when tank triaes to run through the obstacle with movement being unlocked after the obstacle is destroyed.

//06.03.2021
- fixed a bug related to strange movent after colliding with obstacle - if after collision player was pressing movement keys fast, tank was being teleported to the other side of the obstacle (very weird-looking behavior, not very common but annoying nevertheless). Collision detecting method was changed and implemented in the movement function directly like for player - player collision. 
Previously it was being called directly by Main Executor Interval, now is a dependency of movement function.

//07.03.2021
- started works on enemy AI. basic movement interval function added and a factory function for mass-creating enemy tanks.

//08.03.2021
- created AI map boundaries detection - AI tanks never leave the game area
- created and perfected (AI tank//AI tank) collision detection - when enemies bump on each other, they move away in opposite directions. 

//09.03.2021
- added player vs enemy collision detection(both ways).
- increased randomization of enemy movement - previously when tanks were colliding with each other or any player, they only performed GO-BACK action. now they randomly decide to go left or right or back. 
Same thing was also added for map egdes - tanks randomly decide where to go, previously it was hard coded.
- added a VERY PRIMITIVE obstacle detection logic for enemy AI

//10.03.2021
- AI-tanks obstacle detection tested thoroughly, many issues were found.
after many unsatisfactory trials finally decent solution that works every time was applied.
- added obstacle detection function for player1 - four nearest obstacles blink constantly.
- fixed issue with obstacles being duplicated (2 or more on the exact same position on the map, stacked on one another) - it resulted with missles appearing as 'not working' the first time it hit the obstacle while in fact they were - simply there was a couple of  obstacles on the exact same position. Number of duplicates was approximately 30% of all obstacles generated when generating 200-400. Needed to be fixed.

- added a function that tracks the position of player one and makes all enemy tanks follow it instead of complete randomness in movement. Will be used later to determine main goal of enemy tanks.

- added nice graphics for player tanks and brick obstacles, self made.

//11.03.2021
- corrected positioning of missles to match new tank styling and new size of missle (more missle-like, not perfectly round)
- created simple lightweight gif-animation for player tank movement. Added another graphic design for enemy tanks.
