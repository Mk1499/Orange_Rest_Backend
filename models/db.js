const mysql = require("mysql");
const dbConfig = require("../config/db.config");

console.log("Database Configrations : ", dbConfig);


// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

let handleDisconnect= (client) => {
  client.on('error', function (error) {
    if (!error.fatal) return;
    if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;

    console.error('> Re-connecting lost MySQL connection: ' + error.stack);

    // NOTE: This assignment is to a variable from an outer scope; this is extremely important
    // If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
    // to `global.mysqlClient =` in node.
    mysqlClient = mysql.createConnection(client.config);
    handleDisconnect(mysqlClient);
    mysqlClient.connect();
  });
}

handleDisconnect(connection); 
// open the MySQL connection
connection.connect(error => {
  if (error) console.log(error);
  else 
  console.log("Successfully connected to the database.");
});

module.exports = connection;