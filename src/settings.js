const remote = require('electron').remote;
const Store = require('./store.js');

const workTime = document.getElementById('workTime');
const breakTime = document.getElementById('breakTime');
var window = remote.getCurrentWindow();

// Create store object to load from user-preference file
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
      workTime: 50,
      breakTime: 10
    }
  });

// Preload Input fields with current work/break Time
workTime.setAttribute("value", remote.getGlobal('timer').workTime);
breakTime.setAttribute("value", remote.getGlobal('timer').breakTime);

// on Save
function save() {
  // Update Global Variable
  remote.getGlobal('timer').workTime = workTime.value
  remote.getGlobal('timer').breakTime = breakTime.value

  // Update File value (For some reason, it won't update the current session)
  store.set('breakTime', breakTime.value);
  store.set('workTime', workTime.value);
  
  // Stop the Current Timer
  remote.getGlobal('timer').started = false
  window.close();
}