//before the game starts:
let gameOver = true
//level background array
const levelBackground = [
    'url(./images/cosmos.png) center/cover',
    'url(./images/matrix.png) center/cover',
    'url(./images/lava.png) center/cover',
    'url(./images/woods.png) center/cover',
 'url(./images/desert.png) center/cover']

//current level 
 let currentLevel = -1
//hide scrollbars
document.body.style.overflow = 'hidden'
//explosion sound
const boom = document.getElementById('explo')

//main level changing variable
let endLevel = false
//=======================================================================
//===================MAIN VARIABLES, CREATING PLAYERS====================
//=======================================================================



const map = document.querySelector('.map')
const player1Life = document.querySelector('.player-one-lifebar')
player1Life.style.width = '100%'
const player2Life = document.querySelector('.player-two-lifebar')
player2Life.style.width = '100%'
const player1KilledDisplay = document.querySelector('.player-one-enemies-destroyed')
let player1frags = 0
const player2KilledDisplay = document.querySelector('.player-two-enemies-destroyed')
let player2frags = 0

let player1dead = false
let player2dead = false
//enemy spawn status - free/occupied
let spawnStatus
//select enemy generating button
const enemyGen = document.querySelector('.enemy-generator')
enemyGen.style.visibility = 'hidden'
//define game area
//map size
let mapHeight = 580
let mapWidth = 580

let tank1Position = {}
let tank2Position = {}


let allTankObstaclePositions

//movement of player tanks - key values:
//player one
let up = false
let down = false
let right = false
let left = false
let fire = false
let facing = 'down'
//player two
let up2 = false
let down2 = false
let right2 = false
let left2 = false
let fire2 = false
let facing2 = 'down'

//main executor constantly sets all positions, here they are just declared
let allObstaclePositions
let allEnemyPositions

//create player1 tank:  
const tank = document.createElement('div')
// .setAttribute('style', "top: 0px; left: 360px")
map.appendChild(tank)
tank.setAttribute('style', "top: 360px; left: 578px")
tank.classList.add('tank')
tank.style.opacity = 1

//create player2 tank:
const tank2 = document.createElement('div')
// .setAttribute('style', "top: 0px; left: 360px")
map.appendChild(tank2)
tank2.setAttribute('style', "top: 500px; left:578px")
tank2.classList.add('tank2')
tank2.style.opacity = 1
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//=======================================================================
//===================TIME COUNTER AND STATISTICS=========================
//=======================================================================
class Timer{
    constructor(){}
        static seconds = 0
        static minutes = 0
        static hours = 0
        
        static secondsField = document.querySelector('.seconds')
        static minutesField = document.querySelector('.minutes')
        static hoursField = document.querySelector('.hours')

        static timer = setInterval(()=>{
            this.seconds ++
            this.secondsField.innerText = this.seconds
            if(this.seconds === 60){
                this.seconds = 0
                this.secondsField.innerText = this.seconds
                this.minutes++
                this.minutesField.innerText = this.minutes
            }
            if(this.minutes === 60){
                this.minutes = 0
                this.minutesField.innerText = this.minutes
                this.hours++
                this.hoursField.innerText = this.hours
            }
            // if(this.minutes === 1 && this.seconds === 1){
            // if( this.seconds === 10){}
              
               
               
            

            //Generate new enemy every 1 second (unless spawn is occupied)
            //performs click event on a hidden button previously used for testing.
            if(!gameOver){
                enemyGen.click()
                
            }

            //logic for ending the game if both players are dead
            if(player1dead && player2dead){
                gameOver = true
                endTheGame()
            }
            
            
        },1000)
    
}


// LEVEL CHANGING INTERVAL
setInterval(() => {
    //throw out old map
 map.style.transform = `rotateX(180deg) scaleX(0) skewX(20deg)`
 //increase level counter
 currentLevel++

 //change background
 map.style.background = `${levelBackground[currentLevel]}`
 
 //REFRESH THE OBSTACLES - GENERATE NEW LEVEL
 Obstacle.generateNewLevel()
 
 //kill all old intervals
 endLevel = true
 Enemy.getAllEnemies().forEach(element =>{
     element.DOMnode.remove()
 })
 //place players in starting positions
 if(!player1dead){
     tank.style.left = '582px'
     tank.style.top = '500px'
 }
 if(!player2dead){
 tank2.style.left = '582px'
 tank2.style.top = '300px'
 }
 //reset enemy counter
 Enemy.number = 0
 spawnStatus = 'occupied'
 
 //present the new map                
 setTimeout(() => {
     map.style.transform = 'rotateX(0deg) scaleX(1) skewX(0deg)'
     endLevel = false
     spawnStatus = 'free'
     Enemy.create()
 }, 1000);
}, 180000);









//=======================================================================================
//==========================SHOOTING MISSLES -event listeners===========================
//=======================================================================================


//limit maximum number of missles for each tank on map:
//NO MORE THAN ONE MISSLE EVERY 900ms
    let missle1Num = 0
    let missle2Num = 0
    //create missle
    setInterval(() => {
        missle2Num = 0
        missle1Num = 0
        
    }, 900);    
    //player one shooting
     document.addEventListener('keydown', ((e)=> {   
         
         if(e.key === 'p' && missle1Num < 1){                 
            missle1Num ++        
            fire = true
            createMissle(tank, 1)              
                    
        }      
        else if(e.key === 'q' && missle2Num < 1){                 
            missle2Num ++        
            fire2 = true
            createMissle(tank2, 2)              
                    
        }      
          
    }))
    //player two shooting
    document.addEventListener('keyup', ((e)=> {           
    
        if(e.key === 'p'){                 
            fire = false                  
        }      
        if(e.key === 'q'){                 
            fire2 = false                  
        }      
          
    }))
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    







//=======================================================================================
//==========================SHOOTING MISSLES FUNCTIONALITY===============================
//=======================================================================================

//function used to check if player missle hit any enemy
                //function used to check if player missle hit any enemy

                //function used to check if player missle hit any enemy
                //for both player one and two!

                function checkIfEnemyWasHit(missle, allEnemyPositions, fragOf){

                    allEnemyPositions.find((enemy)=>{
                      
                        
                        if(
                            
                            missle.getBoundingClientRect().bottom >= enemy.DOMnode.getBoundingClientRect().top
                            && missle.getBoundingClientRect().top  <= enemy.DOMnode.getBoundingClientRect().bottom
                            && missle.getBoundingClientRect().left <= enemy.DOMnode.getBoundingClientRect().right
                            && missle.getBoundingClientRect().right >= enemy.DOMnode.getBoundingClientRect().left
                        
                        ){
                            //remove the obstacle and the missle if true
                            explode(enemy)
                            enemy.DOMnode.style.display = 'none'
                            enemy.DOMnode.remove()
                            missle.remove()
                            // missle = null

                            //add frag to kill- counter of respective player
                            if(fragOf === 'player1'){
                                player1frags += 1
                                player1KilledDisplay.innerText = player1frags
                                return
                            }
                            if(fragOf === 'player2'){
                                player2frags += 1
                                player2KilledDisplay.innerText = player2frags
                                return
                            }
                            return
                        } 
                    })
    
                    
                }

