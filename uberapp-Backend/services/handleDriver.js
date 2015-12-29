/**
 * New node file
 */

var session = require('client-sessions');
var mysql = require('../services/mysql');
var mongo = require('../services/mongo');
mongoURL = 'mongodb://localhost:27017/uberapp';

///devanshi
var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");



client.on("error", function (err) {
    console.log("Error connecting REDIS Cache Server " + err);
});
///
	function handle_request_showDriver(msg,callback){
	
	var res = {};
		
		var getUser="select * from driver_signup where d_flag = 1 order by d_id"; 
		  console.log("in login js "+getUser);
		  //set = {c_emailid:email,c_password:password}
		  mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
						console.log("error"+set);
					}
				else
					{
					console.log("results"+results);
						if(results.length > 0)
							{
							//req.session.data=results;
							console.log("valid in select");
							res.statusCode=200;
							res.data=results;
							}
						else 
							{
								console.log("error");
								res.statusCode=401;
							}

					}callback(null,res);
			},getUser);
	}
	
	
function handle_request_addDriver(msg,callback){
	
	/*var res = {};
	var getUser="select * from driver_signup where d_flag = 0 order by d_id"; 
	console.log("Query is:"+getUser);	
	mysql.fetchData(function(err,results){
					if(!err){
					console.log("Successfully Fetched!");
					console.log("json output..."+JSON.stringify(results));
					res.statusCode=200;
					res.data=JSON.stringify(results);
					res.send({"result":JSON.stringify(results)});
					        }
					        else {
					        	 console.log(err);
					        	res.statusCode=401;
					           
					        }  
				}
		,getUser);*/
	
	
var res = {};
	
	var getUser="select * from driver_signup where d_flag = 0 order by d_id"; 
	  console.log("in login js "+getUser);
	  //set = {c_emailid:email,c_password:password}
	  mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
					console.log("error"+set);
				}
			else
				{
				console.log("results"+results);
					if(results.length > 0)
						{
						//req.session.data=results;
						console.log("valid in select");
						res.statusCode=200;
						res.data=results;
						}
					else 
						{
							console.log("error");
							res.statusCode=401;
						}

				}callback(null,res);
		},getUser);
}


function handle_request_approvedriver(msg,callback){
var d_id = msg.d_id;
var res = {};
var query2 = "update driver_signup set d_flag = 1 where d_id = '"+d_id+"' " ;
	//var getUser="select * from driver_signup where d_flag = 0 order by d_id"; 
	  console.log("in login js approvedriver"+query2);
	  //set = {c_emailid:email,c_password:password}
	  mysql.fetchData(function(err,results){
			if(err)
				{
					throw err;
					console.log("error"+set);
					res.statusCode=401;
				}
			else
				{
						mongo.connect(mongoURL, function() {
							console.log("connected to mongo at " + mongoURL);
							var coll = mongo.collection('driver');
							coll.update({"d_id":d_id},{
								$set:
									{
										"d_flag" : 1
										
									}
							}, function(err, doc) {
								if (err) {
									throw err;
									res.statusCode=401;
								} else {
									console.log("valid in select");
									res.statusCode=200;
									client.del('select * from driver_signup where d_flag=0');
									console.log("Cache Driver Update Delete");
								}callback(null,res);
							})
						});
				
				}//callback(null,res);
		},query2);
}


function handle_request_denydriver(msg,callback){
	var d_id = msg.d_id;
	console.log("msgd_id"+d_id);
	var res = {};
	var query2 = "delete from driver_signup where d_id = '"+d_id+"' " ;
		//var getUser="select * from driver_signup where d_flag = 0 order by d_id"; 
		  console.log("in login js deletedriver"+query2);
		  //set = {c_emailid:email,c_password:password}
		  mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
						console.log("error");
					}
				else
					{
					/*console.log("results"+results);
						if(results.length > 0)
							{
							//req.session.data=results;
		*/						console.log("valid in select");
								res.statusCode=200;
								/*res.data=results;*/
							/*}
						else 
							{
								console.log("error");
								res.statusCode=401;
							}*/

					}callback(null,res);
			},query2);
	}

function handle_request_driverview(msg,callback){
	
	var res = {};
	var getUser="select * from uberapp.driver_signup as ds left join (select avg(rating) as rating,d_id from uberapp.driver_ratings  group by d_id) as dr on dr.d_id = ds.d_id where ds.d_flag=1 ";
	
		console.log("Query isdriverview:"+getUser);	
		  mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
						console.log("error");
					}
				else
					{
					console.log("results"+results);
						if(results.length > 0)
							{
							//req.session.data=results;
							console.log("valid in select"+JSON.stringify(results));
								res.statusCode=200;
								res.data=results;
							}
						else 
							{
								console.log("error");
								res.statusCode=401;
							}

					}callback(null,res);
			},getUser);
	}

function handle_request_driverviewride(msg,callback){
	
	var res = {};
	var getUser="select * from uberapp.driver_signup as ds left join (select avg(rating) as rating,d_id from uberapp.driver_ratings  group by d_id) as dr on dr.d_id = ds.d_id where ds.d_flag=1 and ds.d_online = 1";
	
		console.log("Query isdriverview:"+getUser);	
		  mysql.fetchData(function(err,results){
				if(err)
					{
						throw err;
						console.log("error");
					}
				else
					{
					console.log("results"+results);
						if(results.length > 0)
							{
							//req.session.data=results;
							console.log("valid in select"+JSON.stringify(results));
								res.statusCode=200;
								res.data=results;
							}
						else 
							{
								console.log("error");
								res.statusCode=401;
							}

					}callback(null,res);
			},getUser);
	}

exports.handle_request_showDriver = handle_request_showDriver;
exports.handle_request_driverview=handle_request_driverview;
exports.handle_request_driverviewride=handle_request_driverviewride;
exports.handle_request_denydriver=handle_request_denydriver;
exports.handle_request_approvedriver=handle_request_approvedriver;
exports.handle_request_addDriver = handle_request_addDriver;