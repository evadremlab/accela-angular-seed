# Accela Angular Seed

An AngularJS starter project that uses some of the Automation 8.0 core components.

## Version
1.0.0

## Prerequisites
* [NodeJS](http://nodejs.org/) - for server-side package management, and to enable Grunt build automation
* [Bower](http://bower.io/) - for client-side package management (see "Install Bower and Grunt client" below)

## Tech
* [AngularJS](https://angularjs.org/) - JavaScript MVC framework.
* [angular-ui-router](https://github.com/angular-ui/ui-router) - provides flexible routing with nested views.
* [lodash](https://lodash.com/) - A JavaScript utility library delivering consistency, modularity, performance, and extras.
* [sprintf](https://github.com/alexei/sprintf.js) - sprintf implementation for the browser and node.js.
* [stacktrace](https://github.com/stacktracejs/stacktrace.js/) - Framework-agnostic, micro-library for getting stack traces in all web browsers.

* [Grunt](http://gruntjs.com/) - for build automation and testing.
    * [LESS](http://lesscss.org/) - to enhance our CSS development experience.
    * [JSHint](http://www.jshint.com/docs/) - to ensure consistent coding practices.
    * [WireDep](https://github.com/stephenplusplus/grunt-wiredep) - to inject Bower packages into the source code with Grunt.
    * [Karma](karma-runner.github.io) - to run unit tests.
    * [Protractor](https://angular.github.io/protractor) - to run E2E browsers tests (see below).

## Initial Steps

### Install Bower, the Grunt client, and Protractor for E2E testing (the -g flag makes these globally available)

```
npm install -g bower
npm install -g grunt-cli
npm install -g protractor
```

### Install NodeJS packages defined in "packages.json"
* These are used by the build tools, and are installed into the "node_modules" folder.

```
npm install
```

### Install front-end JavaScript packages defined in "bower.json"
* These include AngularJS, and are installed into the "bower_components" folder.

```
bower install
```

### Run grunt "default" task (defined in "gruntfile.js"
* Compiles .less files to .css, etc...

```
grunt
```

## Testing

### For localhost testing:

```
grunt web_server
```

* and browse to https://localhost:3000/index.html

### For Unit testing:
* run "grunt web_server"
* then run "grunt karma:unit"

### For Protractor E2E testing, run this from the command line:
* webdriver-manager update (not needed every time, but should be run the first time)
* webdriver-manager start
* then run "grunt web_server"
* then run "grunt protractor"
