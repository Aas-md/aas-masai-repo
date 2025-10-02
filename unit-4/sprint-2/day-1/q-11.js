function extractAndReverse(arr){

    let subArr = arr.slice(2,4)
    return subArr.reverse()
    
}

let arr = [15, 30, 45, 60, 75, 90]
console.log(extractAndReverse(arr))