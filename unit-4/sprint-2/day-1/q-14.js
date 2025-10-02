function func(user) {

    let json = JSON.stringify(user)
    let parseObj = JSON.parse(json)
    console.log("Output : ")
    for (let key in parseObj) {
        console.log(`${key}: ${parseObj[key]}`)
    }
}



const user = {
    name: "John Doe",
    age: 25,
    email: "john@example.com",
    isAdmin: false
}
func(user)