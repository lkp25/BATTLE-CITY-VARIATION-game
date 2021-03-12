//hide scrollbars
document.body.style.overflow = 'hidden'

//=======================================================================
//===================MAIN VARIABLES, CREATING PLAYERS====================
//=======================================================================
//define game area
const map = document.querySelector('.map')
//map size
let mapHeight = 580
let mapWidth = 580

let tank1Position = {}
let tank2Position = {}

let missle1Position = {}
let missle2Position = {}

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
tank2.setAttribute('style', "top: 360px; left:0px")
tank2.classList.add('tank2')
tank2.style.opacity = 1
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
















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
            createMissle(tank1Position, 1)              
                    
        }      
        else if(e.key === 'q' && missle2Num < 1){                 
            missle2Num ++        
            fire2 = true
            createMissle(tank2Position, 2)              
                    
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




    function createMissle(whoIsShooting, which){
        //GET ALL OBSTACLES' POSITIONS
        const obstaclesPositions = Obstacle.getAll()
        //GET ALL ENEMIES' POSITIONS
        const allCurrentEnemyPositions = Enemy.getAllEnemies()


        
        //CHECK WHO WAS SHOOTING:
            //ENEMY was shooting
            if(which === 'enemy'){
                
                //function for checking if player was hit by enemy
                function checkIfPlayerWasHit(which){
                    if((missle.getBoundingClientRect().top) <= which.getBoundingClientRect().bottom
                            && (missle.getBoundingClientRect().left) <= which.getBoundingClientRect().right
                            && (missle.getBoundingClientRect().right) >= which.getBoundingClientRect().left
                            && (missle.getBoundingClientRect().bottom) >= which.getBoundingClientRect().top
                            ){
                                
                                
                                missle.remove()
                                which.style.opacity = `${((((which.style.opacity * 10) - 1) / 10))}`
                                
                                
                            }   
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
                        
                        //NO TARGET WAS HIT
                        if(trajectorY > 600){
                            missle.remove()
                            clearInterval(shootingInterval)
                        }

                        //keep the missle flying
                        trajectorY += 10
                        missle.style.top = `${trajectorY}px`


                        //check if obstacle was hit by missle
                        obstaclesPositions.forEach(obstacle =>{
                            if(
                               
                                missle.getBoundingClientRect().bottom >= obstacle.top
                                && missle.offsetTop  <= obstacle.bottom
                                && missle.offsetLeft -2<= obstacle.right
                                && missle.offsetLeft +8  >= obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                clearInterval(shootingInterval)
                            } 
                        })    
                        
                        //check if one of the players was hit
                        checkIfPlayerWasHit(tank)
                        checkIfPlayerWasHit(tank2)
                        
                    }, 20);
                }



                if(missleFacing === 'up'){
                    const shootingInterval = setInterval(() => {
                        if(trajectorY < -20){
                            missle.remove()
                            clearInterval(shootingInterval)
                        }


                        trajectorY -= 10
                        missle.style.top = `${trajectorY}px`


                        //check if obstacle was hit by missle
                        obstaclesPositions.forEach(obstacle =>{
                            if(
                               
                                missle.offsetTop > obstacle.top
                                && missle.getBoundingClientRect().bottom  < obstacle.bottom
                                && missle.offsetLeft - 2 < obstacle.right
                                && missle.offsetLeft + 8  > obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                //stop the interval from running forever
                                clearInterval(shootingInterval)
                            } 
                            //check if one of the players was hit
                            checkIfPlayerWasHit(tank)
                            checkIfPlayerWasHit(tank2)
                        })    
                    }, 20);
                }
                if(missleFacing === 'left'){
                    const shootingInterval = setInterval(() => {
                        if(trajectorZ < -20){
                            missle.remove()
                            clearInterval(shootingInterval)
                        }

                        trajectorZ -= 10
                        missle.style.left = `${trajectorZ}px`

                        //check if obstacle was hit by missle
                        obstaclesPositions.forEach(obstacle =>{
                            if(
                               
                                missle.getBoundingClientRect().bottom >= obstacle.node.getBoundingClientRect().top
                                && missle.getBoundingClientRect().top  <= obstacle.node.getBoundingClientRect().bottom
                                && missle.getBoundingClientRect().left <= obstacle.node.getBoundingClientRect().right
                                && missle.getBoundingClientRect().right >= obstacle.node.getBoundingClientRect().left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                clearInterval(shootingInterval)
                            } 
                            //check if one of the players was hit
                            checkIfPlayerWasHit(tank)
                            checkIfPlayerWasHit(tank2)
                        })    
                    }, 20);
                }
                if(missleFacing === 'right'){
                    const shootingInterval = setInterval(() => {
                        if(trajectorZ > 600){
                            missle.remove()
                            clearInterval(shootingInterval)
                        }


                        trajectorZ += 10
                        missle.style.left = `${trajectorZ}px`

                        //check if obstacle was hit by missle
                        obstaclesPositions.forEach(obstacle =>{
                            if(
                               
                                missle.getBoundingClientRect().bottom >= obstacle.node.getBoundingClientRect().top
                                && missle.getBoundingClientRect().top  <= obstacle.node.getBoundingClientRect().bottom
                                && missle.getBoundingClientRect().left <= obstacle.node.getBoundingClientRect().right
                                && missle.getBoundingClientRect().right >= obstacle.node.getBoundingClientRect().left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                clearInterval(shootingInterval)

                            } 
                        })    
                        //check if one of the players was hit
                        checkIfPlayerWasHit(tank)
                        checkIfPlayerWasHit(tank2)

                    }, 20);
                }
            
                
            }









            //PLAYER 1 WAS SHOOTING=============================================
            if(which === 1 && fire === true){
                //calculate missle position based on tank position
                const missle = document.createElement('div')
                missle.classList.add('missle')
                //shoot a missle from tank center
                missle.style.top = parseInt(tank.style.top.slice(0, length -2)) + 15 + 'px'
                missle.style.left = parseInt(tank.style.left.slice(0, length -2)) + 17 + 'px'
                                
                //missle must be appended to MAP not to tank
                map.appendChild(missle)                
                //variable used to control the life-span of a missle
                let trajector = 0
                



                //function used to check if player missle hit any enemy
                //function used to check if player missle hit any enemy
                //function used to check if player missle hit any enemy
                //function used to check if player missle hit any enemy
                function checkIfEnemyWasHit(missle, allCurrentEnemyPositions){

                    allCurrentEnemyPositions.forEach((enemy)=>{
                      
                        
                        if(
                            
                            missle.getBoundingClientRect().bottom >= enemy.DOMnode.getBoundingClientRect().top
                            && missle.getBoundingClientRect().top  <= enemy.DOMnode.getBoundingClientRect().bottom
                            && missle.getBoundingClientRect().left <= enemy.DOMnode.getBoundingClientRect().right
                            && missle.getBoundingClientRect().right >= enemy.DOMnode.getBoundingClientRect().left
                        
                        ){
                            //remove the obstacle and the missle if true
                            enemy.DOMnode.style.display = 'none'
                            enemy.DOMnode.remove()
                            missle.remove()
                            
                        } 
                    })

                    
                }
                
                
               

               


            if(facing === 'up'){
                //new interval is being called every time a missle is fired.
                //i needs to be assigne to a variable so that it can be cleared
                //when the missle disappears! otherwise it runs forever
                // feeding on the app's performance!
                let performanceEater = setInterval( ()=>{
                    //increase the value 
                    trajector += 10
                    
                    
                    
                        //move the missle upwards by current trajector value
                        missle.style.transform = `translateY(-${trajector}px)`
                        
                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle.offsetTop > obstacle.top
                                && missle.getBoundingClientRect().bottom  < obstacle.bottom
                                && missle.offsetLeft - 2 < obstacle.right
                                && missle.offsetLeft + 8  > obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                //stop the interval from running forever
                                clearInterval(performanceEater)
                            } 
                        })    
                            
                            
                            
                            //check if other player was hit by missle
                            if((missle.getBoundingClientRect().top) <= tank2.getBoundingClientRect().bottom
                            && (missle.getBoundingClientRect().left) <= tank2.getBoundingClientRect().right
                            && (missle.getBoundingClientRect().right) >= tank2.getBoundingClientRect().left
                            && (missle.getBoundingClientRect().bottom) >= tank2.getBoundingClientRect().top
                            ){
                                
                                
                                missle.remove()
                                tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                                //stop the interval from running forever
                                clearInterval(performanceEater)
                            }                            
                        
                        //check if any enemy was hit
                        checkIfEnemyWasHit(missle ,allCurrentEnemyPositions)

                        

                        //if trajector value happens to be bigger than map size,
                        //remove the missle - it hasn't hit anything
                        if(trajector >= 580){
                            missle.remove()
                            //stop the interval from running forever
                            clearInterval(performanceEater)
                            
                        }
                }, 20)
            }
            
            
            if(facing === 'down'){
                let performanceEater = setInterval( ()=>{
                trajector += 10
             
                
                
                        missle.style.transform = `translateY(${trajector}px) rotateZ(180deg)`
                        
                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle.getBoundingClientRect().bottom >= obstacle.top
                                && missle.offsetTop  <= obstacle.bottom
                                && missle.offsetLeft -2<= obstacle.right
                                && missle.offsetLeft +8  >= obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                clearInterval(performanceEater)
                            } 
                        })    

                        //check if missle hit other player's tank
                        if((missle.getBoundingClientRect().bottom) >= tank2.getBoundingClientRect().top
                        && (missle.getBoundingClientRect().left) <= tank2.getBoundingClientRect().right
                        && (missle.getBoundingClientRect().right) >= tank2.getBoundingClientRect().left
                        && (missle.getBoundingClientRect().top) <= tank2.getBoundingClientRect().bottom
                        ){
                            
                         
                            
                            missle.remove()
                            tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                            clearInterval(performanceEater)
                        }
                
                        //check if any enemy was hit
                        checkIfEnemyWasHit(missle ,allCurrentEnemyPositions)
                
                    if(trajector >= 580){
                        missle.remove()
                        clearInterval(performanceEater)
                        
                    }
            }, 20)}
            if(facing === 'left'){
                let performanceEater = setInterval( ()=>{
                trajector += 10
                
               
                   
                
                        missle.style.transform = `translateX(-${trajector}px) rotateZ(270deg)`
                    
                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle.getBoundingClientRect().bottom >= obstacle.node.getBoundingClientRect().top
                                && missle.getBoundingClientRect().top  <= obstacle.node.getBoundingClientRect().bottom
                                && missle.getBoundingClientRect().left <= obstacle.node.getBoundingClientRect().right
                                && missle.getBoundingClientRect().right >= obstacle.node.getBoundingClientRect().left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                clearInterval(performanceEater)
                            } 
                        })    

                        if((missle.getBoundingClientRect().left) <= tank2.getBoundingClientRect().right
                        && (missle.getBoundingClientRect().bottom) >= tank2.getBoundingClientRect().top
                        && (missle.getBoundingClientRect().top) <= tank2.getBoundingClientRect().bottom
                        && (missle.getBoundingClientRect().right) >= tank2.getBoundingClientRect().left
                        ){
                            
                          
                            
                            missle.remove()
                            tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                            clearInterval(performanceEater)
                        }
                
                        //check if any enemy was hit
                        checkIfEnemyWasHit(missle ,allCurrentEnemyPositions)
                
                    if(trajector >= 580){
                        missle.remove()
                        clearInterval(performanceEater)
                        
                    }
            }, 20)}
            if(facing === 'right'){
                let performanceEater = setInterval( ()=>{
                trajector += 10
            
                        missle.style.transform = `translateX(${trajector}px) rotateZ(90deg)`
                    

                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle.getBoundingClientRect().bottom >= obstacle.node.getBoundingClientRect().top
                                && missle.getBoundingClientRect().top  <= obstacle.node.getBoundingClientRect().bottom
                                && missle.getBoundingClientRect().left <= obstacle.node.getBoundingClientRect().right
                                && missle.getBoundingClientRect().right >= obstacle.node.getBoundingClientRect().left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle.remove()
                                clearInterval(performanceEater)
                            } 
                        })    

                        if((missle.getBoundingClientRect().right) >= tank2.getBoundingClientRect().left
                        && (missle.getBoundingClientRect().bottom) >= tank2.getBoundingClientRect().top
                        && (missle.getBoundingClientRect().top) <= tank2.getBoundingClientRect().bottom
                        && (missle.getBoundingClientRect().left) <= tank2.getBoundingClientRect().right
                        ){
                            
                         
                            
                            missle.remove()
                            tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                            clearInterval(performanceEater)
                        }
                
                        //check if any enemy was hit
                        checkIfEnemyWasHit(missle ,allCurrentEnemyPositions)
                
                    if(trajector >= 580){
                        missle.remove()
                        clearInterval(performanceEater)
                        
                    }
            }, 20)}
        }








        //PLAYER 2 WAS SHOOTING=============================================
        if(which === 2 && fire2 === true){
                //calculate missle position based on tank position
                const missle2 = document.createElement('div')
                missle2.classList.add('missle')
                //shoot a missle from tank center       
               
                missle2.style.top = parseInt(tank2.style.top.slice(0, length -2)) + 15 + 'px'
                missle2.style.left = parseInt(tank2.style.left.slice(0, length -2)) + 17 + 'px'
               
                //missle must be appended to MAP not to tank
                map.appendChild(missle2)
                let trajector = 0
            if(facing2 === 'up'){
                let performanceEater = setInterval( ()=>{
                    trajector += 10
                   
                    
                    
                        
                            missle2.style.transform = `translateY(-${trajector}px)`
                            
                            obstaclesPositions.forEach(obstacle =>{
                                //check if obstacle was hit by missle
                                if(
                                   
                                    missle2.offsetTop > obstacle.top
                                    && missle2.getBoundingClientRect().bottom  < obstacle.bottom
                                    && missle2.offsetLeft - 2< obstacle.right
                                    && missle2.offsetLeft +8  > obstacle.left
                                
                                ){
                                    //remove the obstacle and the missle if true
                                    obstacle.node.remove()
                                    missle2.remove()
                                    clearInterval(performanceEater)
                                } 
                            })    

                            if((missle2.getBoundingClientRect().top) <= tank.getBoundingClientRect().bottom
                            && (missle2.getBoundingClientRect().left) <= tank.getBoundingClientRect().right
                            && (missle2.getBoundingClientRect().right) >= tank.getBoundingClientRect().left
                            && (missle2.getBoundingClientRect().bottom) >= tank.getBoundingClientRect().top
                            ){
                                
                                tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                                missle2.remove()
                                clearInterval(performanceEater)
                            }    
                        
                    
                    
                        if(trajector >= 580){
                            missle2.remove()
                            clearInterval(performanceEater)
                            
                        }
                }, 20)
            }
            
            if(facing2 === 'down'){
                let performanceEater = setInterval( ()=>{
                trajector += 10
                
                
                    
                
                        missle2.style.transform = `translateY(${trajector}px) rotateZ(180deg)`

                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle2.getBoundingClientRect().bottom >= obstacle.top
                                && missle2.offsetTop  <= obstacle.bottom
                                && missle2.offsetLeft -2<= obstacle.right
                                && missle2.offsetLeft +8  >= obstacle.left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle2.remove()
                                clearInterval(performanceEater)
                            } 
                        })    

                        if((missle2.getBoundingClientRect().bottom) >= tank.getBoundingClientRect().top
                        && (missle2.getBoundingClientRect().left) <= tank.getBoundingClientRect().right
                        && (missle2.getBoundingClientRect().right) >= tank.getBoundingClientRect().left
                        && (missle2.getBoundingClientRect().top) <= tank.getBoundingClientRect().bottom
                        ){
                            
                            
                            
                            missle2.remove()
                            tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                            clearInterval(performanceEater)
                        }
                
                
                    if(trajector >= 580){
                        missle2.remove()
                        clearInterval(performanceEater)
                        
                    }
            }, 20)}
            if(facing2 === 'left'){
                let performanceEater = setInterval( ()=>{
                trajector += 10
                
                
                
                
                        missle2.style.transform = `translateX(-${trajector}px) rotateZ(270deg)`
                    
                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle2.getBoundingClientRect().bottom >= obstacle.node.getBoundingClientRect().top
                                && missle2.getBoundingClientRect().top  <= obstacle.node.getBoundingClientRect().bottom
                                && missle2.getBoundingClientRect().left <= obstacle.node.getBoundingClientRect().right
                                && missle2.getBoundingClientRect().right >= obstacle.node.getBoundingClientRect().left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle2.remove()
                                clearInterval(performanceEater)
                            } 
                        })    

                        if((missle2.getBoundingClientRect().left) <= tank.getBoundingClientRect().right
                        && (missle2.getBoundingClientRect().bottom) >= tank.getBoundingClientRect().top
                        && (missle2.getBoundingClientRect().top) <= tank.getBoundingClientRect().bottom
                        && (missle2.getBoundingClientRect().right) >= tank.getBoundingClientRect().left
                        ){
                            
                            
                            missle2.remove()
                            tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                            clearInterval(performanceEater)
                        }
                
                
                    if(trajector >= 580){
                        missle2.remove()
                        clearInterval(performanceEater)
                        
                    }
            }, 20)}
            if(facing2 === 'right'){
                let performanceEater = setInterval( ()=>{
                trajector += 10
                
               
                        missle2.style.transform = `translateX(${trajector}px) rotateZ(90deg)`
                    
                        obstaclesPositions.forEach(obstacle =>{
                            //check if obstacle was hit by missle
                            if(
                               
                                missle2.getBoundingClientRect().bottom >= obstacle.node.getBoundingClientRect().top
                                && missle2.getBoundingClientRect().top  <= obstacle.node.getBoundingClientRect().bottom
                                && missle2.getBoundingClientRect().left <= obstacle.node.getBoundingClientRect().right
                                && missle2.getBoundingClientRect().right >= obstacle.node.getBoundingClientRect().left
                            
                            ){
                                //remove the obstacle and the missle if true
                                obstacle.node.remove()
                                missle2.remove()
                                clearInterval(performanceEater)
                            } 
                        })    

                        if((missle2.getBoundingClientRect().right) >= tank.getBoundingClientRect().left
                        && (missle2.getBoundingClientRect().bottom) >= tank.getBoundingClientRect().top
                        && (missle2.getBoundingClientRect().top) <= tank.getBoundingClientRect().bottom
                        && (missle2.getBoundingClientRect().left) <= tank.getBoundingClientRect().right
                        
                        ){
                            
                           
                            
                            missle2.remove()
                            tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                            clearInterval(performanceEater)
                        }
                
                
                    if(trajector >= 580){
                        missle2.remove()
                        clearInterval(performanceEater)
                        
                    }
            }, 20)}
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
        tank.classList.add('tank-move')
        down = true
        right = false
        up = false
        left = false
    }
    else if(e.key === 'ArrowUp'){
        tank.classList.add('tank-move')
        up = true
        right = false
        down = false
        left = false
    }
    else if(e.key === 'ArrowRight'){
        tank.classList.add('tank-move')
        right = true
        down = false
        up = false
        left = false
    }
    else if(e.key === 'ArrowLeft'){
        tank.classList.add('tank-move')
        left = true
        right = false
        up = false
        down = false
    }
    //player 2
    if(e.key === 's'){
        tank2.classList.add('tank2-move')
        down2 = true
        right2 = false
        up2 = false
        left2 = false
    }
    else if(e.key === 'w'){
        tank2.classList.add('tank2-move')
        up2 = true
        right2 = false
        down2 = false
        left2 = false
        
    }
    else if(e.key === 'd'){
        tank2.classList.add('tank2-move')
        right2 = true
        down2 = false
        up2 = false
        left2 = false
    }
    else if(e.key === 'a'){
        tank2.classList.add('tank2-move')
        left2 = true
        right2 = false
        up2 = false
        down2 = false
    }
}))
//key up - change to FALSE
document.addEventListener('keyup', ((e) =>{
    //player 1
    tank.classList.remove('tank-move')
    tank2.classList.remove('tank2-move')
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


    function movement(tank1Position, tank2Position){
       
        //dont let player take position of enemy spawn

        if(tank1Position.left <= 40 && tank1Position.top <= 40){
            if(facing === 'left'){
                tank.style.left = '42px'
            }
            if(facing === 'up'){
                tank.style.top = '42px'
            }
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
            Obstacle.getAll().forEach(element =>{
                if
                (element.top -1<= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right >=tank1Position.left 
                ){
                    yPos -= 2   }
                })
            //check for crash with AI-enemies
           Enemy.getAllEnemies().forEach(element =>{
            if
            (element.top -1<= tank1Position.bottom 
            &&element.bottom >=tank1Position.top 
            &&element.left <= tank1Position.right 
            &&element.right >=tank1Position.left 
            ){
                yPos -= 5   }
           })
            
            
                //STOP when it reaches MAP-BOTTOM
            if(yPos >= mapHeight){  
                tank.style.top = `${mapHeight}px`
            }else{  //keep going down if there is space
                tank.style.top = `${yPos}px`
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
            Obstacle.getAll().forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom +1>=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right >=tank1Position.left 
                ){
                    yPos += 2   }
                })

                //Check for crash with enemy AI
            Enemy.getAllEnemies().forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom +1>=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right >=tank1Position.left 
                ){
                    yPos += 5  }
                })

            if(yPos <= 0){  //STOP when it reaches MAP-TOP
                tank.style.top = `${0}px`
            }else{  //keep going up if there is space
                tank.style.top = `${yPos}px`
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
            
            Obstacle.getAll().forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left <= tank1Position.right 
                &&element.right +1>=tank1Position.left 
                ){
                    xPos += 2   }
            })

            Enemy.getAllEnemies().forEach(element =>{
                 if
                 (element.top <= tank1Position.bottom 
                    &&element.bottom >=tank1Position.top 
                    &&element.left <= tank1Position.right 
                    &&element.right +1>=tank1Position.left 
                 ){
                        xPos += 5   }
            })
            
            if(xPos <= 0){  //STOP when it reaches MAP-LEFT-edge
                tank.style.left = `${0}px`
            }else{  //keep going left if there is space
                tank.style.left = `${xPos}px`
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
            
            Obstacle.getAll().forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left -1<= tank1Position.right 
                &&element.right>=tank1Position.left 
                ){
                    xPos -= 2   }
            })
            Enemy.getAllEnemies().forEach(element =>{
                if
                (element.top <= tank1Position.bottom 
                &&element.bottom >=tank1Position.top 
                &&element.left -1<= tank1Position.right 
                &&element.right>=tank1Position.left 
                ){
                    xPos -= 5   }
                })

            if(xPos >= mapWidth){  //STOP when it reaches MAP-RIGHT-edge
                tank.style.left = `${mapWidth}px`
            }else{  //keep going right if there is space
                tank.style.left = `${xPos}px`
            }
        }
    
        
    }
    








    function movement2(tank1Position, tank2Position){
        //dont let player take position of enemy spawn
        if(tank2Position.left <= 40 && tank2Position.top <= 40){
            if(facing2 === 'left'){
                tank2.style.left = '42px'
            }
            if(facing2 === 'up'){
                tank2.style.top = '42px'
            }
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
            Obstacle.getAll().forEach(element =>{
                if
                (element.top -1<= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos -= 2   }
            })
            Enemy.getAllEnemies().forEach(element =>{
                if
                (element.top -1<= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos -= 5   }
            })

            if(yPos >= mapHeight){  //STOP when it reaches MAP-BOTTOM
                tank2.style.top = `${mapHeight}px`
            }else{  //keep going down if there is space
                tank2.style.top = `${yPos}px`
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
            Obstacle.getAll().forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom +1>=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos += 2   }
            })
            Enemy.getAllEnemies().forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom +1>=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right >=tank2Position.left 
                ){
                    yPos += 5   }
            })

            if(yPos <= 0){  //STOP when it reaches MAP-TOP
                tank2.style.top = `${0}px`
            }else{  //keep going up if there is space
                tank2.style.top = `${yPos}px`
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

            Obstacle.getAll().forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right +1>=tank2Position.left 
                ){
                    xPos += 2   }
            })
            Enemy.getAllEnemies().forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left <= tank2Position.right 
                &&element.right +1>=tank2Position.left 
                ){
                    xPos += 5   }
            })

            if(xPos <= 0){  //STOP when it reaches MAP-LEFT-edge
                tank2.style.left = `${0}px`
            }else{  //keep going left if there is space
                tank2.style.left = `${xPos}px`
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

            Obstacle.getAll().forEach(element =>{
                if
                (element.top <= tank2Position.bottom 
                &&element.bottom >=tank2Position.top 
                &&element.left -1<= tank2Position.right 
                &&element.right>=tank2Position.left 
                ){
                    xPos -= 2   }
            })
            Enemy.getAllEnemies().forEach(element =>{
                if
                    (element.top <= tank2Position.bottom 
                    &&element.bottom >=tank2Position.top 
                    &&element.left -1<= tank2Position.right 
                    &&element.right>=tank2Position.left 
                ){
                    xPos -= 5   }
            })
            if(xPos >= mapWidth){  //STOP when it reaches MAP-RIGHT-edge
                tank2.style.left = `${mapWidth}px`
            }else{  //keep going right if there is space
                tank2.style.left = `${xPos}px`
            }
        }
    
        
    }
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    





















