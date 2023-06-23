The following are the steps to set up the virtual machine from its initial stage after being downloaded
- every time you run `sudo <your-command> <optional-args>...`, you will be asked to type your password, which is `lubuntu`
- run `sudo apt-get update`
- run `sudo apt install ssh`
- run `ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa`
- Add the file's contents of `~/.ssh/id_rsa.pub` to a new SSH key on your Github Account
    - `cat ~/.ssh/id_rsa.pub`
- run `git clone git@github.com:unsw-cse-comp3900-9900-23T2/capstone-project-3900f18bwhatreallyhappenedjib.git`
- `cd capstone-project-3900f18bwhatreallyhappenedjib`

# To install the database

- run `sudo apt-get install postgresql`
- switch to user 'postgres' by running `sudo su postgres`
- run `createuser --interactive lubuntu`
- press `y` for all questions
- run `psql`
- run `create database wait_management_system owner lubuntu`
- quit with `\q`
- press `Ctrl + D`
- type `psql postgres`
- run `\c wait_management_system lubuntu`

# To run the backend

- run `sudo apt install python3-pip`
- run `pip install Flask`
- open `nano ~/.bashrc` and add this to the last line of the file:
    - `export PATH = "/home/lubuntu/.local/bin:$PATH"`
- `source ~/.bashrc`
- run server with `python3 server.py`

# To run the frontend

- run `sudo apt install curl`
- run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`
- `source ~/.bashrc`
- to download the latest lts version of node that we are using, do `nvm install v18.16.0`
- run `nvm use v18.16.0`
- `cd ~/capstone-project-3900f18bwhatreallyhappenedjib/frontend/my-app`
- run `npm install`
- run `npm start`