//function checking if player shot the obstacle
function checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater){
    allTankObstaclePositions.find((obstacle, index) =>{
        //check if obstacle was hit by missle
        if(
           !obstacle.node.classList.contains('water') 
           && missleTop + 10 >= obstacle.top
           && missleTop  <= obstacle.bottom
           && missleLeft <= obstacle.right
           && missleLeft + 6 >= obstacle.left
        
        ){
            //remove the obstacle and the missle if true
            clearInterval(performanceEater)
            missle.remove()
            if(!obstacle.node.classList.contains('rock')){

                obstacle.node.remove()
                allTankObstaclePositions.splice(index,1)
                return
            }
        } 
    })    
}



                //function for checking if player was hit by enemy
                function checkIfPlayerWasHit(which, missle, missleLeft, missleTop, position){
                        if(
                            (missleTop) <= position.top + 40
                            && (missleTop + 10) >= position.top
                            && (missleLeft) <= position.left + 40
                            && (missleLeft + 6) >= position.left
                        ){
                            missle.remove()
                            setFire(which)
                                
                            if(which === tank){
                                player1Life.style.width = `${parseInt(player1Life.style.width.slice(0, length - 1)) - 10}%`
                                
                                //check if the lifebar is empty - player dies logic:
                                if(parseInt(player1Life.style.width.slice(0, length - 1)) <= 0){
                                    player1dead = true
                                    explode(enemy = null, tank1Position)
                                    //instead of deleting the DOM node, move it outside of the visible area
                                    tank.style.top = '-1000px'
                                    //reset the position
                                    tank1Position = {}
                                    //make the tank invisible
                                    document.querySelector('.player-one-stats').style.visibility = 'hidden'
                                    //set gameover statistics
                                    document.querySelector('#p1lasted').innerText = `Lasted: ${Timer.hours}h ${Timer.minutes}min ${Timer.seconds}s`
                                    document.querySelector('#p1killed').innerText = `Killed: ${player1frags}`

                                }
                            }

                            if(which === tank2){                                    
                                player2Life.style.width = `${parseInt(player2Life.style.width.slice(0, length - 1)) - 10}%`
                                if(parseInt(player2Life.style.width.slice(0, length - 1)) <= 0){
                                    player2dead = true
                                    explode(enemy = null, tank2Position)
                                    tank2.style.top = '-1000px'
                                    tank2Position = {}
                                    document.querySelector('.player-two-stats').style.visibility = 'hidden'

                                    document.querySelector('#p2lasted').innerText = `Lasted: ${Timer.hours}h ${Timer.minutes}min ${Timer.seconds}s`
                                    document.querySelector('#p2killed').innerText = `Killed: ${player2frags}`
                                }
                            }
                                
                        }   
                }

    //MAIN SHOOTING FUNCTION
    //MAIN SHOOTING FUNCTION
    //MAIN SHOOTING FUNCTION

    function createMissle(whoIsShooting, which){
       

       if(endLevel){
           return
       }
        //CHECK WHO WAS SHOOTING:
            //ENEMY was shooting
            if(which === 'enemy'){
                
                //resolve the issue with enemy being able to shot for the last time after it was destroyed-
                //before the interval stopped create misle function was being called. now there is
                //a condition to break out of the function and not generate the last 'ghost missle'
                if(whoIsShooting.display === 'none' || endLevel){
                    return
                }
                

               


                //calculate missle position based on tank-facing position
                const enemyDirection = whoIsShooting.style.transform
                let missleDirection
                let missleFacing
                if(enemyDirection === 'rotateZ(90deg)'){
                    missleDirection = 'rotateZ(180deg)'
                    missleFacing = 'down'
                }
                else if(enemyDirection === 'rotateZ(270deg)'){
                    missleDirection = 'rotateZ(0deg)'
                    missleFacing = 'up'
                }
                else if(enemyDirection === 'rotateZ(0deg)'){
                    missleDirection = 'rotateZ(90deg) '
                    missleFacing = 'right'
                
                }else if(enemyDirection === 'rotateZ(180deg)'){
                    missleDirection = 'rotateZ(270deg) '
                    missleFacing = 'left'
                }
               
                const missle = document.createElement('div')
                missle.classList.add('missle')
                missle.style.transform = missleDirection
                //shoot a missle from tank center
                missle.style.top = parseInt(whoIsShooting.style.top.slice(0, length -2)) + 15 + 'px'
                missle.style.left = parseInt(whoIsShooting.style.left.slice(0, length -2)) + 17 + 'px'
                //missle must be appended to MAP not to tank
                map.appendChild(missle)            

                //determine current missle position and speed
                let trajectorY = parseInt(whoIsShooting.style.top.slice(0, length -2)) + 15
                let trajectorZ = parseInt(whoIsShooting.style.left.slice(0, length -2)) + 17
               





                
                //depending on the direction of shooting, check if any target was hit
                if(missleFacing === 'down'){

                    //declare interval name so it can be deleted later!
                    const shootingInterval = setInterval(() => {
                        
                        //only one offsetTop & offsetLeft DOM style request per interval cycle
                        // instead of on for every loop iteration inside the interval cycle --
                        // cache the values and use them only in this cycle.
                        let missleTop = missle.offsetTop
                        let missleLeft = missle.offsetLeft
                        
                        //NO TARGET WAS HIT
                        if(trajectorY > mapHeight + 100){
                            missle.remove()
                            // missle = null
                            clearInterval(shootingInterval)
                            return
                        }

                        //keep the missle flying
                        trajectorY += 10
                        missle.style.top = `${trajectorY}px`


                        //check if obstacle was hit by missle
                        allTankObstaclePositions.find((obstacle, index) =>{
                            if(
                                
                                //all values cached, no DOM requests inside find loop.
                                !obstacle.node.classList.contains('water')
                                && missleTop + 10 >= obstacle.top
                                && missleTop  <= obstacle.bottom
                                && missleLeft -2<= obstacle.right
                                && missleLeft +8  >= obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                clearInterval(shootingInterval)
                                missle.remove()
                                if(!obstacle.node.classList.contains('rock')){

                                    obstacle.node.remove()
                                    allTankObstaclePositions.splice(index,1)
                                    return
                                }
                            } 
                        })    
                        
                        //check if one of the players was hit
                        if(!player1dead){
                            checkIfPlayerWasHit(tank, missle, missleLeft, missleTop, tank1Position)
                        }
                        if(!player2dead){
                        checkIfPlayerWasHit(tank2, missle, missleLeft, missleTop, tank2Position)
                        }
                        //no longer needed - set to null so they can be cleared faster from memory
                        missleTop = null
                        missleLeft = null
                    }, 20);
                }



                if(missleFacing === 'up'){
                    const shootingInterval = setInterval(() => {
                        let missleTop = missle.offsetTop
                        let missleLeft = missle.offsetLeft
                        
                        if(trajectorY < -20){
                            missle.remove()
                            clearInterval(shootingInterval)
                            return
                        }


                        trajectorY -= 10
                        missle.style.top = `${trajectorY}px`


                        //check if obstacle was hit by missle
                        allTankObstaclePositions.find((obstacle, index) =>{
                            if(
                                 !obstacle.node.classList.contains('water')
                                && missleTop > obstacle.top
                                && missleTop + 10  < obstacle.bottom
                                && missleLeft - 2 < obstacle.right
                                && missleLeft + 8  > obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                clearInterval(shootingInterval)
                                missle.remove()
                                if(!obstacle.node.classList.contains('rock')){

                                    obstacle.node.remove()
                                    allTankObstaclePositions.splice(index,1)
                                    return
                                }
                            } 
                            //check if one of the players was hit
                        })    
                        if(!player1dead){
                            checkIfPlayerWasHit(tank, missle, missleLeft, missleTop, tank1Position)
                        }
                        if(!player2dead){
                        checkIfPlayerWasHit(tank2, missle, missleLeft, missleTop, tank2Position)
                        }
                        missleTop = null
                        missleLeft = null
                    }, 20);
                }
                if(missleFacing === 'left'){
                    const shootingInterval = setInterval(() => {
                        let missleTop = missle.offsetTop
                        let missleLeft = missle.offsetLeft
                        
                        if(trajectorZ < -20){
                            missle.remove()
                            clearInterval(shootingInterval)
                            return
                        }

                        trajectorZ -= 10
                        missle.style.left = `${trajectorZ}px`

                        //check if obstacle was hit by missle
                        allTankObstaclePositions.forEach((obstacle, index) =>{
                            if(
                               !obstacle.node.classList.contains('water')
                                && missleTop + 10 >= obstacle.top
                                && missleTop  <= obstacle.bottom
                                && missleLeft <= obstacle.right
                                && missleLeft + 6 >= obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                
                                clearInterval(shootingInterval)
                                missle.remove()
                                if(!obstacle.node.classList.contains('rock')){

                                    obstacle.node.remove()
                                    allTankObstaclePositions.splice(index,1)
                                    return
                                }
                            } 
                        })
                            //check if one of the players was hit
                            if(!player1dead){
                                checkIfPlayerWasHit(tank, missle, missleLeft, missleTop, tank1Position)
                            }
                            if(!player2dead){
                            checkIfPlayerWasHit(tank2, missle, missleLeft, missleTop, tank2Position)
                            }
                            missleTop = null
                            missleLeft = null
                        
                    }, 20);
                }
                if(missleFacing === 'right'){
                    const shootingInterval = setInterval(() => {
                        let missleTop = missle.offsetTop
                        let missleLeft = missle.offsetLeft
                        
                        if(trajectorZ > mapWidth + 100 ){
                            missle.remove()
                            clearInterval(shootingInterval)
                            return
                        }


                        trajectorZ += 10
                        missle.style.left = `${trajectorZ}px`

                        //check if obstacle was hit by missle
                        allTankObstaclePositions.find((obstacle, index) =>{
                            if(
                               !obstacle.node.classList.contains('water')
                                && missleTop + 10 >= obstacle.top
                                && missleTop  <= obstacle.bottom
                                && missleLeft <= obstacle.right
                                && missleLeft + 6 >= obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                clearInterval(shootingInterval)
                                missle.remove()
                                if(!obstacle.node.classList.contains('rock')){

                                    obstacle.node.remove()
                                    allTankObstaclePositions.splice(index,1)
                                    return
                                }

                            } 
                        })    
                        //check if one of the players was hit
                        if(!player1dead){
                            checkIfPlayerWasHit(tank, missle, missleLeft, missleTop, tank1Position)
                        }
                        if(!player2dead){
                        checkIfPlayerWasHit(tank2, missle, missleLeft, missleTop, tank2Position)
                        }
                        missleTop = null
                        missleLeft = null
                    }, 20);
                }
            
                
            }








//PLAYER SHOOTING section

                






            //PLAYER 1 WAS SHOOTING=============================================
            if(which === 1 && fire === true && player1dead === false){
                //calculate missle position based on tank position
                const missle = document.createElement('div')
                missle.classList.add('missle')
                //shoot a missle from tank center
                missle.style.top = parseInt(tank.style.top.slice(0, length -2)) + 15 + 'px'
                missle.style.left = parseInt(tank.style.left.slice(0, length -2)) + 17 + 'px'
                                
                //missle must be appended to MAP not to tank
                map.appendChild(missle)                
                //variable used to control the life-span of a missle
                
                let trajectorX = parseInt(whoIsShooting.style.left.slice(0, length -2)) + 17
                let trajectorY = parseInt(whoIsShooting.style.top.slice(0, length -2)) + 15



            //determine missle shooting direction and make it move
            if(facing === 'up'){

                //new interval is being called every time a missle is fired.
                //it needs to be assigned to a variable so that it can be cleared
                //when the missle disappears! otherwise it runs forever
                // feeding on the app's performance!
                let performanceEater = setInterval( ()=>{
                    //increase the value 
                    trajectorY -= 10
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                    
                    
                        //move the missle upwards by current trajector value
                        // missle.style.transform = `translateY(-${trajector}px)`
                        missle.style.top = `${trajectorY}px`

                        checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                        
                        
                            
                            //OLD FUNCTIONALITY - NOT CURRENTLY USED
                            
                            //check if other player was hit by missle - not used currently
                            // if((missle.getBoundingClientRect().top) <= tank2.getBoundingClientRect().bottom
                            // && (missle.getBoundingClientRect().left) <= tank2.getBoundingClientRect().right
                            // && (missle.getBoundingClientRect().right) >= tank2.getBoundingClientRect().left
                            // && (missle.getBoundingClientRect().bottom) >= tank2.getBoundingClientRect().top
                            // ){           
                            //     missle.remove()
                            //     tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                            //     //stop the interval from running forever
                            //     clearInterval(performanceEater)
                            // }                            
                        


                        //check if any enemy was hit
                        checkIfEnemyWasHit(missle ,allEnemyPositions, 'player1')

                        

                        //if trajector value happens to be bigger than map size,
                        //remove the missle - it hasn't hit anything
                        if(trajectorY < -10){
                            missle.remove()
                            //stop the interval from running forever
                            clearInterval(performanceEater)
                            return
                        }
                        missleTop = null
                        missleLeft = null
                }, 30)
            }
            
            
            if(facing === 'down'){
                let performanceEater = setInterval( ()=>{
                    trajectorY += 10
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                    
                
                    missle.style.transform = `rotateZ(180deg)`
                    missle.style.top = `${trajectorY}px`
                    checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                         
                    //check if any enemy was hit
                    checkIfEnemyWasHit(missle ,allEnemyPositions, 'player1')
                
                    if(trajectorY > mapHeight + 100 ){
                        missle.remove()
                        clearInterval(performanceEater)
                        return
                    }
                    missleTop = null
                        missleLeft = null
            }, 30)}


            if(facing === 'left'){
                let performanceEater = setInterval( ()=>{
                    trajectorX -= 10
                    
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                   
                
                    missle.style.transform = `rotateZ(270deg)`
                    missle.style.left = `${trajectorX}px`
                    checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                        
                      
                
                        //check if any enemy was hit
                    checkIfEnemyWasHit(missle ,allEnemyPositions, 'player1')
                
                    if(trajectorX < -10){
                        missle.remove()
                        clearInterval(performanceEater)
                        return
                    }
                    missleTop = null
                    missleLeft = null
            }, 30)}


            if(facing === 'right'){
                let performanceEater = setInterval( ()=>{
                    trajectorX += 10
                
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                    missle.style.transform = `rotateZ(90deg)`
                    missle.style.left = `${trajectorX}px`
                    checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                      
                
                    //check if any enemy was hit
                    checkIfEnemyWasHit(missle ,allEnemyPositions, 'player1')
                
                    if(trajectorX >= mapWidth + 100 ){
                        missle.remove()
                        clearInterval(performanceEater)
                        return
                    }
                    missleTop = null
                    missleLeft = null
            }, 30)}
        }








        //PLAYER 2 WAS SHOOTING=============================================
        if(which === 2 && fire2 === true && player2dead === false){
                //calculate missle position based on tank position
                const missle = document.createElement('div')
                missle.classList.add('missle')
                //shoot a missle from tank center       
               
                missle.style.top = parseInt(tank2.style.top.slice(0, length -2)) + 15 + 'px'
                missle.style.left = parseInt(tank2.style.left.slice(0, length -2)) + 17 + 'px'
               
                //missle must be appended to MAP not to tank
                map.appendChild(missle)
                let trajectorX = parseInt(whoIsShooting.style.left.slice(0, length -2)) + 17
                let trajectorY = parseInt(whoIsShooting.style.top.slice(0, length -2)) + 15
            
            


                if(facing2 === 'up'){
                let performanceEater = setInterval( ()=>{
                    trajectorY -= 10
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                    
                    
                        
                    missle.style.top = `${trajectorY}px`
                    checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                     
                    //check if any enemy was hit
                    checkIfEnemyWasHit(missle ,allEnemyPositions, 'player2')
                    
                        if(trajectorY < -10){
                            missle.remove()
                            clearInterval(performanceEater)
                            return
                        }
                        missleTop = null
                        missleLeft = null
                }, 30)
            }
            
            if(facing2 === 'down'){
                let performanceEater = setInterval( ()=>{
                trajectorY += 10
                let missleTop = missle.offsetTop
                let missleLeft = missle.offsetLeft
                
                    
                
                missle.style.transform = `rotateZ(180deg)`
                missle.style.top = `${trajectorY}px`
                       
                checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                        
                       
                
                          //check if any enemy was hit
                          checkIfEnemyWasHit(missle ,allEnemyPositions, 'player2')
                
                    if(trajectorY > mapHeight +100){
                        missle.remove()
                        clearInterval(performanceEater)
                        return
                    }
                    missleTop = null
                    missleLeft = null
            }, 30)
        }

        if(facing2 === 'left'){
            let performanceEater = setInterval( ()=>{
                    trajectorX -= 10
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                    
                    
                    
                    missle.style.transform = `rotateZ(270deg)`
                    missle.style.left = `${trajectorX}px`
                        
                    checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                    
                    checkIfEnemyWasHit(missle ,allEnemyPositions, 'player2')
                    
                    if(trajectorX < -10 ){
                        missle.remove()
                        clearInterval(performanceEater)
                        return
                    }
                    missleTop = null
                    missleLeft = null

                }, 30)
            }

            if(facing2 === 'right'){
                let performanceEater = setInterval( ()=>{
                    trajectorX += 10
                    let missleTop = missle.offsetTop
                    let missleLeft = missle.offsetLeft
                
                    missle.style.transform = `rotateZ(90deg)`
                    missle.style.left = `${trajectorX}px`
                        
                    checkIfPlayerShotObstacle(missle, missleTop, missleLeft, performanceEater)
                        

                        
                    
                    //check if any enemy was hit
                    checkIfEnemyWasHit(missle ,allEnemyPositions, 'player2')

                        if(trajectorX >= mapWidth + 100){
                            missle.remove()
                            clearInterval(performanceEater)
                            return
                        }
                        missleTop = null
                        missleLeft = null
                }, 30)
            }
        }
        
    }
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
















