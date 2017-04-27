/**
 * Handle the database
 *
 * @module db
 * @class db
 */
var knex = require('knex')({
    client: 'sqlite3',
    useNullAsDefault: true
});
var sqlite = require("sqlite3");
var handle;
RANK = {
    STUDENT: 0,
    PROF: 1,
    ADMIN: 2
};
STATUS = {
    IN: 1,
    OUT: 2,
    ABS: 3
};
REASON = {
  MILITARY:0,
  DEAD:1,
  OFFICIAL:2,
  DRIVER:3,
  SICKW:4,
  SICKWO:5,
  TREATEMENT:6,
  OTHER:7
};
PROOF = {
  NONE: 0,
  MEDICAL: 1,
  CERTIFICATE: 2,
  CONVOCATION: 3
};
PROOF = {
  NONE: 0,
  MEDICAL: 1,
  CERTIFICATE: 2,
  CONVOCATION: 3
};
LOGS = {
  IN:1,
  OUT:2,
  ABSENT:3,
  SETTIME:4,
  MODTIME:5,
  RESETTIME:6,
  MINIMUMPAUSE:7,
  NOPAUSE:8,
  NOLUNCH:9
}
global.RANK = RANK;
global.STATUS = STATUS;
global.LOGS = LOGS;
module.exports = {
    handle: handle,
    RANK: RANK,
    REASON: REASON,
    PROOF: PROOF,
    STATUS: STATUS,
    LOGS: LOGS,
    /**
     * Init the database
     * @method init
     **/
    init: function() {
        handle = new sqlite.Database("Data.db");
        global.db = handle;
        global.db.prototype = {};
        global.db.prototype.all = function(sql, stdCallback) {
            var res = this.prepare(sql, function(err) {
                return stdCallback(err, rows);
            });
        };

        handle.serialize(function() {
            handle.run(knex.schema.createTableIfNotExists("users", function(table) { //Users table
                table.increments("id").primary();
                table.string("username");
                table.string("password");
                table.integer("rank");
                table.string("fname");
                table.string("lname");
                table.string("dob");
                table.string("email");
                table.string("tag");
                table.blob("pp");
            }).toString());

            handle.run(knex.schema.createTableIfNotExists("students", function(table) { //Student table
                table.increments("id").primary();
                table.integer("userid");
                table.integer("profid");
                table.integer("timeDiff");
                table.integer("timeDiffToday");
                table.string("lastTagTime");
                table.integer("missedPause");
                table.boolean("hadLunch");
                table.string("details");
                table.integer("status");
                table.boolean("isBlocked");
                table.string("project");
                table.string("firstClass");
            }).toString());


            handle.run(knex.schema.createTableIfNotExists("timeoff", function(table) { //timeoff table
                table.increments("id").primary();
                table.string("date1");
                table.string("date2");
                table.string("desc");
            }).toString());
            //TODO Add timediff in the log table
            handle.run(knex.schema.createTableIfNotExists("logs", function(table) { //logs table
                table.increments("id").primary();
                table.integer("studentid");
                table.integer("type");
                table.string("date");
                table.string("class");
                table.string("description");
                table.integer("timeDiff");
                table.integer("timeDiffToday");
            }).toString());

            handle.run(knex.schema.createTableIfNotExists("notifications", function(table) { //notification table
                table.increments("id").primary();
                table.integer("userid");
                table.integer("type");
                table.string("date");
                table.string("message");
                table.boolean("read");
            }).toString());

            handle.run(knex.schema.createTableIfNotExists("class", function(table) { //class table
                table.increments("id").primary();
                table.integer("profid");
                table.string("name");
            }).toString());

        handle.run(knex.schema.createTableIfNotExists("leavereq", function(table) { //leavereq table
            table.increments("id").primary();
            table.integer("studentid");
            table.string("dateFrom");
            table.string("dateTo");
            table.boolean("missedTest");
            table.integer("reason");
            table.string("reasonDesc");
            table.integer("proof");
            table.string("where");

        }).toString());
    });
        handle.get("SELECT * FROM users WHERE rank=2", (err, data) => {
            if (data === undefined) {
                handle.run(knex("users").insert({
                    username: "admin",
                    password: "4194d1706ed1f408d5e02d672777019f4d5385c766a8c6ca8acba3167d36a7b9",
                    rank: RANK.ADMIN,
                    fname: "Administrator",
                    lname: "",
                    dob: "",
                    email: ""
                }).toString()); //password: administrator
            }
        });

    }
};
