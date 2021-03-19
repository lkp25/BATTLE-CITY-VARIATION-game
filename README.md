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
- added enemy-spawn monitoring function - if the spot where they spawn is currently occupied by already existing tank, a setTimeout is returned with recursion - after one second new tank will try to generate again if spawn is free. Players are not allowed to drive into the spawn - they will stop in front of it if they try. 

- created setFire function to be used when tank gets hit - it will start burning (flame animation appended to tank)

//12.03.2021
- optimized setFire function to only set fire in certain positions. 
- prettyfied the missle appearance
- added working logic for enemy-shot missles (set correct direction, speed, interval clearance)
- added enemy missle vs obstacle interaction - when obstacle is hit, it disappears
- added enemy missle vs player interaction - when player gets hit, his life is lowered
- added player missle vs enemy interaction - enemy disappears when it gets hit, all Intervals attached to THIS SPECIFIC enemy are also cleared (very important for performance as well as gameplay - if only enemy was removed from the DOM, interval was still running 'ghost enemy' which was shooting missles!)
- added side panel with stats: timer "how long can you hold" which will be main goal of the game, and also lifebars, ammo and frags counters for both players. Hard coded for now for styling purposes, functionality needs to be added.
tank icon is also being displayed next to player name. If his life is very low, icon will start rotating.

//13.03.2021
- added timer object with functionality. 
- added level changing logic that refreshes obstacles on the map every x minutes/seconds - thus generating 'new level'
- added logic to count current number of enemies and obstacles on the map - no more than x enemies and y obstacles can be present at the same time
- resolved issue with 'ghost shooting missles' - after enemy was destroyed one more missle was being generated at his death position. Not any more.

//15.03.2021 PERFORMANCE CHECKS
- resolving performance issue - replaced all getBoundingClientRect() with offsetLeft & offsetTop - huge performance boost.
- established references for Enemy.getAllEnemies() and Obstacle.getAllObstacles() in the main executor interval - now only there these methods are called, and a reference variable is used to serve produced arrays to intervals in movement and create missle functions. 
Up to this point preformance was increased 4 times, but it is still too low. 
App works smooth with 7 enemies running and around 320 obstacles generated. 
With 8 enemies FPS drops below acceptable.

------ replacing complex .reduce() call in enemy movement function with a for-loop with finish-early-if-condition met solution, game was running smoothly even if 15 enemies were alive at the same time ------- UNFORTUNATELY this change resulted in other critical error - browser was quickly out of memory for unnknown reason and caused everything to freeze.
After returning to reduce, problem is gone, but performance is still less than enough.

- changed player movement function to return instantly if no arrow is pressed. 
- added complete functionality for different obstacles - trees dont interact with tanks, water stops movement but not missles, rocks stop movement and missles but they don't disappear like brick walls.
- removed player missle vs player intercation - players fight enemies, not each other

17.03,2021
- further performance adjustments - created 'static' array containing positions of all obstacles after they are generated. tanks now refer to this instead of the one generated in interval every 20ms. 
- forest obstacles are removed from the obstacles array right before game starts - less obstacles to iterate. in create missle function, missle first checks if iterated obstacle is of class water. if so, it skips to the next iteration saving time.
- added many 'return' conditions to finish early function execution so it does not perfor unnecessary action after certain condition is met (for example if missle hits obstacle, it will return without further checking if it also hit enemy)
- added tank explosion animation and sound effect when enemy gets hit by player missle.
- the game has now decent performance with 12 enemy Tanks moving at one time.

18.03.2021
- MAJOR PERFORMANCE CHANGES to find loops responsible for scanning tanks vs obstacle collisions and missle vs obstacle hits - current position of tank and missle (offsetTo and offsetLeft) is now cached in let variable in every interval cycle (at the beginning) and then used throughout the 'find' loop, so only two DOM style requests are being made per interval cycle instead of two per every loop iteration inside each interval cycle - this resulted in performance being raise DRASTICALLY. Now 20 enemies can run the map in one time and the game runs smoothly. Main performance goal achieved.
- refactored some repeatable code in shooting missles functionality - dressed it up in a function and applied function calls.
- refactored the entire player movement functions - merged two separate functions for player 1 and player 2 into one with parameters and conditional checks.

19.03.2021
reversed movement function changes - separated again into two functions, it proven to be interfering with another players movement, too complex...