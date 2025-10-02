let id = setInterval(()=>{
    console.log("Loading...")
},1000)

setTimeout(()=>{
    console.log("Loaded successfully!")
    clearInterval(id)
},5000)