const remote = require('electron').remote;

// Get elements from HTML
const button = document.getElementById('button');
const timeText = document.getElementById('time');

var seconds = 0
var work = false

// runs every 0.1 second
setInterval(incrementTime, 100);

button.onclick = e => {
  // Get most updated value from user preference file
  workTime = remote.getGlobal('timer').workTime
  breakTime = remote.getGlobal('timer').breakTime

  console.log(workTime, breakTime)
  
  // Start Timer
  if(!remote.getGlobal('timer').started){
    start()
  }

  // Stop Timer
  else{
   stop()
  }
}

// Starts timer by setting the start time to the current time
function start() {
  remote.getGlobal('timer').started = true
  remote.getGlobal('timer').start_time = Math.round(new Date() / 1000)
  seconds = 0
  work = true
  timeText.innerHTML = "00:00"
  button.innerText = "Stop";
  button.classList.remove('is-success');
  button.classList.add('is-danger');
}

function stop() {
  remote.getGlobal('timer').started = false
  timeText.innerHTML = "00:00"
  button.innerText = "Start";
  button.classList.remove('is-danger');
  button.classList.add('is-success');
}

// Converts the Seconds to display better
var convertTime = (sec) => {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  return minutes + ":" + seconds;
}

// Runs every 0.1 second, incrementing the seconds past, and the display
// If the timer reaches the worktime or the breaktime, it creates a notification
function incrementTime() {
  if(remote.getGlobal('timer').started){
    // Get time past based on current Time and start Time
    seconds = Math.round(new Date() / 1000) - remote.getGlobal('timer').start_time;
    timeText.innerHTML = convertTime(seconds)
    
    console.log(seconds, workTime * 60)

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
        work = true
        seconds = 0

        let n = new Notification('Times up!', {
          body: 'Back to Work'
        })        
      }     
    }
  }
  // If the timer has to stop for any reason (Change in setting) It will act as if Stop button was pressed
  else{
    stop()
  }
}

