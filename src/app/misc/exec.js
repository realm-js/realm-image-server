"use realm";
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
export execBash;
