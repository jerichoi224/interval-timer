const {app, BrowserWindow, Tray, Menu, nativeImage} = require('electron')
const path = require('path')
const Store = require('./store.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
  }

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    workTime: 50,
    breakTime: 10
  }
});

// The Tray and windows created
let tray = undefined
let window, settings = undefined

// Variable to be able to work on the timer on different windows
global.timer = {
  start_time: Math.round(new Date() / 1000),
  started: false,
  workTime: store.get("workTime"),
  breakTime: store.get("breakTime")
}

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the tray with an icon
  let icon = nativeImage.createFromPath(path.join(__dirname, '/assets/tray-icon.png'))
  tray = new Tray(icon)

  // Add a click handler so that when the user clicks on the menubar icon, it shows the main window
  tray.on('click', function(event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  // Our menu that shows when right-clicked
  const contextMenu = [
    {
       label: 'About',
       // To-Do
       click: function () {
          console.log("Clicked on Help")
       }
    },
    {
      label: 'Settings',
      click: function(){
       createSettings()
      }
   },
   {
     label: 'Quit',
     click: function(){
       app.quit()
     }
   }
 ]
 
 // Bind the menu to right-click
  tray.on('right-click', function(event) {
    tray.popUpContextMenu(Menu.buildFromTemplate(contextMenu))
  });

  // Create the Main Window
  window = new BrowserWindow({
    // width: 800,
    // height: 800,
    width: 250,
    height: 60,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
      }
  })

  window.setIcon(path.join(__dirname, '/assets/icon.png'));
  app.dock.hide();
  window.setAlwaysOnTop(true, "floating");
  window.setVisibleOnAllWorkspaces(true);
  window.setFullScreenable(false);

  // window.webContents.openDevTools()

  // Tell the popup window to load our index.html file
  window.loadFile(path.join(__dirname, 'index.html'));


  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

// Decides the position of the window. Make it look like its popping from the tray
const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// create Settings
const createSettings = () => {
  // Create the Setting Menu, but don't show it.
  settings = new BrowserWindow({
    width: 300,
    height: 160,
    // width: 800,
    // height: 800,
    resizable: false,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
      }
  })

  settings.setIcon(path.join(__dirname, '/assets/icon.png'));
  settings.setFullScreenable(false);

  // Tell the popup window to load our index.html file
  settings.loadFile(path.join(__dirname, 'settings.html'));
  
  // settings.webContents.openDevTools()
}