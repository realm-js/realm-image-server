"use realm backend";

import route, cors from realm.router.decorators;
import ImageServeService, ImageUploadService from app.services;
@route(/.*/)
class IndexRoute {

   static get($query, $req, $res) {
      return realm.chain(new ImageServeService($query, $req, $res));
   }
   static post() {
      return realm.chain(new ImageUploadService($query, $req, $res));
   }

}
export IndexRoute;
