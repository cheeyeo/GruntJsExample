GruntJsExample
==============

Example of using Grunt js with livereload and bower for package management


Setup
=============

Clone this repo. 

Assuming you have grunt and grunt-cli setup, CD into the dir and run:

    npm install

This will install all the node modules into the node_modules directory.

The bower dependencies are within bower.json which is an example file that can be adjusted to fit.

Then run:
    
    bower install


Running it
==============

    grunt server 

Access it at http://localhost:9000.

The server uses livereload so any changes to the assets js and css will be picked up.

There is also an additional task that tracks if the bower.json has changed and if so, also updates the test html files.


