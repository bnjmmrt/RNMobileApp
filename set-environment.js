const fs = require('fs');
const path = require('path');

const environment = process.argv[2];
const googleServicesFile = process.argv[3];
const googleServicesInfoPlist = process.argv[4];

function copyFile(source, target, cb) {
  fs.access(source, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`❌ Source file does not exist: ${source}`);
      cb(err);
      return;
    }

    const rd = fs.createReadStream(source);
    const wr = fs.createWriteStream(target);

    rd.on('error', (err) => {
      console.error(`❌ Error reading file ${source}:`, err);
      cb(err);
    });

    wr.on('error', (err) => {
      console.error(`❌ Error writing file ${target}:`, err);
      cb(err);
    });

    wr.on('close', () => {
      console.log(`✅ Successfully copied ${source} → ${target}`);
      cb();
    });

    rd.pipe(wr);
  });
}

copyFile(
  `./environments/${environment}.ts`,
  './environments/environment.ts',
  () => { }
);

copyFile(
  `./environments/${googleServicesFile}.json`,
  './android/app/google-services.json',
  () => { }
);

copyFile(
  `./environments/${googleServicesInfoPlist}.plist`,
  './ios/GoogleService-Info.plist',
  () => { }
);
