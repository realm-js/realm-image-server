(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Server",["realm.server.Express", "app.Config"],function(Express, Config){ var $_exports;/* @#realm-source:src/app/Server.js#*/

class Server extends Express {

   configure() {
      this.port = 5050;
      this.addRoute('app.routes', 'realm.router.bridge');
      this.start();
   }
}

$_exports = Server

return $_exports;
});
realm.module("app.routes.IndexRoute",["realm.router.decorators.route", "realm.router.decorators.cors", "app.services.ImageServeService", "app.services.ImageUploadService"],function(route, cors, ImageServeService, ImageUploadService){ var $_exports;/* @#realm-source:src/app/routes/IndexRoute.js#*/

class IndexRoute {

   static get($query, $req, $res) {
      return realm.chain(new ImageServeService($query, $req, $res));
   }
   static post() {
      return realm.chain(new ImageUploadService($query, $req, $res));
   }

}

$_exports = IndexRoute;

route(/.*/)(IndexRoute,undefined);
return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());