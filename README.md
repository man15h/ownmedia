## OwnMedia ##

OwnMedia is a angular version of ownmedia-iitd/proxyfreeiitd as name suggest but this webapp don't include links to Copyrighted content. purpose of this project to explore tmdb API with Firebase. 

### Before setup the project ###
* Ubuntu 14.04 or higher (16.04 recommended)
* Git
* Text editor (atom recommended)
* Money to buy frappe

### This project based on ###

1. AngularJS
1. AngularFire
1. Angular Material
1. Firebase
1. TMDB API


###Running Locally###

*Get TMDB API to setup as your own project. and create a Firebase project on firebase console after that replace initialize
script in index.html . Voila!*

####Note: Node.js is required. So install node.js first (https://nodejs.org/en/download/).####

```
#!zsh

$ sudo apt-get install nodejs 
$ sudo apt-get install npm
```


```
#!zsh

$ npm install -g npm
```
 (use sudo if it says permission denied)


```
#!zsh

$ npm install -g bower
```
 (use sudo if it says permission denied)


```
#!zsh

$ npm install -g gulp
```


```
#!zsh

$ cd /ownmedia
$ npm install bower
$ npm install gulp
```


To run the project.


```
#!zsh

$ gulp
```

#### Errors; ####

1. npm ERR! argv "/usr/bin/nodejs" "/usr/bin/npm" "install" "-g" "npm"


```
#!zsh

$ sudo ln -s "$(which nodejs)" /usr/bin/node
```