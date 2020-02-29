const sql = require("./db.js");

// constructor
const Table = function(table) {
  this.label = table.label;
  this.max_persons = table.max_persons;
};

Table.create = (newTable, result) => {
  sql.query("INSERT INTO Tables SET ?", newTable, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created table: ", { id: res.insertId, ...newTable });
    result(null, { id: res.insertId, ...newTable });
  });
};

Table.getAll = result => {
  sql.query("SELECT * FROM Tables", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tables: ", res);
    result(null, res);
  });
};

Table.getAvailable = result => {

  let query = `SELECT * from Tables WHERE id NOT IN (SELECT tableId from Reservations WHERE DATE(now()) BETWEEN DATE(bookingDateStart) and DATE(bookingDateEnd) )
  `

  sql.query( query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tables: ", res);
    result(null, res);
  });
};

Table.search = (date,persons, result) => {

  let query = `SELECT * from Tables WHERE id NOT IN (SELECT tableId from Reservations WHERE DATE('${date}') BETWEEN DATE(bookingDateStart) and DATE(bookingDateEnd) ) and max_persons > ${persons}
  `

  sql.query( query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tables: ", res);
    result(null, res);
  });
};

Table.findById = (tableId, result) => {
  sql.query(`SELECT * FROM Tables WHERE id = ${tableId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found table: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Table with the id
    result({ kind: "not_found" }, null);
  });
};

Table.updateById = (id, table, result) => {
  sql.query(
    "UPDATE Tables SET label = ?, max_persons = ? WHERE id = ?",
    [table.label, table.max_persons, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Table with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated table: ", { id: id, ...table });
      result(null, { id: id, ...table });
    }
  );
};

Table.remove = (id, result) => {
  sql.query("DELETE FROM Tables WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Table with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted table with id: ", id);
    result(null, res);
  });
};

Table.removeAll = result => {
  sql.query("DELETE FROM Tables", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tables`);
    result(null, res);
  });
};

module.exports = Table;
