console.log("Begin"); 
setTimeout(() => { console.log("Timeout Task"); }, 0);
 Promise.resolve().then(() => { console.log("Promise Task"); });
  console.log("End");


  // Answer -> 
  // the given order is correct because setTimeout will print immediately since there is no delay(0 second). After that the promise will also resolve immediately and finally end will be printend