//=======================================================================================
//==========================EVENT LISTENERS - FOR PLAYERS' MOVEMENT======================
//=======================================================================================


//key down - TRUE
document.addEventListener('keydown', ((e) =>{
    //player 1
    if(e.key === 'ArrowDown'){
        // tank.classList.add('tank-move')
        down = true
        right = false
        up = false
        left = false
    }
    else if(e.key === 'ArrowUp'){
        // tank.classList.add('tank-move')
        up = true
        right = false
        down = false
        left = false
    }
    else if(e.key === 'ArrowRight'){
        // tank.classList.add('tank-move')
        right = true
        down = false
        up = false
        left = false
    }
    else if(e.key === 'ArrowLeft'){
        // tank.classList.add('tank-move')
        left = true
        right = false
        up = false
        down = false
    }
    //player 2
    if(e.key === 's'){
        // tank2.classList.add('tank2-move')
        down2 = true
        right2 = false
        up2 = false
        left2 = false
    }
    else if(e.key === 'w'){
        // tank2.classList.add('tank2-move')
        up2 = true
        right2 = false
        down2 = false
        left2 = false
        
    }
    else if(e.key === 'd'){
        // tank2.classList.add('tank2-move')
        right2 = true
        down2 = false
        up2 = false
        left2 = false
    }
    else if(e.key === 'a'){
        // tank2.classList.add('tank2-move')
        left2 = true
        right2 = false
        up2 = false
        down2 = false
    }
}))
//key up - change to FALSE
document.addEventListener('keyup', ((e) =>{
    //player 1
    
    
    if(e.key === 'ArrowDown'){
        down = false
    }
    else if(e.key === 'ArrowUp'){
        up = false
    }
    else if(e.key === 'ArrowRight'){
        right = false
    }
    else if(e.key === 'ArrowLeft'){
        left = false
    }
    //player 2
    if(e.key === 's'){
        down2 = false
    }
    else if(e.key === 'w'){
        up2 = false
    }
    else if(e.key === 'd'){
        right2 = false
    }
    else if(e.key === 'a'){
        left2 = false
    }
    
}))
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


























