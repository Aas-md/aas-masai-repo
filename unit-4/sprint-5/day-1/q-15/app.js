    let input = document.querySelector("input")
    let btn = document.querySelector("button")
    let ul = document.querySelector("ul")

    btn.addEventListener("click", function(){
        if (!input.value.trim()) return
        let li = document.createElement("li")

        let text = document.createElement("span")
        text.textContent = input.value
        
        let completeBtn = document.createElement("button")
        completeBtn.textContent = "Complete"
        // here i used js closure to toggle line-through
        completeBtn.addEventListener("click", function(){
            text.style.textDecoration = text.style.textDecoration === "line-through" ? "" : "line-through"
        })

        let deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete"
        // and here as well I used js closure to delete the item and target the specific li
        deleteBtn.addEventListener("click", function(){
            li.remove()
        })

        li.appendChild(text)
        li.appendChild(completeBtn)
        li.appendChild(deleteBtn)
        ul.appendChild(li)
        input.value = ""
    })