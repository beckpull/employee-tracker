const CLI = require('./lib/cli');
const pool = require('./lib/pool');
const fs = require('fs');
pool.connect();

const showBanner = async() => {
    fs.readFile('./assets/banner.txt', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    })
};

showBanner();

const cli = new CLI;

setTimeout(function() {
    cli.run()
}, 400);

