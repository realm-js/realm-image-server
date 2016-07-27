"use realm backend";
import Express from realm.server;
import Config from app;

class Server extends Express {

   configure() {
      this.port = 5050;
      this.addRoute('app.routes', 'realm.router.bridge');
      this.start();
   }
}
export Server
