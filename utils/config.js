const fs = require("fs");
const path = require('path');
const jsonfile = require("jsonfile");
var filename = path.join(__dirname, "..", "config.json");
var globaldata = {};
module.exports = {
    read: () => {
        try {
            var data = jsonfile.readFileSync(filename);
            globaldata = data;
        } catch (err) {
            log.error("Can't read from the file, aborting...\n Filename : " + filename);
            return;
        }
    },
    data: () => {
        return globaldata;
    },
    write: (ndata) => {
        try {
            jsonfile.writeFileSync(filename, ndata);
            globaldata = ndata;
        } catch (err) {
            log.error("Can't write the file, aborting...\n Filename : " + filename);
            return;
        }
    }

};
