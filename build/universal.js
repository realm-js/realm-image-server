(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Config",["realm.utils.appRoot", "realm.utils.path", "realm.utils.fs", "realm.utils.mkdirp"],function(appRoot, path, fs, mkdirp){ var $_exports;/* @#realm-source:src/app/Config.js#*/


let IMG_DIRECTORY = process.env.IMG_DIRECTORY;
if (!IMG_DIRECTORY) {
   IMG_DIRECTORY = path.join(appRoot.path, 'images')
}

let ensureDir = (dir) => {
   if (!fs.existsSync(dir)) {
      mkdirp.sync(dir)
   }
}

let SOURCE_DIRECTORY = path.join(IMG_DIRECTORY, 'source')
let PROCESSED_DIRECTORY = path.join(IMG_DIRECTORY, 'processed')
ensureDir(SOURCE_DIRECTORY);
ensureDir(PROCESSED_DIRECTORY);


$_exports = {
   SOURCE: SOURCE_DIRECTORY,
   PROCESSED: PROCESSED_DIRECTORY
};

return $_exports;
});
realm.module("app.ImageQuery",["realm.utils.lodash"],function(_){ var $_exports;/* @#realm-source:src/app/ImageQuery.js#*/

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


$_exports = ImageQuery;

return $_exports;
});
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