//======================================================================================
//==============================TANK MOVEMENT FUNCTIONS=================================
//======================================================================================


    function movement(){
       if(!left && !right && !up && !down){
        //    remove movement animation
        tank.classList.remove('tank-move')
        return
       }
       //add movement animation
       tank.classList.add('tank-move')
        //dont let player take position of enemy spawn

        if(tank1Position.left <= 40 && tank1Position.top <= 40){
            if(facing === 'left'){
                tank.style.left = '42px'
            }
            if(facing === 'up'){
                tank.style.top = '42px'
            }
            return
        }
        //=============VERTICAL MOVEMENT====================
        //access tank Y position on map
       
        let yPos = parseInt(tank.style.top.slice(0, length -2)) 
        //go down
        if(down){
            
           
            //set tank facing
            tank.style.transform = `rotateZ(0deg)`
            facing = 'down'
            
            //stop tank1 if it crashes tank2 from the top
            if(!(tank1Position.bottom + 2 >= tank2Position.top && tank1Position.left <= tank2Position.right && tank1Position.right >= tank2Position.left && tank1Position.top <= tank2Position.bottom)){
               
                yPos += 1
            }else{
                yPos -= 1
            }
            //Check for crash with any obstacle
            //here actually for each is necessary instead of find, 
            //tank can crash more than one obstacle at the same time
            allTankObstaclePositions.forEach(element =>{
                if
                (element.top -1<= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right >=tank1Position.left
                ){
                    yPos -= 2   
                    return}
                })
            //check for crash with AI-enemies
            allEnemyPositions.find(element =>{
            if
            (element.top -1<= tank1Position.bottom 
            &&element.bottom >=tank1Position.top 
            &&element.left <= tank1Position.right 
            &&element.right >=tank1Position.left 
            ){
                yPos -= 5   
                return}
           })
            
            
                //STOP when it reaches MAP-BOTTOM
            if(yPos >= mapHeight){  
                tank.style.top = `${mapHeight}px`
                return
            }else{  //keep going down if there is space
                tank.style.top = `${yPos}px`
                return
            }
        }
        //go up
        if(up){
           
            tank.style.transform = `rotateZ(180deg)`
            facing = 'up'

            if(!(tank1Position.top - 2 <= tank2Position.bottom && tank1Position.left <= tank2Position.right && tank1Position.right >= tank2Position.left && tank1Position.bottom > tank2Position.top)){

                yPos -= 1
            }else{
                yPos += 1
            }
            //Check for crash with any obstacle
            allTankObstaclePositions.forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom +1>=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right >=tank1Position.left 
                ){
                    yPos += 2   
                    return}
                })

                //Check for crash with enemy AI
                allEnemyPositions.find(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom +1>=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right >=tank1Position.left 
                ){
                    yPos += 5  
                    return}
                })

            if(yPos <= 0){  //STOP when it reaches MAP-TOP
                tank.style.top = `${0}px`
                return
            }else{  //keep going up if there is space
                tank.style.top = `${yPos}px`
                return
            }
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++
    
        //=============HORIZONTAL MOVEMENT===================
        //access tank X position on map
        let xPos = parseInt(tank.style.left.slice(0, length -2))
        //go left
        if(left){
           

            tank.style.transform = `rotateZ(90deg)`
            facing = 'left'

            if(!(tank1Position.left -2  <= tank2Position.right && tank1Position.bottom >= tank2Position.top && tank1Position.top <= tank2Position.bottom && tank1Position.right >= tank2Position.left) ){
                
                xPos -= 1
            }else{
                xPos += 1
            }
            
            allTankObstaclePositions.forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right +1>=tank1Position.left 
                ){
                    xPos += 2   
                    return
                }
            })

            allEnemyPositions.find(element =>{
                 if
                 (element.top <= tank1Position.bottom 
                    &&element.bottom >=tank1Position.top 
                    &&element.left <= tank1Position.right 
                    &&element.right +1>=tank1Position.left 
                 ){
                        xPos += 5
                        return   }
            })
            
            if(xPos <= 0){  //STOP when it reaches MAP-LEFT-edge
                tank.style.left = `${0}px`
                return
            }else{  //keep going left if there is space
                tank.style.left = `${xPos}px`
                return
            }
        }
        //go right
        if(right){
           
            tank.style.transform = `rotateZ(-90deg)`
            facing = 'right'

            if(!(tank1Position.right +2 >= tank2Position.left && tank1Position.bottom >= tank2Position.top && tank1Position.top <= tank2Position.bottom && tank1Position.left <= tank2Position.right)){
               
                xPos += 1
            }else{
                xPos -= 1
            }
            
            allTankObstaclePositions.forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left -1<= tank1Position.right 
                &&element.right>=tank1Position.left 
                ){
                    xPos -= 2   
                    return}
            })
            allEnemyPositions.find(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left -1<= tank1Position.right 
                &&element.right>=tank1Position.left 
                ){
                    xPos -= 5 
                    return  }
                })

            if(xPos >= mapWidth){  //STOP when it reaches MAP-RIGHT-edge
                tank.style.left = `${mapWidth}px`
                return
            }else{  //keep going right if there is space
                tank.style.left = `${xPos}px`
                return
            }
        }
    
        
    }
    








    function movement2(){
        if(!left2 && !right2 && !up2 && !down2){
            tank2.classList.remove('tank2-move')
            return
        }
        tank2.classList.add('tank2-move')
        //dont let player take position of enemy spawn
        if(tank2Position.left <= 40 && tank2Position.top <= 40){
            if(facing2 === 'left'){
                tank2.style.left = '42px'
            }
            if(facing2 === 'up'){
                tank2.style.top = '42px'
            }
            return
        }
        //=============VERTICAL MOVEMENT===================
        //access tank Y position on map
        let yPos = parseInt(tank2.style.top.slice(0, length -2)) 
        //go down
        if(down2){
            
            tank2.style.transform = `rotateZ(0deg)`
            facing2 = 'down'

            if(!(tank2Position.bottom +2 >= tank1Position.top && tank2Position.left <= tank1Position.right && tank2Position.right >= tank1Position.left && tank2Position.top <= tank1Position.bottom)){
                
                yPos += 1
            }else{
                yPos -= 1 
            }

            //Check for crash with any obstacle
            allTankObstaclePositions.forEach(element =>{
                if
                (element.top -1<= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos -= 2  
                    return }
            })
            allEnemyPositions.find(element =>{
                if
                (element.top -1<= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos -= 5 
                    return  }
            })

            if(yPos >= mapHeight){  //STOP when it reaches MAP-BOTTOM
                tank2.style.top = `${mapHeight}px`
                return
            }else{  //keep going down if there is space
                tank2.style.top = `${yPos}px`
                return
            }
        }
        //go up
        if(up2){
           
            tank2.style.transform = `rotateZ(180deg)`
            facing2 = 'up'
            if(!(tank2Position.top - 2 <= tank1Position.bottom && tank2Position.left <= tank1Position.right && tank2Position.right >= tank1Position.left && tank2Position.bottom > tank1Position.top)){
                   
                yPos -= 1
            }else{
                yPos += 1
            }

            //Check for crash with any obstacle
            allTankObstaclePositions.forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom +1>=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos += 2  
                    return }
            })
            allEnemyPositions.find(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom +1>=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos += 5  
                    return }
            })

            if(yPos <= 0){  //STOP when it reaches MAP-TOP
                tank2.style.top = `${0}px`
                return
            }else{  //keep going up if there is space
                tank2.style.top = `${yPos}px`
                return
            }
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++
    
        //=============HORIZONTAL MOVEMENT===============
        //access tank X position on map
        let xPos = parseInt(tank2.style.left.slice(0, length -2))
        //go left
        if(left2){
            
            tank2.style.transform = `rotateZ(90deg)`
            facing2 = 'left'
            if(!(tank2Position.left -2  <= tank1Position.right && tank2Position.bottom >= tank1Position.top && tank2Position.top <= tank1Position.bottom && tank2Position.right >= tank1Position.left) ){                
                xPos -= 1
            }else{
                xPos += 1
            }

            allTankObstaclePositions.forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right +1>=tank2Position.left 
                ){
                    xPos += 2   
                    return}
            })
            allEnemyPositions.find(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right +1>=tank2Position.left 
                ){
                    xPos += 5   
                    return
                }
            })

            if(xPos <= 0){  //STOP when it reaches MAP-LEFT-edge
                tank2.style.left = `${0}px`
                return
            }else{  //keep going left if there is space
                tank2.style.left = `${xPos}px`
                return
            }
        }
        //go right
        if(right2){
            
            tank2.style.transform = `rotateZ(-90deg)`
            facing2 = 'right'
            if(!(tank2Position.right +2 >= tank1Position.left && tank2Position.bottom >= tank1Position.top && tank2Position.top <= tank1Position.bottom && tank2Position.left <= tank1Position.right)){
               
                xPos += 1
            }else{
                xPos -= 1
            }

            allTankObstaclePositions.forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left -1<= tank2Position.right 
                &&element.right>=tank2Position.left 
                ){
                    xPos -= 2   
                    return}
            })
            allEnemyPositions.find(element =>{
                if
                    (element.top <= tank2Position.bottom 
                    &&element.bottom >=tank2Position.top 
                    &&element.left -1<= tank2Position.right 
                    &&element.right>=tank2Position.left 
                ){
                    xPos -= 5   
                    return}
            })
            if(xPos >= mapWidth){  //STOP when it reaches MAP-RIGHT-edge
                tank2.style.left = `${mapWidth}px`
                return
            }else{  //keep going right if there is space
                tank2.style.left = `${xPos}px`
                return
            }
        }
    
        
    }
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    





















