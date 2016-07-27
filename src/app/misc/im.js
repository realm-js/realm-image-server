"use realm";
import imagemagick from app.utils;
import path from realm.utils;

/**
 * Helper class
 *
 */
class Im {

   /**
    * identify
    * Spits out image information
    * { ext: '.jpg', width: 625, height: 625 }
    * @param  {type} filePath description
    * @return {type}          description
    */
   static identify(filePath) {
      return new Promise(function(resolve, reject) {
         imagemagick.identify(['-format', '%wx%h', filePath], function(err, output) {
            if (err) {
               return reject(err);
            }
            var data = output.split("x");
            return resolve({
               ext: path.extname(filePath),
               width: data[0] * 1,
               height: data[1] * 1
            });
         });
      });
   }

   static convert(userOptions) {

      return new Promise(function(resolve, reject) {

         imagemagick.convert(userOptions, function(err, stdout) {
            if (err) {
               return reject(err);
            }
            return resolve(stdout);
         });
      });
   }
}

export Im;
