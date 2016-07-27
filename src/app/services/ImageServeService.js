"use realm";
import lodash as _, fs, path from realm.utils;
import Config from app;
import FileServe, ImageProcessor from app.services;
import ImageQuery from app;

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
export ImageServeService;
