var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
ctx.fillStyle = "#FF0000"
var i = 0;



addEventListener('keypress', (event) => {
    if(event.key == "w"){
        console.log(event.key)
        ctx.translate(0,i--);
    
        ctx.fillRect(100,100,100,100)
    
        

    }
    else if(event.key == "s"){
        console.log(event.key)
        ctx.fillRect(i--,0,100,100)
    }
})