//=======================================================================================
//===================================MAIN EXECUTOR=======================================
//=======================================================================================
setInterval(()=>{
     tank1Position = {
        top:tank.offsetTop,
        left: tank.offsetLeft,
        bottom: tank.offsetTop + 40,
        right: tank.offsetLeft + 40
    }
     tank2Position = {
        top:tank2.offsetTop,
        left: tank2.offsetLeft,
        bottom: tank2.offsetTop + 40,
        right: tank2.offsetLeft + 40
    }    
    
   
    //pass current player1 and player2 tanks position to movement function
    movement(tank1Position, tank2Position)
    movement2(tank1Position, tank2Position)
    

    //constantly check position of each obstacle for collision
    //with player tanks
    // Obstacle.checkCrash()
    // highlightClosestObstacles()
},15)
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++























//=======================================================================================
//======================THE MAIN OBSTACLE CONSTRUCTOR - brick walls=======================
//=======================================================================================
let numberOfObstacles = 100
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
        
        const alreadyCreated = [...document.querySelectorAll('.brick')]
        
        //create new  obstacle
        const obstacle = document.createElement('div')                
        obstacle.classList.add('brick')
        //position it randomly using positionsArray
        let top = positionsArray[Math.floor(Math.random() * 26)]
        let left = positionsArray[Math.floor(Math.random() * 23)]
        map.appendChild(obstacle)

        //add an id using it's generated positions so that
        // if a duplicate occurs it will be identified

        obstacle.id = `t${top}l${left}`
        obstacle.setAttribute('style', `top: ${top}px; left: ${left}px`)
        // obstacle.style.top = `${top}`
        // obstacle.style.left = `${left}`
        
        //search the entire array of already created obstacles to check
        //if one with same position already exists. If it does - remove the duplicate.
        alreadyCreated.forEach((element)=>{
            if(element.id === obstacle.id){
                obstacle.remove();
            }
                
            
        })
        
                //increase obstacles counter
                this.number ++
        
    }

    //function to get all positions of all obstacles
    static getAll = function(){
        return  [...document.querySelectorAll('.brick')].map((element, index) => {
            return {
                top: element.offsetTop,
                bottom: element.offsetTop + 22,
                left: element.offsetLeft,
                right: element.offsetLeft + 22,
                node: element,
                index
            }

            
        })
     
        
        
    }   
    //REMOVE POSSIBLE DUPLICATES!  
    // static removeDuplicates = this.getAll()        
    // .reduce((duplicates, element, currentIndex, array)=>{
        
    //     duplicates.push([currentIndex, element.left, element.top])
        
    //     // for(let i = 0; duplicates.length; i++){
    //     //     if(duplicates[i][1] === duplicates[i + 1] && duplicates[i][2] === duplicates[i + 2]){
    //     //         console.log('huj');
    //     //     }
    //     // }
        
    //     return duplicates
    // }, [])
    //for finding closest obstacles - used lower in the
    static closest = function(){
        return  [...document.querySelectorAll('.brick')].map(element => {
            return [
                element,
                Math.abs(element.getBoundingClientRect().left - 9 - tank.getBoundingClientRect().left) ** 2 + Math.abs(element.getBoundingClientRect().top - 9 - tank.getBoundingClientRect().top) ** 2
                // (((Math.abs(element.offsetLeft - tank.offsetLeft)) * (Math.abs(element.offsetLeft - tank.offsetLeft)))    
                // +    ((Math.abs(element.offsetTop - tank.offsetTop)) *  (Math.abs(element.offsetTop - tank.offsetTop))))

            ]
            // parseInt(Math.sqrt((Math.abs(element.offsetLeft+11 - tank.offsetLeft+20) *  Math.abs(element.offsetLeft + 11 - tank.offsetLeft +20))    +    (Math.abs(element.offsetTop+11 - tank.offsetTop+20) *  Math.abs(element.offsetTop + 11 - tank.offsetTop +20))))  
            
        }).sort((a, b) => {
            return a[1] - b[1]}) //returns array of all obstacles with their distance from player 1
    }
    
   
}


