# Description

This is a React JS application for managing an imaginary company that trains squirrels to work in the entertainment industry. See also the companion repo for the ReactJS application: https://github.com/bkrug/dancing-squirrel-api

# Running this program locally through docker

See instructions as recorded in the backend-api's readme:
https://github.com/bkrug/dancing-squirrel-api#running-this-program-locally-through-docker

# Initial Setup without docker

You will need the backend-api running: https://github.com/bkrug/dancing-squirrel-api#initial-setup-without-docker
But you should only need to run `npm install` and `npm start` for this frontend app.

## Helpful commands

Build a docker image
`docker build -t dancing-squirrel-ui -f Dockerfile.dev .`
Run the container
`docker run -p 3626:3626 dancing-squirrel-ui

## How to Dockerize a React Application

https://www.docker.com/blog/how-to-dockerize-react-app/

