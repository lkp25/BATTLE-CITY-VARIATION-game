//hide scrollbars
document.body.style.overflow = 'hidden'


//================== global variables==================================
//map size
let mapHeight = 360
let mapWidth = 360

let tank1Position = {}
let tank2Position = {}

let missle1Position = {}
let missle2Position = {}

//movement of player tanks - key values
let up = false
let down = false
let right = false
let left = false
let fire = false
let facing = 'down'


let up2 = false
let down2 = false
let right2 = false
let left2 = false
let fire2 = false
let facing2 = 'down'
//=======================================================================



//define game area
const map = document.querySelector('.map')

//create player1 tank:  
const tank = document.createElement('div')
// .setAttribute('style', "top: 0px; left: 360px")
map.appendChild(tank)
tank.setAttribute('style', "top: 0px; left: 360px")
tank.classList.add('tank')
tank.style.opacity = 1

//create player2 tank:
const tank2 = document.createElement('div')
// .setAttribute('style', "top: 0px; left: 360px")
map.appendChild(tank2)
tank2.setAttribute('style', "top: 360px; left:0px")
tank2.classList.add('tank2')
tank2.style.opacity = 1







//limit maximum number of missles for each tank on map
    let missle1Num = 0
    let missle2Num = 0
    //create missle
    setInterval(() => {
        missle2Num = 0
        missle1Num = 0
        
    }, 500);
    
    
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
    document.addEventListener('keyup', ((e)=> {           
    
        if(e.key === 'p'){                 
            fire = false                  
        }      
        if(e.key === 'q'){                 
            fire2 = false                  
        }      
          
    }))
    
    
    function createMissle(position, which){
        
        
        
        //check which tank was shooting

        
            if(which === 1 && fire === true){
                //calculate missle position based on tank position
                const missle = document.createElement('div')
                missle.classList.add('missle')
                //shoot a missle from tank center
                missle.style.top = `${position.top + 17}px`
                missle.style.left = `${position.left + 17}px`
                
                //missle must be appended to MAP not to tank
                map.appendChild(missle)
                
                
                //variable used to control the life-span of a missle
                let trajector = 0
                
                
                
               

               


            if(facing === 'up'){
                setInterval( ()=>{
                    trajector += 20
                        
                        
                        missle.style.transform = `translateY(-${trajector}px)`
                        
                            
                            
                            
                            
                            
                            if((missle.getBoundingClientRect().top) <= tank2.getBoundingClientRect().bottom
                            && (missle.getBoundingClientRect().left - 18) <= tank2.getBoundingClientRect().right
                            && (missle.getBoundingClientRect().left - 5) >= tank2.getBoundingClientRect().left
                            && (missle.getBoundingClientRect().top) >= tank2.getBoundingClientRect().top
                            ){
                                
                                // missle.style.background = 'black'  for early testing
                                
                                missle.remove()
                                tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                            }                            
                        
                    

                        if(trajector >= 400){
                            missle.remove()
                           
                            
                        }
                }, 20)
            }
            
            
            if(facing === 'down'){setInterval( ()=>{
                trajector += 20
                    
                
                        missle.style.transform = `translateY(${trajector}px)`
                    
                        if((missle.getBoundingClientRect().top) >= tank2.getBoundingClientRect().top
                        && (missle.getBoundingClientRect().left - 18) <= tank2.getBoundingClientRect().right
                        && (missle.getBoundingClientRect().left - 5) >= tank2.getBoundingClientRect().left
                        && (missle.getBoundingClientRect().top - 10) <= tank2.getBoundingClientRect().bottom
                        ){
                            
                            // missle.style.background = 'black'  for early testing
                            
                            missle.remove()
                            tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                        }
                
                
                    if(trajector >= 400){
                        missle.remove()
                    
                        
                    }
            }, 20)}
            if(facing === 'left'){setInterval( ()=>{
                trajector += 20
                    
                
                        missle.style.transform = `translateX(-${trajector}px)`
                    
                        if((missle.getBoundingClientRect().left) <= tank2.getBoundingClientRect().right
                        && (missle.getBoundingClientRect().top + 10) >= tank2.getBoundingClientRect().top
                        && (missle.getBoundingClientRect().top + 0) <= tank2.getBoundingClientRect().bottom
                        && (missle.getBoundingClientRect().left - 5) >= tank2.getBoundingClientRect().left
                        ){
                            
                            // missle.style.background = 'black'  for early testing
                            
                            missle.remove()
                            tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                        }
                
                
                    if(trajector >= 400){
                        missle.remove()
                    
                        
                    }
            }, 20)}
            if(facing === 'right'){setInterval( ()=>{
                trajector += 20
                    
                
                        missle.style.transform = `translateX(${trajector}px)`
                    
                        if((missle.getBoundingClientRect().left ) >= tank2.getBoundingClientRect().left
                        && (missle.getBoundingClientRect().top) >= tank2.getBoundingClientRect().top
                        && (missle.getBoundingClientRect().bottom) <= tank2.getBoundingClientRect().bottom
                        && (missle.getBoundingClientRect().right) <= tank2.getBoundingClientRect().right
                        ){
                            
                            // missle.style.background = 'black'  for early testing
                            
                            missle.remove()
                            tank2.style.opacity = `${((((tank2.style.opacity * 10) - 1) / 10))}`
                        }
                
                
                    if(trajector >= 400){
                        missle.remove()
                    
                        
                    }
            }, 20)}
        }






        if(which === 2 && fire2 === true){
                //calculate missle position based on tank position
                const missle2 = document.createElement('div')
                missle2.classList.add('missle')
                //shoot a missle from tank center
                missle2.style.top = `${position.top + 17}px`
                missle2.style.left = `${position.left + 17}px`
                //missle must be appended to MAP not to tank
                map.appendChild(missle2)
                let trajector = 0
            if(facing2 === 'up'){
                setInterval( ()=>{
                    trajector += 20
                        
                        
                            missle2.style.transform = `translateY(-${trajector}px)`
                            
                            if((missle2.getBoundingClientRect().top) <= tank.getBoundingClientRect().bottom
                            && (missle2.getBoundingClientRect().left - 18) <= tank.getBoundingClientRect().right
                            && (missle2.getBoundingClientRect().left - 5) >= tank.getBoundingClientRect().left
                            && (missle2.getBoundingClientRect().top) >= tank.getBoundingClientRect().top
                            ){
                                
                                tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                                missle2.remove()
                            }    
                        
                    
                    
                        if(trajector >= 400){
                            missle2.remove()
                            
                            
                        }
                }, 20)
            }
            
            
            if(facing2 === 'down'){setInterval( ()=>{
                trajector += 20
                    
                
                        missle2.style.transform = `translateY(${trajector}px)`

                        if((missle2.getBoundingClientRect().top) >= tank.getBoundingClientRect().top
                        && (missle2.getBoundingClientRect().left - 18) <= tank.getBoundingClientRect().right
                        && (missle2.getBoundingClientRect().left - 5) >= tank.getBoundingClientRect().left
                        && (missle2.getBoundingClientRect().top - 10) <= tank.getBoundingClientRect().bottom
                        ){
                            
                            // missle.style.background = 'black'  for early testing
                            
                            missle2.remove()
                            tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                        }
                
                
                    if(trajector >= 400){
                        missle2.remove()
                    
                        
                    }
            }, 20)}
            if(facing2 === 'left'){setInterval( ()=>{
                trajector += 20
                    
                
                        missle2.style.transform = `translateX(-${trajector}px)`
                    
                        if((missle2.getBoundingClientRect().left) <= tank.getBoundingClientRect().right
                        && (missle2.getBoundingClientRect().top + 10) >= tank.getBoundingClientRect().top
                        && (missle2.getBoundingClientRect().top + 0) <= tank.getBoundingClientRect().bottom
                        && (missle2.getBoundingClientRect().left - 5) >= tank.getBoundingClientRect().left
                        ){
                            
                            // missle.style.background = 'black'  for early testing
                            
                            missle2.remove()
                            tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                        }
                
                
                    if(trajector >= 400){
                        missle2.remove()
                    
                        
                    }
            }, 20)}
            if(facing2 === 'right'){setInterval( ()=>{
                trajector += 20
                    
                
                        missle2.style.transform = `translateX(${trajector}px)`
                    
                        if((missle2.getBoundingClientRect().left ) >= tank.getBoundingClientRect().left
                        && (missle2.getBoundingClientRect().top) >= tank.getBoundingClientRect().top
                        && (missle2.getBoundingClientRect().bottom) <= tank.getBoundingClientRect().bottom
                        && (missle2.getBoundingClientRect().right) <= tank.getBoundingClientRect().right
                        
                        ){
                            
                            // missle.style.background = 'black'  for early testing
                            
                            missle2.remove()
                            tank.style.opacity = `${((((tank.style.opacity * 10) - 1) / 10))}`
                        }
                
                
                    if(trajector >= 400){
                        missle2.remove()
                    
                        
                    }
            }, 20)}
        }
        
    }












