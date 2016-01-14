﻿# RoboCoach

## Environment Setup
```shell
$ npm install -g webpack
$ npm install -g jsx-typescript
$ npm install -g firebase-tools
```

## Develop
* `$ npm start` - starts webpack-dev-server.
* open http://localhost:3333/html/
* develop. No need to refresh page - webpack-dev-server will refresh modules inside page automatically

## Deploy
* `firebase deploy`
* open https://robocoach.firebaseapp.com/ to verify deployment


## Tests
* **npm test** - single run unit tests in PhantomJS
* **npm run test-debug** - to run repeated unit tests in PhantomJS after every file change
* **npm run test-browser**- single run unit tests in Chrome
* **npm run test-browser-debug** - to run repeated unit tests after every file change in Chrome with debug option
    * After browser is opened click on "DEBUG" button in top right corner
    * Hit F12 to debug


## Technology stack:
* [Typescript](https://github.com/Microsoft/TypeScript)
* [React](https://github.com/facebook/react)
* [Flux](https://github.com/facebook/flux)
* [Webpack](https://github.com/webpack/webpack)
* [Jasmine](https://github.com/jasmine/jasmine)
* [Karma](https://github.com/karma-runner/karma)
* [CSS modules](https://github.com/css-modules/css-modules)


### Atom integration
```shell
$ apm install atom-typescript
```

### Visual Studio Code integration
#### Show tslint errors only in VS Code
* Hit Ctrl + P
* Run "task tslint-watch"

#### Show webpack errors in VS Code
* Hit Ctrl + P
* Run "task webpack-watch"

####Kill running task
* Hit Ctrl + shift + P
* Run "Tasks: Terminate Running Task"
