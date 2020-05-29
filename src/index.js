const { nativeImage } = require('electron')
const path = require('path')

const button = document.getElementById('button');
const timeText = document.getElementById('time');

var seconds = 0
var workTime = 50
var breakTime = 10

var running = false
var work = false

setInterval(incrementTime, 1000);

button.onclick = e => {
  // Start
  if(!running){
    seconds = 0
    work = true
    timeText.innerHTML = "00:00"
    button.innerText = "Stop";
    button.classList.remove('is-success');
    button.classList.add('is-danger');
  }

  // Stop
  else{
    timeText.innerHTML = "00:00"
    button.innerText = "Start";
    button.classList.remove('is-danger');
    button.classList.add('is-success');
  }
  running = !running
}

var convertTime = (sec) => {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  return minutes + ":" + seconds;
}

function incrementTime() {
  if(running){
    seconds++;
    console.log(path.join(__dirname, '/assets/icon.png'))

    timeText.innerHTML = convertTime(seconds)

    if(work){
      if(seconds === 60 * workTime){
        work = false
        seconds = 0
  
        let n = new Notification('Take a Break!', {
          body: workTime + ' Minutes Past.'
        })          
      }
    }

    if(!work){
      if(seconds === 60 * breakTime){
        work = false
        seconds = 0

        let n = new Notification('Times up!', {
          body: 'Back to Work'
        })        
      }     
    }

    
  }
}