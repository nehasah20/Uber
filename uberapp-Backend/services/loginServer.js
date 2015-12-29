/**
 * http://usejsdoc.org/
 */
var mongo = require('../services/mongo');
var mongoURL = 'mongodb://localhost:27017/login1';
var user = require('../services/user');
var mongoose = require('mongoose');
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var bcrypt=require('bcrypt-nodejs');
var mysql = require('../services/mysql');

function handle_request_driverlogin(msg,callback){
	var res = {};
	//console.log("In handle_request_driversignup : "+msg.dfirst_name + " " + msg.dlast_name);
	console.log(JSON.stringify(msg));
	var selectUser = "SELECT * FROM driver_signup where d_emailid = '"+msg.email+"' and d_password = '"+msg.password+"'";
	mysql.fetchData(function(err,result){
		if(err)
			{
				throw err;
				res.statusCode = 401;
				callback(null,res);
			}
		else
			{
				if(result.length > 0)
					{
						res.statusCode = 200;
						res.data = result;
						callback(null,res);
					}
				else
					{
						console.log("error");
						res.statusCode = 401;
						callback(null,res);
					}
				
			}
	},selectUser);
	
}

exports.handle_request_driverlogin = handle_request_driverlogin;