/**
 * http://usejsdoc.org/
 */
//var mongo = require('../services/mongo');
//var mongoURL = 'mongodb://localhost:27017/login1';
var user = require('../services/user');
var mongoose = require('mongoose');
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var bcrypt=require('bcrypt-nodejs');
//var mysql = require('../services/mysql');
//var bcrypt=require('bcrypt-nodejs');

var mysql = require('../services/mysql');
var mongo = require('../services/mongo');
var mongoURL = 'mongodb://localhost:27017/uberapp';
var autoIncrement = require("mongodb-autoincrement");

function handle_request_driversignup(msg,callback){
	
	var res = {};
	console.log("In handle_request_driversignup : "+msg.dfirst_name + " " + msg.dlast_name);
	console.log(JSON.stringify(msg));
	//var password =msg.dpassword;
	var password=bcrypt.hashSync(msg.dpassword);
	var insertUser = "insert into driver_signup SET ?";
	var contact = parseInt(msg.dcontactinfo);
	var data = {d_firstname:msg.dfirst_name,d_lastname:msg.dlast_name,d_emailid:msg.demail,d_state:msg.dstate_name,d_password:password,d_city:msg.dcity_name,d_mobile:contact,d_address:msg.daddress,d_zipcode:msg.dpostalcode};
	var checkemail="select d_emailid from driver_signup where d_emailid='"+msg.demail+"'";
	mysql.fetchData(function(err,results){
		if(results.length>0)
			{
			//throw err;
			res.statusCode=500;
			callback(null,res);
			}
		else
			{
			
			mysql.insertData(function(err,result){
				if(err)
					{
						throw err;
						res.statusCode = 401;
						callback(null,res);
					}
				else
					{
						if(result.insertId > 0)
							{console.log("Driver insert idddddd" + result.insertId);
							/////////////////MONGO INSERT////////////
							
							mongo.connect(mongoURL,function(db){
								console.log("conected at"+mongoURL);
								var coll = mongo.collection('driver');
								 autoIncrement.getNextSequence(db, 'ride_demo', "r_id", function (err, autoIndex) {
									 console.log(JSON.stringify(autoIndex));
								coll.insert({
									//	"d_id": autoIndex,
										"d_id": result.insertId,
										"d_firstname":msg.dfirst_name,
										"d_lastname":msg.dlast_name,
										"d_emailid":msg.demail,
										"d_password":password,
										"d_city":msg.dcity_name,
										"d_mobile":contact,
										"d_address":msg.daddress,
										"d_zipcode":msg.dpostalcode ,
										"d_state":msg.dstate_name,
										"d_flag":0 ,
										"d_ssn":"",
										"d_lat":"",
										"d_lng":"",
										"d_online":0,
										"d_cartype":"",
										"d_carnumber":"",
										"d_video":""
									
								},function(err,result){
									if(err){throw err; res.statusCode = 401; console.log("error in mongo insert"+res.statusCode);callback(null,res);}
									else
										{
										console.log("Ride created");
										res.statusCode = 200;
										//callback(null,res);
										}
									//callback(null,res);
								});
								});
								
							});
							
							
							
							//////////////////////////////////////////
								res.statusCode = 200;
								res.data = msg;
							}
						else
							{
								console.log("error");
								res.statusCode = 401;
							}
						callback(null,res);
					}
			},insertUser,data);
			//callback(null,data);
			}
		
	},checkemail);
		
}


function handle_request_addCarDetails(msg,callback){
	var res={};
	mongo.connect(mongoURL, function() {
		console.log("connected to mongo at " + mongoURL);
		console.log("carname "+msg.d_cartype+" carnumber "+ msg.d_carnumber);
		var coll = mongo.collection('driver');
		coll.update({"d_id":parseInt(msg.d_id)},{
			$set:
				{
					"d_cartype" : msg.d_cartype,
					"d_carnumber" : msg.d_carnumber
				}
		}, function(err, doc) {
			if (err) {
				throw err;
				res.statusCode=401;
			} else {
				/*req.session.userdata = doc;*/
//				console.log(JSON.stringify(req.session.userdata) +" is the session");
				res.statusCode=200;callback(null,res);
			}
		});
	});
	
}

function handle_request_addSSN(msg,callback){
	var res={};
    var updateDriver = "update driver_signup SET ? where d_id='"+msg.d_id+"'";
	var  set = {d_ssn:msg.d_ssn};
	  console.log("update Query SSSN  "+updateDriver);
	  mysql.insertData(function(err,results){
			if(err)
				{	console.log("error"+set);
					throw err;
				}
			else
				{	console.log("Updateeeee SSSN" + JSON.stringify(results));
				    mongo.connect(mongoURL,function(){
					console.log("connected to mongo at " + mongoURL);
					console.log("ssn "+msg.d_ssn+" d_id "+ msg.d_id);
					var coll = mongo.collection('driver');
					coll.update({"d_id":parseInt(msg.d_id)},{
						$set:
							{
								"d_ssn" : msg.d_ssn,
								"d_video":msg.d_video
								
							}
					}, function(err, doc) {
						if (err) {
							res.statusCode=401;
							callback(null,res);
							throw err;
							
							
						} else {
							/*req.session.userdata = doc;*/
//							console.log(JSON.stringify(req.session.userdata) +" is the session");
							res.statusCode=200;callback(null,res);
						}
					});
				});

				}
		},updateDriver,set);
}
exports.handle_request_addSSN=handle_request_addSSN;
exports.handle_request_driversignup = handle_request_driversignup;
exports.handle_request_addCarDetails = handle_request_addCarDetails;