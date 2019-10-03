# ChatApp
Real time chat application with emojis and live location sharing feature

Check out the application live at: https://chatapp-akash.herokuapp.com

## Things I learned new while developing this project

1. WebSockets (socketio) module of nodejs
2. Create and maintain private rooms in socketio
3. Client side templating with [mustache-js](https://mustache.github.io/)
4. [BEM](http://getbem.com/naming/) naming conventions
5. Integrate Emojis in application using [emojionearea](https://github.com/mervick/emojionearea)
6. Live locations using browser [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
and many more...

## Running the APP locally

### Prerequisites
1. NodeJS:
Please install NodeJS >= 10.15.0. If you already have it, you're good to go.

2. Yarn:
Visit Yarn download page. Select your Operating system and follow the instructions.

Once you have the [Prerequisites](#prerequisites) covered:

1. Clone this repository from GitHub onto your local computer.

```sh
git clone https://github.com/AkashRajpurohit/ChatApp.git
```

2. Navigate into the project folder and install all of its necessary dependencies with Yarn.

```
cd ChatApp
yarn install
```
3. Start the server
```sh
yarn start
```

## With Docker

1. Clone this repository from GitHub onto your local computer.

```sh
git clone https://github.com/AkashRajpurohit/ChatApp.git
```

> Note: Make sure you have docker installed and currently running as service

2. Navigate into the project folder.
```sh
docker-compose up
```
OR to run in detached mode,
```sh
docker-compose -d up
```

---

After following the steps you can start playing around with it.

You can now visit [http://localhost:4200/](http://localhost:4200/)

---

## Visit my portfolio
[Akash Rajpurohit](https://akashrajpurohit.cf)
