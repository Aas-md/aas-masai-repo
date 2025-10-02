function filterEvenNumbers(arr){
    let newArr = arr.filter((a)=>(a % 2 == 0))
    return newArr
}

function sumOfArray(arr){
    let sum = arr.reduce((a,curr)=>{return a + curr},0)
    return sum 
}

function sortAndConcat(arr1, arr2){
    
    arr1.sort((a,b)=>a-b)
      arr2.sort((a,b)=>a-b)
     let ans = arr1.concat(arr2)
     return ans.sort((a,b)=>a-b)
}

console.log(filterEvenNumbers([1,2,3,4,5,6,7,8,9,10]))

console.log(sumOfArray([1,2,3,4,5,6,7,8,9,10]))
console.log(sortAndConcat([6,5,2,1],[8,7,3,4]))

