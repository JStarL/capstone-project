The following are the steps to set up the virtual machine from its initial stage after being downloaded
- run `sudo apt-get update`
- run `sudo apt install ssh`
- run `ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa`
- Add the file's contents of `~/.ssh/id_rsa.pub` to a new SSH key on your Github Account
    - `cat ~/.ssh/id_rsa.pub`
- run `git clone git@github.com:unsw-cse-comp3900-9900-23T2/capstone-project-3900f18bwhatreallyhappenedjib.git`
- `cd capstone-project-3900f18bwhatreallyhappenedjib`

# To install the database

- run `sudo apt-get install postgresql`

# To run the frontend

- run `sudo apt install curl`
- run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`
- `source ~/.bashrc`
- to download the latest lts version of node that we are using, do `nvm install v18.16.0`
- run `nvm use v18.16.0`

- `cd ~/capstone-project-3900f18bwhatreallyhappenedjib/frontend/my-app`