realm.module("app.services.FileServe",["app.utils.Magic", "app.utils.mmm", "realm.utils.fs"],function(Magic, mmm, fs){ var $_exports;/* @#realm-source:src/app/services/FileServe.js#*/

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


$_exports = FileServe;

return $_exports;
});
realm.module("app.services.ImageProcessor",["app.misc.im", "realm.utils.lodash", "realm.utils.path", "realm.utils.mkdirp", "app.misc.exec", "app.Config"],function(im, _, path, mkdirp, exec, Config){ var $_exports;/* @#realm-source:src/app/services/ImageProcessor.js#*/

class ImageProcessor {
   constructor(args) {
      this.args = args;

      this.params = args.params;
      this.opts = [this.args.fullPath];
      this.opts.push('-strip');

   }

   /**
    * setImageInfo - setting image information
    * this.imageInfo = { ext: '.jpg', width: 625, height: 625 }
    * @return {type}  object
    */
   setImageInfo() {
      return im.identify(this.args.fullPath);
   }

   /**
    * parseFileName - description
    *
    * @return {type}  description
    */
   parseFileName() {
      this.imageInfo.parsed = path.parse(this.args.originalPath);
   }

   /**
    * ensureWidthAndHeight
    * Make sure we have width and height when trying to resize
    * @return {type}  description
    */
   ensureWidthAndHeight() {
      if (this.params.resize) {
         this.params.width = this.params.width || this.imageInfo.width;
         this.params.height = this.params.height || this.imageInfo.height;
         this.resizeString = this.params.width + 'x' + this.params.height;
      }
   }

   /**
    * setupResize
    *
    * @return {type}  description
    */
   setupResize() {
      if (!this.params.crop) {
         this.opts.push('-resize');
         this.opts.push(this.resizeString);
      }
   }

   /**
    * setupCrop - description
    *
    * @return {type}  description
    */
   setupCrop() {
      if (this.params.crop) {
         this.opts.push('-resize');
         this.opts.push(this.resizeString + "^");
         this.opts.push('-gravity', 'center');
         this.opts.push('-crop', this.resizeString + "+0+0", '+repage');
      }
   }

   /**
    * setupSaturate - description
    *
    * @return {type}  description
    */
   setupSaturate() {
      if (this.params.saturate) {
         this.opts.push('-modulate', "100," + this.params.saturate + ",100");
      }
   }

   /**
    * setupBlur - description
    *
    * @return {type}  description
    */
   setupBlur() {
      if (this.params.blur) {
         this.opts.push('-blur', "0x" + this.params.blur);

      }
   }

   /**
    * setupQuality - description
    *
    * @return {type}  description
    */
   setupQuality() {
      if (this.params.quality) {
         this.opts.push('-quality', this.params.quality);
      }
   }

   /**
    * prepareFiles -
    * Settings up variable
    * this.newFileName = grumpy?width=100&height=100&mode=crop&blur=20.jpg
    * this.newFilePath = /images/processed/test/grumpy?width=100&height=100&mode=crop&blur=20.jpg
    * @return {type}  description
    */
   prepareFiles() {
      var str = this.args.str;

      var targetDir = path.join(Config.PROCESSED, this.imageInfo.parsed.dir)
      mkdirp.sync(targetDir);
      this.newFileName = this.imageInfo.parsed.name + str + (this.imageInfo.parsed.ext ? this.imageInfo.parsed.ext : '')
      this.newFilePath = path.join(targetDir, this.newFileName);
      this.opts.push(this.newFilePath)
   }

   convert() {
      return im.convert(this.opts);
   }

   format() {
      return {
         file: this.newFilePath
      }
   }
}


$_exports = ImageProcessor;

return $_exports;
});
realm.module("app.services.ImageServeService",["realm.utils.lodash", "realm.utils.fs", "realm.utils.path", "app.Config", "app.services.FileServe", "app.services.ImageProcessor", "app.ImageQuery"],function(_, fs, path, Config, FileServe, ImageProcessor, ImageQuery){ var $_exports;/* @#realm-source:src/app/services/ImageServeService.js#*/

class ImageServeService {

   constructor($query, $req, $res) {
      this.query = $query.attrs;
      this.res = $res;
      this.req = $req;
   }

   /**
    * define user paths and initial user request
    */
   defineInitialQuery() {

   }

   setImg() {
      this.requestProcessed = _.keys(this.query).length > 0;
      var original = this.req._parsedUrl.pathname;
      var full = path.join(Config.SOURCE, original);
      var parsed = path.parse(original);
      var str = this.req._parsedUrl.search;
      var cachedPath = this.requestProcessed ?
         path.join(Config.PROCESSED, parsed.dir, parsed.name) + str + (parsed.ext ? parsed.ext : '') : undefined;

      return {
         originalPath: original,
         fullPath: full,
         str: str,
         cachedPath: cachedPath,
         parsed: path.parse(full)
      }
   }

   /**
    * originalFileIsMissing
    * Spit 404 image if a file not found
    *
    * @return {type}  description
    */
   originalFileIsMissing() {
      if (!fs.existsSync(this.img.fullPath)) {
         return this.$break({
            error: "File not found"
         });
      }
   }

   /**
    * trySendingOriginalFile -
    * If original file is there - just send it
    *
    * @return {type}  description
    */
   trySendingOriginalFile() {
      if (!this.requestProcessed) {
         FileServe.send(this.img.fullPath, this.res);
         return this.$kill();
      }
   }

   /**
    * trySendingCachedVersion
    * Sending cached version if present
    *
    * @return {type}  description
    */
   trySendingCachedVersion() {
      // console.log('htere')

      if (fs.existsSync(this.img.cachedPath)) {
         FileServe.send(this.img.cachedPath, this.res);
         return this.$kill();
      }
   }

   setProcessingResult() {

      return realm.chain(new ImageProcessor({
         params: ImageQuery.getParams(this.query),
         str: this.img.str,
         fullPath: this.img.fullPath,
         originalPath: this.img.originalPath
      }))
   }

   serveNewFile() {
      FileServe.send(this.processingResult.file, this.res);
      return this.$kill();
   }
}

$_exports = ImageServeService;

return $_exports;
});
realm.module("app.services.ImageUploadService",[],function(){ var $_exports;/* @#realm-source:src/app/services/ImageUploadService.js#*/

class ImageUploadService {

}

$_exports = ImageUploadService;

return $_exports;
});
realm.module("app.misc.exec",[],function(){ var $_exports;/* @#realm-source:src/app/misc/exec.js#*/
const exec = require('child_process').exec;

let execBash = (cmd) => {
   return new Promise(function(resolve, reject) {
      exec(cmd, (error, stdout, stderr) => {
         if (error) {
            return reject(error);
         }
         return resolve(stdout);
      });
   });
}

$_exports = execBash;

return $_exports;
});
realm.module("app.misc.im",["app.utils.imagemagick", "realm.utils.path"],function(imagemagick, path){ var $_exports;/* @#realm-source:src/app/misc/im.js#*/

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


$_exports = Im;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());