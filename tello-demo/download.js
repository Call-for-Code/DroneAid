const https = require("https");
const fs = require("fs");
const [source, dest] = process.argv.slice(2);
https.get(source, res => res.pipe(fs.createWriteStream(dest)));
