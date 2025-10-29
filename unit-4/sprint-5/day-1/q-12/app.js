
let button = document.querySelector("button");
let ul = document.querySelector("ul");
button.addEventListener("click", function() {
   
    let li = document.createElement("li");
    li.textContent = "New Item";
    let length = ul.children.length;
    if (length % 2 == 0) {
        li.style.color = "blue";
        li.style.fontWeight = "bold";
    }else {
        li.style.color = "red";
        li.style.fontStyle = "italic";
    }
    ul.appendChild(li);


});