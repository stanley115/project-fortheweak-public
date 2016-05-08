try{
  var lockFunction =  window.screen.orientation.lock;
  if (lockFunction && lockFunction.call(window.screen.orientation, 'landscape')) {
    console.log('Orientation locked')
  } else {
    console.error('There was a problem in locking the orientation')
  }
}catch(e){
  console.log("No need to fix orientation as on dekstop");
}
