## OwnMedia ##

Simple WebApp based on tmdb API with Firebase.

### Before setup the project ###
* Ubuntu 14.04 or higher (16.04 recommended)
* Git
* Text editor (atom recommended)

### This project based on ###

1. AngularJS
1. Angular Material
1. Firebase
1. TMDB API


### Running Locally ###

*Get TMDB API to setup as your own project. and create a Firebase project on firebase console after that replace initialize
script in index.html . Voila!*

#### Note: Node.js is required. So install node.js first (https://nodejs.org/en/download/). ####

```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```


```
$ npm install -g npm
$ npm install -g bower
$ npm install -g gulp
```

(use sudo if it says permission denied)


```
$ cd /ownmedia
$ npm install bower
$ npm install gulp
```


To run the project.


```
$ gulp
```

#### Errors; ####

1. npm ERR! argv "/usr/bin/nodejs" "/usr/bin/npm" "install" "-g" "npm"


```
$ sudo ln -s "$(which nodejs)" /usr/bin/node
```
