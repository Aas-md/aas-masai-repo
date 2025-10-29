let div  = document.querySelector("div")
let inputColor = document.querySelector("#color")
let inputText = document.querySelector("#text")
let btnColor = document.querySelector("#btn-color")
let btnText = document.querySelector("#btn-text")

btnColor.addEventListener("click", function(){
    let color = inputColor.value
    
    div.style.backgroundColor = color
    if(div.style.backgroundColor != color){
        alert("Please enter a valid color")
    }
})

btnText.addEventListener("click", function(){
    let text = inputText.value
    if(text == '')alert("Please enter some text!")
    div.textContent = text
})  