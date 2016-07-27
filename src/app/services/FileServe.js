"use realm";
import Magic, mmm from app.utils;
import fs from realm.utils;

class FileServe {

   /**
    * static - Send file magically
    * Automatically detect type if needed
    *
    * @param  {type} file description
    * @param  {type} res  description
    * @return {type}      description
    */
   static send(p, res) {

      var fExtenstion = p.match(/\.(\w{2,4})$/i);
      if (fExtenstion) {
         return res.sendFile(p);
      }

      var magic = new Magic(mmm.MAGIC_MIME_TYPE);
      magic.detectFile(p, function(err, result) {
         if (err) {
            return res.send('err')
         } else {
            var data = fs.readFileSync(p);
            var type = result;
            res.writeHead(200, {
               "Content-Type": type
            });
            res.write(data);
            res.end();
         }
      });
   }
}

export FileServe;
