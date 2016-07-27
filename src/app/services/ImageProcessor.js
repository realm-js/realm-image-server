"use realm";
import im from app.misc;
import lodash as _, path, mkdirp from realm.utils;
import exec from app.misc;
import Config from app;

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

export ImageProcessor;
