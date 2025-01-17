const fs = require('fs');
//Obtain the environment string passed to the node script
const environment = process.argv[2];

function copyFile(source, target, cb) {
  let cbCalled = false;

  const rd = fs.createReadStream(source);
  rd.on('error', (err) => {
    done(err);
  });
  const wr = fs.createWriteStream(target);
  wr.on('error', (err) => {
    done(err);
  });
  wr.on('close', () => {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

copyFile(
  `./environments/${environment}.ts`,
  './environments/environment.ts',
  () => {},
);
