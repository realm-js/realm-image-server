"use realm";

import appRoot, path, fs, mkdirp from realm.utils;

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

export {
   SOURCE: SOURCE_DIRECTORY,
   PROCESSED: PROCESSED_DIRECTORY
};
