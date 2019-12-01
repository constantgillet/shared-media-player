# Shared video player

A simple website with a video player to watch videos together using JavaScript Socket IO

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project requires NodeJS
Follow [this link](https://nodejs.org/en/) to install it



### Installing and lauch the project on your local machine

Follow these steps to install the project on your computer, be sure that NodeJS is installed
Enter these commands into a CMD

Go to the project location:
For example
```
cd C://ThePathToTheProjectLocation
```

Install required modules
```
npm install
```

Now you can launch the server 
```
node app.js
```

Now you can open your internet navigator, the initial port of the project is 8080
[Local host](http://localhost:8080)

## Deploy the server on another network / computer / server

The project is configured to use it in localhost but of course you can put it on a VPS or dedicated server , webhosting server.
You just have to change some IP adress and port.
In video-player.html, at the end

```
Replace "http://127.0.0.1:8080/socket.io/socket.io.js"
By "http://YourIpAdress:TheServerPort/socket.io/socket.io.js"

```
In assets/scripts/main.js
```
Replace "http://localhost:8080"
By "http://YourIpAdress:TheServerPort"

```

In app.js

```
Replace "server.listen(8080)"
By "server.listen(YourNodeJSPort)"

```
## Built With

* [NodeJS](https://nodejs.org/en/) - The web framework used
* [Express](https://expressjs.com/) - Express


## Authors

* **Constant Gillet** - *Project creator, lead developper* - [Constant Gillet](https://github.com/constantgillet)

