#!/bin/bash

### Initial Updates

sudo apt-get update

### Install PostgreSQL

sudo apt-get install postgresql

### Configure PostgreSQL

# create a new superuser lubuntu
sudo su postgres -c 'createuser -d -r -s lubuntu'

# creaate the database and set the owner as lubuntu
sudo su postgres -c 'psql --command="create database wait_management_system owner lubuntu;" postgres'

# Load in the pre-existing database
sudo su postgres -c 'psql wait_management_system -f database/wms_data.dump'


### Install the software for the backend

sudo apt install python3-pip

pip install Flask
pip install Flask-Cors

# Append the PATH variable statement to ~/.bashrc
echo "export PATH=\"/home/lubuntu/.local/bin:\$PATH\"" >> ~/.bashrc

### Install psycopg2, the python to postgreSQL database connector

sudo apt install python3-dev libpq-dev

pip install psycopg2

### Install software for the frontend

sudo apt install curl

# Install nvm, node version manager

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

export NVM_DIR="$HOME/.nvm"
# To load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# To load nvm bash completion
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Download node v18.16.0 using nvm

nvm install v18.16.0

nvm use v18.16.0

