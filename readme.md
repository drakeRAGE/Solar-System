# Solar System 3D Simulation

## Overview
This project is a mobile-responsive web page featuring a 3D simulation of the solar system built with Three.js. It includes the Sun at the center, all eight planets (Mercury to Neptune) orbiting around it, and a control panel to adjust each planet's orbital speed in real-time. The scene is rendered with realistic lighting, camera angles, and smooth animations using pure JavaScript, without CSS animations.

## Screenshots

![image](https://github.com/user-attachments/assets/db32dea6-591b-4d89-b570-6c961933511e)


## Features
- **3D Solar System**: The Sun and eight planets rendered as spheres using Three.js.
- **Orbital Animation**: Planets orbit the Sun at default speeds, animated using THREE.Clock and requestAnimationFrame.
- **Speed Control**: A control panel with sliders for each planet to adjust orbital speeds in real-time.
- **Responsive Design**: Works on desktop and mobile browsers.
- Pause/Resume animation button.
- Background stars.
- Planet labels or tooltips on hover.
- Dark/light theme toggle.
- Camera zoom or movement on click.

## Prerequisites
To run this project, you need:

- A modern web browser (Chrome, Firefox, Safari, Edge).
- A local server to serve the files (e.g., Node.js http-server, Python http.server, or any web server).

## Installation and Setup

- Unzip the Project:
- Extract the contents to a folder.

## Run a Local Server:

- Navigate to the project folder in a terminal.
- Start a local server. For example:
- Using Node.js: npx http-server .
- Using Python: python -m http.server 8000


Open your browser and go to http://localhost:8080 (or the port provided by your server).

or Just use Live server in Vs Code.

## Dependencies:

The project uses Three.js, loaded via CDN in index.html. No additional installations are required.

## Usage

- Open the web page in a browser.
- The 3D solar system will load with planets orbiting the Sun.
- Use the control panel sliders to adjust the orbital speed of each planet.
- Use additional features like Pause/Resume, theme toggle, or camera controls if implemented.
- Hover over planets to see labels/tooltips (if implemented).

## Responsive Design
The application features complete responsive design for all mobile, tablet and desktop sizes.
