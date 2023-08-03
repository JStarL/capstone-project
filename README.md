# Computer Science Capstone Project Setup Guide

## General

You might find the below links useful to get other information about the project,
otherwise just jump to the 'Setup' section to get started

- Click [here](#setup) to Get Started!

- A list of assumptions can be found [here](ASSUMPTIONS.md)

##  Setup

For the setup of this project, firstly

- We have chosen the Virtual Machine environment, so you will need to download the essentials here:
    - You can download the Virtual Machine Image [here](https://sourceforge.net/projects/linuxvmimages/files/VMware/L/lubuntu_20.04.1_VM.zip/download)
    - You can see the different downloading options for VirtualBox (to run the VM image) [here](https://www.virtualbox.org/wiki/Downloads), depending on your host OS. Please download the software as per your host OS
    - We have tested this on a Windows 11 / 10 system, so it is preferred that you use the same

- Once you have downloaded both the VirtualBox software and the VM image,
    - Please follow [this](https://moodle.telt.unsw.edu.au/pluginfile.php/10307161/mod_resource/content/0/VirtualBoxGuide.pdf) link to see the instructions of how to import the VM image to VirtualBox, and how to initially set up the VM
    - The username and password credentials are both: `lubuntu`

- Once you are logged in as lubuntu:
    - Please download the codebase if you do not already have it (ignore this step if this README.md is within your downloaded respository)
    - We will assume that you have the project in your home directory (prompt will show `lubuntu@lubuntu2004:~/<project-folder-name>$`)

- Now please run the following commands to install the dependencies of this project
    - `sed -i -e 's/\r$//' install.sh`
    - `sudo bash install.sh`
    - Type the password `lubuntu`
    - At every prompt, type `Y` and press `Enter`
    - Also run the following command for the first time only: `source ~/.bashrc`

- For optimum performance, please install the following software by running the following command
    - `sudo apt install virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11`, and type the password `lubuntu`
    - Run this step **after** running `sudo bash install.sh`, otherwise the command may not work

- After installing the above, restart the Virtual Machine and do the following:
    - Start the Virtual Machine
    - log in as `lubuntu`
    - click the small screen button beside the close button at the top-right of the window to make the screen smalll
    - Click on `View -> Virtual Screen 1 -> Scale to 150%` in the toolbar
    - Next click on `View -> Virtual Screen 1 -> Resize to 1920x1080`
    - Now click on the full screen button beside the close button at the top-right of the window to get the optimum screen resolution
    - Keep these settings for the best resolution display of this project's frontend

## Running the project

### For the backend...

... this process is simple. Simply open a new bash terminal and enter the command `cd ~/<project-folder-name>/backend` to navigate to the backend folder
    
- Any time you want to run the server, enter `python3 server.py` on this terminal. It should show some messages and then wait for any HTTP requests

- the default port number is 8880, but please do not change this, as the frontend also requires this precise port number. If you have to use a different port number, enter `python3 server.py <port-no>` and the provided port number will be used as the port for the server. Please then also follow the below instructions to alter the frontend accordingly

- If you wish to use a different port number to run the backend, open the following file using `nano ~/<project-folder-name>/frontend/my-app/src/makeRequest.jsx`, then alter the line which says `const BACKEND_PORT = 8880;` to whatever port you wish (Press `Ctrl + O` to save and then press `Ctrl + X` to quit nano) . Then you can use the same `<port-number>` to run `server.py`

### For the frontend

Open a new bash terminal and navigate to the following folder using `cd ~/<project-folder-name>/frontend/my-app`

- For the first time only, please run `npm install` to install all related `node_modules`

- Then whenever you want to run the frontend, just type `npm start` and the application will open in your web browser

- Please repeat these steps whenever you want to start the frontend, except running `npm install`

