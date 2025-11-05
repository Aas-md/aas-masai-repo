let title = document.querySelector(".title")
let body = document.querySelector(".body")
let button = document.querySelector("button")
const errorEl = document.getElementById('error');


button.addEventListener("click", function (e) {

    e.preventDefault();
    if (title.value === "" || body.value === "") {

        errorEl.textContent = 'All fields are required.';
        return false;
    }

    errorEl.textContent = '';

    sendData()
})

async function sendData() {

    let url = "https://jsonplaceholder.typicode.com/posts"
    try {

        let res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                title: title.value,
                body: body.value,

            }),
        })

        let data = await res.json()


        let div = document.createElement("div");
        div.innerHTML = `
    <h3>ID: ${data.id}</h3>
    <p><strong>Title:</strong> ${title.value}</p>
    <p><strong>Body:</strong> ${body.value}</p>
  `;
        document.body.appendChild(div);
        title.value = "";
        body.value = "";
        console.log("Success:", data);

    } catch (err) {
        console.log("Error:", err)
    }
}