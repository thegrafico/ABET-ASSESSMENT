var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

var general_queries = require('../../helpers/queries/general_queries');

function create_perC(data, callback){

  // function to find the current order of the selected outcome
  findOrder(data, function (err, results){
    if (err) {
      return callback(err, null)
    };
    // if the counted orders are <= 5 then you can add a new performance Criteria
    if (parseInt(results[0].orderC) < 5){

      // reorganizing the data available for the insert query
      // data[0] is description, data[1] is outc_ID
      // results[0].orderC is the current counted order
      let newData = [data[0], parseInt(results[0].orderC+1), data[1]];

      // function to insert a new performance Criteria
      insert_perC(newData, function (err, results_insert){
        if (err) {
          return callback(err, null)
        };
        // returns the values
        return callback(null, results);
      });
    }
    else{
      return callback(null, null);
    }
  });
}

// function to insert a new performance Criteria
function insert_perC(data, callback) {

  // variable that defines the query
  let insert_query = `insert into PERF_CRITERIA (perC_Desk, perC_order, outc_ID) values(?, ?, ?);`;

  // query to insert new a Performance Criteria
  conn.query(insert_query, data, function (err, results, fields) {
    if (err) {
      return callback(err, null)
    };
    // console.log(results)
    return callback(null, results);
  });
}

// function that has the query to find the current order
function findOrder(data, callback) {

  // query to finde the current order
  let findOrder_query = `SELECT count(perC_order) as orderC
                         FROM PERF_CRITERIA
                         where outc_ID = ?`;

  // counts each results by the outc_ID to get the current order
  // data[0] is description, data[1] is outc_ID
  conn.query(findOrder_query, data[1], function (err, results, fields) {
    if (err) {
      return callback(err, null)
    };
    // return the values
    return callback(null, results);
  });
}

function update_perfCriteria(data, callback) {
    // `Insert values into the table department`
    // outc_ID, outc_name, outc_description, date_created, prog_ID
    console.log(data);
    let update_query = `update PERF_CRITERIA
                        set perC_Desk = ?, outc_ID = ?
                        where perC_ID = ?`;

    conn.query(update_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

// module.exports.insert_perC = insert_perC;
// module.exports.findOrder = findOrder;
module.exports.create_perC = create_perC;
module.exports.update_perfCriteria = update_perfCriteria;
