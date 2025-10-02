function multiplyNumbers(a, b) {
  return Math.imul.apply(null, [a, b]);
}

console.log(multiplyNumbers(4, 5)); 