//=======================================================================================
//===================================MOVEMENT EXECUTOR===================================
//=======================================================================================

//pass current player1 and player2 tanks position to movement function (for alive players)
setInterval(()=>{
    if(!player1dead){
        tank1Position = {
           top:tank.offsetTop,
           left: tank.offsetLeft,
           bottom: tank.offsetTop + 40,
           right: tank.offsetLeft + 40
        }
        movement()
    }
    
    if(!player2dead){
        tank2Position = {
            top:tank2.offsetTop,
            left: tank2.offsetLeft,
            bottom: tank2.offsetTop + 40,
            right: tank2.offsetLeft + 40
        }    
        movement2()
    }
    
    
    //run bonus utility function - 
    // highlightClosestObstacles()
},20)
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Separate interval for collecting all enemy tanks' positions
setInterval(() => {    
    allEnemyPositions = Enemy.getAllEnemies()
}, 30);



















//=======================================================================================
//======================THE MAIN OBSTACLE CONSTRUCTOR - =================================
//=======================================================================================
let numberOfObstacles = 500
class Obstacle{
    constructor(){
        
    }
    //counter of obstacles
    static number = 1

    //obstacle creator
    static create = function(){
        //only allow specific number of obstacles
        if(this.number > numberOfObstacles){
            
            return
        }   

        //positions available for generated obstacles
        const positionsArray = [46,69,92,115,138,161,184,207,230,253,276,299, 322,345,368,391,414,437,460,483,506,529,552,575,598,0,23]
        
        const alreadyCreated = [...document.querySelectorAll('.obstacle')]
        
        //create new  obstacle
        const obstacle = document.createElement('div')                
        const randomObstacle = Math.floor(Math.random() * 13)
        obstacle.classList.add('obstacle')

        if(randomObstacle === 0 || randomObstacle === 2){
            obstacle.classList.add('forest')
            

        }
        else if(randomObstacle === 1){

            obstacle.classList.add('rock')
        }
        
        else if(randomObstacle === 3){

            obstacle.classList.add('water')
        }
        else{

            obstacle.classList.add('brick')
        }



        //position it randomly using positionsArray
        let top = positionsArray[Math.floor(Math.random() * 27)]
        let left = positionsArray[Math.floor(Math.random() * 23)]
        
        //add an id using it's generated positions so that
        // if a duplicate occurs it will be identified
        
        obstacle.id = `t${top}l${left}`
        obstacle.setAttribute('style', `top: ${top}px; left: ${left}px`)
        // obstacle.style.top = `${top}`
        // obstacle.style.left = `${left}`
        map.appendChild(obstacle)
        
        //search the entire array of already created obstacles to check
        //if one with same position already exists. If it does - remove the duplicate.
        alreadyCreated.find((element)=>{
            if(element.id === obstacle.id){
                obstacle.remove()
            }
                
            
        })
        
                //increase obstacles counter
                this.number ++
        
    }

