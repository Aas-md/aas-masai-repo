
async function fetchAndDisplayUserNames() {

    let url = "https://jsonplaceholder.typicode.com/users"

    try {
        let response = await fetch(url)
        let data = await response.json()
        console.log(data)
        let ul = document.querySelector("ul")

        data.forEach(element => {
            let li = document.createElement("li")
            li.textContent = element.name

            li.addEventListener("click", function () {
            alert("User email is : " + element.email)
        })
        li.style.cursor = "pointer"
            ul.appendChild(li)

        });

        
    } catch (err) {
        console.log("Error: ", err)
    }

}


fetchAndDisplayUserNames()