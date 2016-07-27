var realm = require('realm-js');
var server = require('realm-server');

if (process.env.NODE_ENV === 'production') {
   require("./dist/backend/app.js");
} else {
   require("./build/backend.js");
   require("./build/universal.js");
}
realm.start('app.Server');
