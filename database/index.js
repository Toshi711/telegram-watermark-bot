import mysql from 'mysql'

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'mysql'
});
 
connection.connect();


export default connection
 