//event listeners
//key down - TRUE
document.addEventListener('keydown', ((e) =>{
    //player 1
    if(e.key === 'ArrowDown'){
        down = true
        right = false
        up = false
        left = false
    }
    else if(e.key === 'ArrowUp'){
        up = true
        right = false
        down = false
        left = false
    }
    else if(e.key === 'ArrowRight'){
        right = true
        down = false
        up = false
        left = false
    }
    else if(e.key === 'ArrowLeft'){
        left = true
        right = false
        up = false
        down = false
    }
    //player 2
    if(e.key === 's'){
        down2 = true
        right2 = false
        up2 = false
        left2 = false
    }
    else if(e.key === 'w'){
        up2 = true
        right2 = false
        down2 = false
        left2 = false
        
    }
    else if(e.key === 'd'){
        right2 = true
        down2 = false
        up2 = false
        left2 = false
    }
    else if(e.key === 'a'){
        left2 = true
        right2 = false
        up2 = false
        down2 = false
    }
}))
//key up - change to FALSE
document.addEventListener('keyup', ((e) =>{
    //player two
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





    function movement(tank1Position, tank2Position){
        //=============VERTICAL MOVEMENT============================
        //access tank Y position on map
        let yPos = parseInt(tank.style.top.slice(0, length -2)) 
        //go down
        if(down){
            //set tank facing
            tank.style.transform = `rotateZ(0deg)`
            facing = 'down'
            
            //stop tank1 if it crashes tank2 from the top
            if(!(tank1Position.bottom <= tank2Position.top && (tank1Position.left <= tank2Position.right && tank1Position.right >= tank2Position.left && tank1Position.bottom >= tank2Position.top))){
               
                yPos += 2
            }



            if(yPos >= mapHeight){  //STOP when it reaches MAP-BOTTOM
                tank.style.top = `${mapHeight}px`
            }else{  //keep going down if there is space
                tank.style.top = `${yPos}px`
            }
        }
        //go up
        if(up){
            tank.style.transform = `rotateZ(180deg)`
            facing = 'up'

            if(!(tank1Position.top <= tank2Position.bottom && (tank1Position.left <= tank2Position.right && tank1Position.right >= tank2Position.left && tank1Position.top >= tank2Position.bottom))){

                yPos -= 2
            }


            if(yPos <= 0){  //STOP when it reaches MAP-TOP
                tank.style.top = `${0}px`
            }else{  //keep going up if there is space
                tank.style.top = `${yPos}px`
            }
        }
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
        //=============HORIZONTAL MOVEMENT============================
        //access tank X position on map
        let xPos = parseInt(tank.style.left.slice(0, length -2))
        //go left
        if(left){
            tank.style.transform = `rotateZ(90deg)`
            facing = 'left'

            if(!(tank1Position.left <= tank2Position.right && (tank1Position.bottom >= tank2Position.top && tank1Position.top <= tank2Position.bottom && tank1Position.left >= tank2Position.right) )){
                
                xPos -= 2
            }
            
            
            
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

            if(!(tank1Position.right <= tank2Position.left && (tank1Position.bottom >= tank2Position.top && tank1Position.top <= tank2Position.bottom && tank1Position.right >= tank2Position.left)) ){
               
                xPos += 2
            }
            
            if(xPos >= mapWidth){  //STOP when it reaches MAP-RIGHT-edge
                tank.style.left = `${mapWidth}px`
            }else{  //keep going right if there is space
                tank.style.left = `${xPos}px`
            }
        }
    
        
    }
    

    function movement2(tank1Position, tank2Position){
        //=============VERTICAL MOVEMENT============================
        //access tank Y position on map
        let yPos = parseInt(tank2.style.top.slice(0, length -2)) 
        //go down
        if(down2){
            tank2.style.transform = `rotateZ(0deg)`
            facing2 = 'down'

            if(!(tank2Position.bottom <= tank1Position.top && (tank2Position.left <= tank1Position.right && tank2Position.right >= tank1Position.left && tank2Position.bottom >= tank1Position.top))){

                
                yPos += 2
            }
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
            if(!(tank2Position.top <= tank1Position.bottom && (tank2Position.left <= tank1Position.right && tank2Position.right >= tank1Position.left && tank2Position.top >= tank1Position.bottom))){

                yPos -= 2
            }
            if(yPos <= 0){  //STOP when it reaches MAP-TOP
                tank2.style.top = `${0}px`
            }else{  //keep going up if there is space
                tank2.style.top = `${yPos}px`
            }
        }
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
        //=============HORIZONTAL MOVEMENT============================
        //access tank X position on map
        let xPos = parseInt(tank2.style.left.slice(0, length -2))
        //go left
        if(left2){
            tank2.style.transform = `rotateZ(90deg)`
            facing2 = 'left'
            if(!(tank2Position.left <= tank1Position.right && (tank2Position.bottom >= tank1Position.top && tank2Position.top <= tank1Position.bottom && tank2Position.left >= tank1Position.right) )){
                
                xPos -= 2
            }
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
            if(!(tank2Position.right <= tank1Position.left && (tank2Position.bottom >= tank1Position.top && tank2Position.top <= tank1Position.bottom && tank2Position.right >= tank1Position.left)) ){
               
                xPos += 2
            }
            if(xPos >= mapWidth){  //STOP when it reaches MAP-RIGHT-edge
                tank2.style.left = `${mapWidth}px`
            }else{  //keep going right if there is space
                tank2.style.left = `${xPos}px`
            }
        }
    
        
    }

    
//MAIN EXECUTOR
setInterval(()=>{
     tank1Position = {
        top:tank.offsetTop,
        left: tank.offsetLeft,
        bottom: tank.offsetTop + 40,
        right: tank.offsetLeft + 40,
    }
     tank2Position = {
        top:tank2.offsetTop,
        left: tank2.offsetLeft,
        bottom: tank2.offsetTop + 40,
        right: tank2.offsetLeft + 40,
    }
    
   
    
   
    //pass current player1 and player2 tanks position to movement function
    movement(tank1Position, tank2Position)
    movement2(tank1Position, tank2Position)
    
    


},10)


