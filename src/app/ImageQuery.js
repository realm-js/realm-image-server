"use realm";
import lodash as _ from realm.utils;

const getNumber = function(n) {
   if (n !== undefined) {
      var num = parseInt(n);
      if (num > 0) {
         return num;
      }
   }
}

class ImageQuery {
   static getParams(opts) {
      var params = {};
      params.width = getNumber(opts.width);
      params.height = getNumber(opts.height);
      params.crop = opts.mode === "crop";
      params.resize = opts.width > 0 || opts.height > 0;
      params.saturate = getNumber(opts.saturate);
      params.blur = getNumber(opts.blur);
      params.quality = getNumber(opts.blue) || 100;
      return params;

   }
}

export ImageQuery;
