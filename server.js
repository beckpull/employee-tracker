const CLI = require('./lib/cli');
const pool = require('./lib/pool');

pool.connect();

const cli = new CLI;

cli.run();



