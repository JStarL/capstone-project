#!/bin/bash

### Initial Updates

sudo apt-get update

### Install PostgreSQL

sudo apt-get install postgresql

### Configure PostgreSQL

sudo su postgres

# create a new superuser lubuntu
createuser -d -r -s lubuntu

# creaate the database and set the owner as lubuntu
psql --command='create database wait_management_system owner lubuntu;' postgres

exit

# Load in the pre-existing database
psql wait_management_system -f database/wms_database.dump


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

source ~/.bashrc

# Download node v18.16.0 using nvm

nvm install v18.16.0

nvm use v18.16.0