    //function to get all positions of all obstacles
    static getAll = function(){
        return  [...document.querySelectorAll('.obstacle')].map((element) => {
            return {
                top: element.offsetTop,
                bottom: element.offsetTop + 22,
                left: element.offsetLeft,
                right: element.offsetLeft + 22,
                node: element
                
            }

            
        })
     
        
        
    }   
    
    static closest = function(){
        return  [...document.querySelectorAll('.brick')].map(element => {
            return [
                element,
                Math.abs(element.offsetLeft - 9 - tank.offsetLeft) ** 2 + Math.abs(element.offsetTop - 9 - tank.offsetTop) ** 2
                

            ]
            // parseInt(Math.sqrt((Math.abs(element.offsetLeft+11 - tank.offsetLeft+20) *  Math.abs(element.offsetLeft + 11 - tank.offsetLeft +20))    +    (Math.abs(element.offsetTop+11 - tank.offsetTop+20) *  Math.abs(element.offsetTop + 11 - tank.offsetTop +20))))  
            
        }).sort((a, b) => {
            return a[1] - b[1]}) //returns array of all obstacles with their distance from player 1
    }
    
    //generate  random obstacles for new level
    static generateNewLevel = function(){
        //remove all current obstacles
        [...document.querySelectorAll('.obstacle')].forEach(obstacle => obstacle.remove())
        //set number to 0 so that they can regenerate in a loop
        Obstacle.number = 0
        //regenerate obstacles
        for(let x = 0; x < numberOfObstacles; x++){
            Obstacle.create()
        }
        allTankObstaclePositions = [...document.querySelectorAll('.brick'), ...document.querySelectorAll('.rock'), ...document.querySelectorAll('.water')].map((element) => {
            return {
                top: element.offsetTop,
                bottom: element.offsetTop + 22,
                left: element.offsetLeft,
                right: element.offsetLeft + 22,
                node: element
                
            }

            
        }).sort((a, b) => a.top - b.top).sort((a, b) => a.left - b.left)
        
       
    }
   
}




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

























//======================================================================================
//=========================ENEMIES AI===================================================
//======================================================================================

class Enemy{
    constructor(){}
    //current number of enemies
    static number = 0 
    
    
    
    //=======================create new enemy tank on the map.========================
    static create = function(){
        
        //check if max number of enemies was not exceeded and don't execute if true
        if(Enemy.number >= 20){
            
            return
        }   
        
        Enemy.getAllEnemies().find((element) =>{
            if(element.top <= 60 && element.left <= 60){
                
                spawnStatus = 'occupied'
                return
            }else{
                spawnStatus = 'free'                
            }
        })
        
        if(spawnStatus === 'occupied'){
            return 
        }
        
        //else create new enemy
        const enemy = document.createElement('div')
        
        //add CSS styles
        enemy.classList.add('enemy-tank')
        enemy.style.top = '0px'
        enemy.style.left = '0px'
        
        //add ID in case it is needed
        enemy.setAttribute('id', `enemy${Enemy.number}`) 
        //append it to map
        map.appendChild(enemy)
                //increase current number of enemies
                Enemy.number ++
                
                //INITIALIZE MOVENT OF THE ENEMY - passing single enemy div as an argument        
                Enemy.move(enemy)
                
                //initialize shooting interval
                Enemy.shootMissle(enemy)
                
            }
            
            
            