//Create initial obstacles, as many as allowed
for(let x = 0; x < numberOfObstacles; x++){
    Obstacle.create()
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
        if(this.number > 20){
            
            return
        }   
        let spawnStatus
        this.getAllEnemies().forEach((element) =>{
            if(element.top <= 40 && element.left <= 40){
                spawnStatus = 'occupied'
            }else{
                spawnStatus = 'free'

            }
        })
        if(spawnStatus === 'occupied'){
            return setTimeout(() => {
                Enemy.create()
            }, 1000);
        }
        //else create new enemy
        const enemy = document.createElement('div')
                
                //add CSS styles
                enemy.classList.add('enemy-tank')
                //add initial position
                enemy.setAttribute('style', "top: 0px; left: 0px")
                //add ID in case it is needed
                enemy.setAttribute('id', `enemy${this.number}`) 
                //append it to map
                map.appendChild(enemy)
                //increase current number of enemies
                this.number ++

        //INITIALIZE MOVENT OF THE ENEMY - passing single enemy div as an argument        
        this.move(enemy)
        
        //initialize shooting interval
        this.shootMissle(enemy)
    }



    //==============================================================================
    //================================== AI SHOOTING=================================
    //==============================================================================
    static shootMissle = function(whoIsShooting){
        // console.log(whoIsShooting.id, 'enemy');
        

        const shootingInterval = setInterval(() => {
            if(whoIsShooting.style.display === 'none'){
                
                clearInterval(shootingInterval)
            }
            createMissle(whoIsShooting, 'enemy')
        }, 2000);
    }


    //==============================================================================
    //==================================movement AI=================================
    //==============================================================================
    static move = function(enemy){
       
        //main positioning variables: vertical and horizontal
        let upORdown = 0
        let leftORright = 0

        //current movement direction of enemy tank
        let enemyFacing = 'right'
        
        


        //main movement randomization interval options -
        
        
        let randomMove = 0
       
       //option 1: hyperrandom
        //every iteration calls buuu function which after hyperRandom time
        //returns sets randomMove to left/right/up/down.
        // let hyperRandom
        // setInterval(() => {
        //     hyperRandom = Math.floor(Math.random() * 3000)    
            
        //     buuu()   
        // }, 5000);
        // function buuu(){return setTimeout(() => {
        //     randomMove = Math.floor(Math.random() * 4)            
        // }, hyperRandom)}     
        
        
        // option 2: player pursuit
        // setInterval(() => {
        //     if(tank1Position.top > enemy.offsetTop){
        //         randomMove = 3
        //         setTimeout(() => {
        //             if(tank1Position.left > enemy.offsetLeft){
        //                 randomMove = 0
        //             }else{
        //                 randomMove = 1
        
        //             }
        //         },250);

        //     }else{
        //         randomMove = 2

        //     }
        // }, 1500);

        // option 3: simplest random with set interval
        // OLD, simple, more predictable
        // randomMove - parameter used to change direction randomly ALLWAYS after specified time
        
        //name the interval so it can be removed if this enemy gets shot by player!!!
        const randomMovementGenerator = setInterval(() => {
            if(enemy.style.display === 'none'){
                
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
            if(enemy.style.display === 'none'){
                
                clearInterval(enemyMovementInterval)
            }
            
            obstacleDetection = Obstacle.getAll().reduce((newArr, element) =>{
                    if
                    (element.top <= enemy.offsetTop + 40
                    &&element.bottom >=enemy.offsetTop
                    &&element.left<= enemy.offsetLeft + 40
                    &&element.right >=enemy.offsetLeft 
                    
                    ){
                        //and change direction for further movement
                        newArr.push(element)                                                 
                    }
                    return newArr
                    },[])[0] //ONLY first item is needed, 
                    //rest must be discarded not to interfere with changing movement direction.

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




            //get all positions of all alive enemies
            const allCurrentEnemyPositions = Enemy.getAllEnemies()
                        
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
                allCurrentEnemyPositions.forEach(element =>{
                    if
                    (element.top -1<= enemy.offsetTop + 40
                    &&element.bottom >=enemy.offsetTop
                    &&element.left <= enemy.offsetLeft + 40
                    &&element.right >=enemy.offsetLeft
                    &&element.node !== enemy.id                
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
                 allCurrentEnemyPositions.forEach(element =>{
                    if
                    (element.top <= enemy.offsetTop + 40
                        &&element.bottom +1 >=enemy.offsetTop
                        &&element.left <= enemy.offsetLeft + 40
                        &&element.right >=enemy.offsetLeft
                        &&element.node !== enemy.id
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
                 allCurrentEnemyPositions.forEach(element =>{
                    if
                    (element.top <= enemy.offsetTop + 40
                        &&element.bottom >=enemy.offsetTop
                        &&element.left <= enemy.offsetLeft + 40
                        &&element.right + 1>=enemy.offsetLeft
                        &&element.node !== enemy.id
                    ){
                        leftORright+2
                        randomMove = Math.floor(Math.random() * 4)
                        AI_right()   }
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
                allCurrentEnemyPositions.forEach(element =>{
                    if
                    (element.top <= enemy.offsetTop + 40
                        &&element.bottom >=enemy.offsetTop
                        &&element.left -1 <= enemy.offsetLeft + 40
                        &&element.right >=enemy.offsetLeft
                        &&element.node !== enemy.id
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
                        
           
        },20)      
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



// enemy creator interval
Enemy.create()


 

 







//little extra - nearest obstacles detector

function highlightClosestObstacles(){
    // return Obstacle.closest()
    const theClosest = Obstacle.closest()
    //limit the array of all obstacles to 4. they are pre-sorted by closest() method
    //from closest one to furthest.
    theClosest.length = 4
    //each item is an array itself, index 0 being the DOM element, index 1 being the distance from player
    
    //toggle the class wich makes the obstacle blink 
    theClosest.forEach(theClosest =>{
        if(!theClosest[0].classList.contains('closest')){

            theClosest[0].classList.add('closest')
        }
        
        setTimeout(() => {
            theClosest[0].classList.remove('closest')
        }, 250);
        

    })
}
//evry half a second check which obstacles are now closest ones 
setInterval(() => {
    
    highlightClosestObstacles()
}, 500);




//fire!!

function setFire(where){
    
    const fire = document.createElement('div')
    // getRandomNumberBetween(where.width)
        
    
    where.appendChild(fire)
    fire.setAttribute('style', `top: ${getRandomNumberBetween(1, where.getBoundingClientRect().height * 0.5)}px; left:${getRandomNumberBetween(0, where.getBoundingClientRect().width * 0.95)}px`)
    fire.classList.add('fire')
    
}

//useful function for getting random numbers between min and max value provided
const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };