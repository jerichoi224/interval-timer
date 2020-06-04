# Interval Timer
<p align="center">
<img src="src/assets/icon.png" width="30%" height="30%">
</p>

Work timer to setup notification for a specific interval.

### Purpose

This Application was built to help control one's time working on a computer. It notifies the user to make sure to take a break from the screen every once in a while instead of staring into the screen for several hours. 

## Downloads

[MacOS .dmg Download](https://github.com/jerichoi224/interval-timer/raw/master/builds/Interval_Timer.dmg)


## Overview
State shown on menubar when application starts<br>
<img src="screenshots/start_state.png" width="30%" height="30%">

State shown on menubar when started (start button pressed)<br>
<img src="screenshots/running_state.png" width="30%" height="30%">

Notificaiton for finished work time<br>
<img src="screenshots/work_done.png" width="30%" height="30%">

Notificaiton for finished break time<br>
<img src="screenshots/break_done.png" width="30%" height="30%">

## Usage
```
npm install // install external library
npm run start // run in development mode.
```

## To-Do
- Update Settings UI (It looks horrible)
- Add About Section
- Add Window/Linux Build

### Decisions to make
- Should the timer keep running even if the time is updated?

## Update Log
[Click Here](src/update.md)