            //==============================================================================
            //================================== AI SHOOTING=================================
            //==============================================================================
            static shootMissle = function(whoIsShooting){
                // console.log(whoIsShooting.id, 'enemy');
                
                
                const shootingInterval = setInterval(() => {
                    //don't create a ghost-missle if enemy was just destroyed!
                    if(whoIsShooting.style.display === 'none' || endLevel){
                        
                        clearInterval(shootingInterval)
                    }else{
                        
                        createMissle(whoIsShooting, 'enemy', allEnemyPositions)
                    }
                }, 1000);
            }
            
            
            //==============================================================================
            //==================================movement AI=================================
            //==============================================================================
            static move = function(enemy){
                
                //main positioning variables: vertical and horizontal
                let upORdown = 1
                let leftORright = 1
                
                //current movement direction of enemy tank
                let enemyFacing = 'right'
                
                
                
                
                //main movement randomization interval options -
        
                
                let randomMove = 1
                
                 
                        
                        
                        
                                                // option 3: simplest random with set interval
                                                // OLD, simple, more predictable
                                                // randomMove - parameter used to change direction randomly ALLWAYS after specified time
                                                
                                                //name the interval so it can be removed if this enemy gets shot by player!!!
                                                
                                                const randomMovementGenerator = setInterval(() => {
                                                    if(enemy.style.display === 'none' || endLevel){
                                                        
                                                        clearInterval(randomMovementGenerator)
                                                    }
                                                    randomMove = Math.floor(Math.random() * 4)   
                                                }, 4000);
                                                
                                                
                                                
                                                //=========================MAIN AI MOVEMENT INTERVAL==============================
                                                //\\//\\//\\//\\//\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//\\/\/\//\/\/\/\/\\/\/\
                                                
                                                let obstacleDetection
                                                const enemyMovementInterval = setInterval(()=>{
                                                    
            // Check for crash with any obstacle
            //1 - gets positions of all obstacles
            //2- reduce checks only for obstacles tanks is currently colliding with,
            //because there could be more than one brick being hit in the same time
            //(corners, row of 2 or 3 bricks crashed from the side) - tank is double the size
            //of a single brick.
            //3 - all colliding bricks are pushed to newArr, but only FIRST ONE will be set
            //as value for obstacleDetection. rest is ignored.
            
            //CLEAR INTERVAL IF enemy is dead or level is changing
            if(endLevel){
                clearInterval(enemyMovementInterval)
                return
            }
            if(enemy.style.display === 'none'){
                clearInterval(enemyMovementInterval)
                return
            }
            let enemyLeft = enemy.offsetLeft
            let enemyTop = enemy.offsetTop
            
            
            obstacleDetection = allTankObstaclePositions.find((element, index) =>{
                if
                (
                    
                    element.top <= enemyTop + 40
                    &&element.left<= enemyLeft + 40
                    &&element.bottom >=enemyTop
                    &&element.right >=enemyLeft
                    ){
                        //and change direction for further movement
                        
                        //PSEUDO - INTELLIGENT OBSTACLE DESTROY FUNCTION!!
                        if(element.node.classList.contains('brick')){

                            element.node.remove()
                            allTankObstaclePositions.splice(index,1)
                        }
                        return element
                        
                    }
            })//ONLY first item is needed, 
                //rest must be discarded not to interfere with changing movement direction.
                
                enemyLeft = null
                enemyTop = null
                
                //4 - obstacleDetection is only true in the moment of collision. 
                //so if there was a collision and tank approached obstacle from the right: 
                if(obstacleDetection && enemyFacing === 'right'){
                    
                    //make it reverse (go left)
                    randomMove = 1
                    //BUT ONLY A LITTLE BIT - after 50ms GET ANOTHER direction TO THE SIDE,
                    //don't approach the obstacle again and don't keep going back, try to omit it.
                    setTimeout(() => {
                        let helpingFactor = Math.floor(Math.random() * 2)
                        if(helpingFactor === 0){
                            randomMove = 3
                        }else{
                            randomMove = 2
                        }
                    }, 50);
                }    
                else if(obstacleDetection && enemyFacing === 'left'){
                    randomMove = 0
                    setTimeout(() => {
                        let helpingFactor = Math.floor(Math.random() * 2)
                        if(helpingFactor === 0){
                            randomMove = 3
                        }else{
                            randomMove = 2
                        }
                    }, 50);
                }    
                else if(obstacleDetection && enemyFacing === 'up'){
                    randomMove = 3
                    setTimeout(() => {
                        randomMove = Math.floor(Math.random() * 2)
                        
                    }, 50);
                }    
                else if(obstacleDetection && enemyFacing === 'down'){
                    randomMove = 2
                    setTimeout(() => {
                        randomMove = Math.floor(Math.random() * 2)
                        
                    }, 50);
                }    
                
                
                
                
                
                //force enemy movement  according to random number:================            
                //DOWN DOWN DOWN DOWN DOWN -if 3
                if(randomMove === 3){
                    AI_down()
                    
                    //reaches map bottom edge - change direction
                    if(upORdown > mapHeight - 2){
                        enemy.style.top = `${mapHeight - 2}px`            
                        
                        //if it is trying to go over the egde, draw random number again
                        //to force changing direction
                        if(randomMove === 3){
                            randomMove = Math.floor(Math.random() * 4)
                        }
                        
                        
                    }
                //crashes with another enemy tank - change direction
                allEnemyPositions.find(element =>{
                    if
                    (
                        element.node !== enemy.id                
                        &&element.top -1<= enemy.offsetTop + 40
                        &&element.bottom >=enemy.offsetTop
                        &&element.left <= enemy.offsetLeft + 40
                        &&element.right >=enemy.offsetLeft
                        ){
                            upORdown -2
                            randomMove = Math.floor(Math.random() * 4)
                            AI_up()    }
                        })
                        
                        //collision with player one or two - change direction
                        if(
                            (enemy.offsetTop + 41 >= tank2Position.top 
                                && enemy.offsetLeft <= tank2Position.right 
                                && enemy.offsetLeft + 41>= tank2Position.left 
                                && enemy.offsetTop <= tank2Position.bottom) 
                                ||
                                (enemy.offsetTop + 41 >= tank1Position.top 
                                    && enemy.offsetLeft <= tank1Position.right 
                                    && enemy.offsetLeft + 41>= tank1Position.left 
                                    && enemy.offsetTop <= tank1Position.bottom)
                                    ){
                                        upORdown -2
                                        randomMove = Math.floor(Math.random() * 4)
                                        AI_up()    
                                    }
                                    
                                    
                                    //UP UP UP UP UP UP UP UP UP  - 2
                                }else if(randomMove === 2){
                                    AI_up()
                                    //top edge
                                    if(upORdown < 2){
                                        enemy.style.top = `2px`
                                        
                                        if(randomMove === 2){
                                            randomMove = Math.floor(Math.random() * 4)
                                        }
                                    }
                                    allEnemyPositions.find(element =>{
                                        if
                                        (
                        element.node !== enemy.id
                        &&element.top <= enemy.offsetTop + 40
                        &&element.bottom +1 >=enemy.offsetTop
                        &&element.left <= enemy.offsetLeft + 40
                        &&element.right >=enemy.offsetLeft
                        ){
                            upORdown +2
                            randomMove = Math.floor(Math.random() * 4)
                            AI_down()    }
                        })
                        
                        if(
                            (enemy.offsetTop + 41 >= tank2Position.top 
                                && enemy.offsetLeft <= tank2Position.right 
                                && enemy.offsetLeft + 41>= tank2Position.left 
                                && enemy.offsetTop <= tank2Position.bottom) 
                                ||
                                (enemy.offsetTop + 41 >= tank1Position.top 
                                    && enemy.offsetLeft <= tank1Position.right 
                                    && enemy.offsetLeft + 41>= tank1Position.left 
                                    && enemy.offsetTop <= tank1Position.bottom)
                                    ){
                                        upORdown +2
                                        randomMove = Math.floor(Math.random() * 4)
                                        AI_down()    
                                    }
                                    
                                    
                                    
                                    //LEFT LEFT LEFT LEFT LEFT LEFT - 1
                                }else if(randomMove === 1){
                                    AI_left()
                //left edge
                if(leftORright < 2){
                    enemy.style.left = `2px`
                    
                    //if it is trying to go over the egde, draw random number again
                    //to force changing direction
                    if(randomMove === 1){
                        randomMove = Math.floor(Math.random() * 4)
                    }
                    
                }
                allEnemyPositions.find(element =>{
                    if
                    (
                        element.node !== enemy.id
                        &&element.top <= enemy.offsetTop + 40
                        &&element.bottom >=enemy.offsetTop
                        &&element.left <= enemy.offsetLeft + 40
                        &&element.right + 1>=enemy.offsetLeft
                        ){
                            leftORright+2
                            randomMove = Math.floor(Math.random() * 4)
                            AI_right() 
                            createMissle(enemy, 'enemy', allEnemyPositions)  }
                        })
                        if(
                            (enemy.offsetTop + 41 >= tank2Position.top 
                                && enemy.offsetLeft <= tank2Position.right 
                                && enemy.offsetLeft + 41>= tank2Position.left 
                                && enemy.offsetTop <= tank2Position.bottom) 
                                ||
                                (enemy.offsetTop + 41 >= tank1Position.top 
                                    && enemy.offsetLeft <= tank1Position.right 
                                    && enemy.offsetLeft + 41>= tank1Position.left 
                                    && enemy.offsetTop <= tank1Position.bottom)
                                    ){
                                        leftORright+2
                                        randomMove = Math.floor(Math.random() * 4)
                                        AI_right()    
                                    }
                                    
                                    //RIGHT RIGHT RIGHT RIGHT RIGHT RIGHT - 0
                                }else if(randomMove === 0){
                                    AI_right()
                                    
                                    //right edge
                                    if(leftORright > mapWidth - 2){
                                        enemy.style.left = `${mapWidth -2}px`
                                        
                                        //if it is trying to go over the egde, draw random number again
                                        //to force changing direction
                                        if(randomMove === 0){
                        randomMove = Math.floor(Math.random() * 4)
                    }
                }
                allEnemyPositions.find(element =>{
                    if
                    (
                        element.node !== enemy.id
                        &&element.top <= enemy.offsetTop + 40
                        &&element.bottom >=enemy.offsetTop
                        &&element.left -1 <= enemy.offsetLeft + 40
                        &&element.right >=enemy.offsetLeft
                        ){
                            leftORright-2
                            randomMove = Math.floor(Math.random() * 4)
                            AI_left()    }
                        })
                        if(
                            (enemy.offsetTop + 41 >= tank2Position.top 
                                && enemy.offsetLeft <= tank2Position.right 
                                && enemy.offsetLeft + 41>= tank2Position.left 
                                && enemy.offsetTop <= tank2Position.bottom) 
                                ||
                                (enemy.offsetTop + 41 >= tank1Position.top 
                                    && enemy.offsetLeft <= tank1Position.right 
                                    && enemy.offsetLeft + 41>= tank1Position.left 
                                    && enemy.offsetTop <= tank1Position.bottom)
                                    ){
                                        leftORright-2
                                        randomMove = Math.floor(Math.random() * 4)
                                        AI_left()    
                                    }
                                    
                                }
                                
                                
                            },30)      
                            //*end of interval++++++++++++++++++++++++++
                            

                            //vertical movement functions====================
                            function AI_down(){//go down
                                enemyFacing = 'down'
                                upORdown += 1            
                                enemy.style.top = `${upORdown}px`
                                enemy.style.transform = `rotateZ(90deg)`
                                
                            }        
                            function AI_up() {//go up
                                enemyFacing = 'up'
                                upORdown -= 1            
                                enemy.style.top = `${upORdown}px`
                                enemy.style.transform = `rotateZ(270deg)`
                                
                            }             
                            
                            //horizontal movement functions====================
                            function AI_left(){//go left
                                enemyFacing = 'left'
                                leftORright -= 1            
                                enemy.style.left = `${leftORright}px`
                                enemy.style.transform = `rotateZ(180deg)`
                                
                            }
                            function AI_right(){//go right
                                enemyFacing = 'right'
                                leftORright += 1            
                                enemy.style.left = `${leftORright}px`
                                enemy.style.transform = `rotateZ(0deg)`
                                
                            }
                        }
                        
                        
                        //method to return array of objects containing borders' positions of all alive enemies
                        static getAllEnemies = function(){
                            return  [...document.querySelectorAll('.enemy-tank')].map(element => {
                                return {
                                    top: element.offsetTop,
                                    bottom: element.offsetTop + 40,
                                    left: element.offsetLeft,
                                    right: element.offsetLeft + 40,
                                    node: element.id,
                                    DOMnode: element
                                }
                                
                                
                            })
                            
                            
                        }   
                        
                    }
                    enemyGen.addEventListener('click', Enemy.create)
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    


