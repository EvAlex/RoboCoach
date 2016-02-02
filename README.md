# RoboCoach

[![Build Status](https://api.travis-ci.org/EvAlex/RoboCoach.svg?branch=master)](http://travis-ci.org/EvAlex/RoboCoach)

## Environment Setup
```shell
$ npm install -g webpack jsx-typescript firebase-tools tsd
```

## Develop
* After every `git pull` execute `npm install` and `tsd install`
* `npm start` - starts webpack-dev-server.
* open http://localhost:3333/
* develop, save files and refresh page - webpack-dev-server will recompile everything automatically. Sometimes it may need to terminate it and `npm start` again.

## Deploy
Deploy is performed automatically on push. But Travis CI sometimes hangs before build, so here's the way to do it manually:
```shell
$ npm run deploy
```
Ask [@EvAlex](https://github.com/evalex/) to add you as collaborator on Firebase.

Open https://robocoach.firebaseapp.com/ to verify deployment


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


### Using Atom for development
1. Install [Github Atom](https://atom.io/)
2. Install Atom packages
```shell
$ apm install atom-typescript atom-beautify file-icons linter minimap
```
3. File > Settings (Ctrl + Comma). Choose Themes tab. If you prefer select "One Light" theme both for "UI Theme" and "Syntax Theme".
4. File > Settings (Ctrl + Comma). Choose settings tab. Set "Tab Length" to 4
5. File > Settings (Ctrl + Comma). Choose Packages tab. Find "tree-view" package there. Open its settings. Check "Hide Ignored Names" and "Hide VCS ignored names"


### Using Visual Studio 2015 for development
1. Install [Node Tools for Visual Studio](https://github.com/Microsoft/nodejstools/releases) extension
2. Install [NPM Scripts Task Runner](https://visualstudiogallery.msdn.microsoft.com/8f2f2cbc-4da5-43ba-9de2-c9d08ade4941?SRC=VSIDE) extension
3. Install [WebPack Task Runner](https://visualstudiogallery.msdn.microsoft.com/5497fd10-b1ba-474c-8991-1438ae47012a?SRC=VSIDE) extension

### Using Visual Studio Code for development
#### Show tslint errors only in VS Code
* Hit Ctrl + P
* Run "task tslint-watch"

#### Show webpack errors in VS Code
* Hit Ctrl + P
* Run "task webpack-watch"

#### Kill running task
* Hit Ctrl + shift + P
* Run "Tasks: Terminate Running Task"
