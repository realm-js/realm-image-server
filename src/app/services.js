var mmm = require('mmmagic');
var Magic = mmm.Magic;

realm.module("app.utils.mmm", function() {
   return mmm;
});

realm.module("app.utils.Magic", function() {
   return Magic;
});

realm.module("app.utils.imagemagick", function() {
   return require('imagemagick');
})