// UTILITY FUNCTIONS:





//little extra - nearest obstacles detector

// function highlightClosestObstacles(){
//     // return Obstacle.closest()
//     const theClosest = Obstacle.closest()
//     //limit the array of all obstacles to 4. they are pre-sorted by closest() method
//     //from closest one to furthest.
//     theClosest.length = 4
//     //each item is an array itself, index 0 being the DOM element, index 1 being the distance from player
    
//     //toggle the class wich makes the obstacle blink 
//     theClosest.forEach(theClosest =>{
//         if(!theClosest[0].classList.contains('closest')){

//             theClosest[0].classList.add('closest')
//         }
        
//         setTimeout(() => {
//             theClosest[0].classList.remove('closest')
//         }, 250);
        

//     })
// }
// //evry half a second check which obstacles are now closest ones 
// setInterval(() => {
    
//     highlightClosestObstacles()
// }, 500);







//make the player tank burn after it gets hit!
function setFire(where){
    
    const fire = document.createElement('div')        
    
    where.appendChild(fire)
    fire.setAttribute('style', `top: ${getRandomNumberBetween(1, where.getBoundingClientRect().height * 0.5)}px; left:${getRandomNumberBetween(0, where.getBoundingClientRect().width * 0.95)}px`)
    fire.classList.add('fire')
    
}

//utility function for getting random numbers between min and max value provided
const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// enemy explosion animation

function explode(enemy, player){
    let explosion = document.createElement('div')
    map.appendChild(explosion)
    if(player){
        explosion.style.left = `${player.left + 10}px`
        explosion.style.top = `${player.top + 10}px`
    }
    if(enemy){
        explosion.style.left = `${enemy.left + 10}px`
        explosion.style.top = `${enemy.top + 10}px`
        Enemy.number --
    }
    boom.play()
    explosion.classList.add('explo')

    setTimeout(() => {
        
        explosion.remove()
        explosion = null
    }, 1000);

}





//GAME STARTING LOGIC: initialize player one only or both players

function StartGame(numOfPlayers){
    //logic for single player game - not default. Hide all player 2 props
    if(numOfPlayers === 1){
        player2dead = true
        tank2.style.top = '2000px'
        document.querySelector('.player-two-stats').style.visibility = 'hidden'
        
        //hide player 2 gameover stats:
        document.querySelector('#p2stat').style.visibility = 'hidden'
        
    }
    //reset timer
    Timer.seconds = 0    
    Timer.minutes = 0
    Timer.hours = 0
    //let the enemies be born
    gameOver = false
    mainMenu.style.display = 'none'
    //initialize game obstacles:
    Obstacle.generateNewLevel()
}

const mainMenu = document.querySelector('.main-menu')

//make user decide if game is in single player mode or for two players:
mainMenu.addEventListener('click', (e) =>{
    if(e.target.id === 'single'){
        StartGame(1)
    }else if((e.target.id === 'shared')){
        StartGame(2)
    }
})

//gameover logic
function endTheGame(){
    //make the map disappear
    map.classList.add('fade-away')
    document.getElementById('info-pannel').classList.add('fade-away')

    
    //remove all dom nodes for the map as well
    setTimeout(() => {        
        //pop up the gameover screen
        document.querySelector('.gameover').classList.add('visible')
        map.remove()
    }, 2500);
    //activate page refresh button
    document.querySelector('.restart-btn').addEventListener('click', ()=>{
        // refresh the page
        location.reload()
    })
}