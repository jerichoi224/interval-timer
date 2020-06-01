const {app, BrowserWindow, Tray, Menu, nativeImage} = require('electron')
const path = require('path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
  }

let tray = undefined
let window = undefined

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the tray with an icon
  let icon = nativeImage.createFromPath(path.join(__dirname, '/assets/tray-icon.png'))
  tray = new Tray(icon)

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  const contextMenu = [
    {
       label: 'Settings',
       click: function () {
          console.log("Clicked on settings")
       }
    },
    
    {
       label: 'About',
       click: function () {
          console.log("Clicked on Help")
       }
    }
 ]

  tray.on('right-click', function(event) {
    tray.popUpContextMenu(Menu.buildFromTemplate(contextMenu))
  });

  // Make the popup window for the menubar
  window = new BrowserWindow({
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

  //   window.webContents.openDevTools()

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
