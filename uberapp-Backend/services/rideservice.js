/**
 * New node file
 */

/**
 * http://usejsdoc.org/
 */

var mysql = require('../services/mysql');
var mongo = require('../services/mongo');
//var mongoURL = 'mongodb://localhost:27017/xxzz';
var mongoURL = 'mongodb://localhost:27017/uberapp';
var autoIncrement = require("mongodb-autoincrement");
var distance = require('google-distance-matrix');

exports.handle_request_request_ride_customer = function(msg,callback)
{
	var res = {};
	console.log("in handle of handle_request_request_ride_customer");
	
	mongo.connect(mongoURL,function(db){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('ride_demo');
		 autoIncrement.getNextSequence(db, 'ride_demo', "r_id", function (err, autoIndex) {
			 console.log(JSON.stringify(autoIndex));
		coll.insert({
				"r_id": autoIndex,
				"origin":msg.origin,
				"destination":msg.destination,
				"origin_addr":"",
				"destination_addr":"",
				"c_id":msg.cid,
				"c_fname":msg.cfname,
				"c_lname":msg.clname,
				"d_id":msg.did,
				"d_fname":msg.dfname,
				"d_lname":msg.dlname,
				"r_distance":0,
				"r_time":0,
				"net_time":0,
				"r_start_time":null ,
				"r_end_time":null ,
				"ride_status":0,
				"r_status":0
			
		},function(err,result){
			if(err){throw err; res.statusCode = 401;}
			else
				{
				/////
				console.log("result ride"+result);
				console.log("result ride JSON"+JSON.stringify(result.ops));
				console.log("result ride JSON 0 "+JSON.stringify(result.ops[0].r_id));

				  var rideentry = "insert into driver_ratings(c_id,d_id,ride_id) values ("+msg.cid + ","+ msg.did+"," +result.ops[0].r_id +" )";
				  console.log("update Quer  "+rideentry);
				  mysql.fetchData(function(err,results){
						if(err)
							{
								throw err;
								console.log("error"+set);
							}
						else
							{
								
							}
					},rideentry);
				  
				  
				  var customerrideentry = "insert into customer_ratings(c_id,d_id,ride_id) values ("+msg.cid + ","+ msg.did+"," +result.ops[0].r_id +" )";
				  console.log("update Quer customer "+customerrideentry);
				  mysql.fetchData(function(err,results){
						if(err)
							{
								throw err;
								console.log("error"+set);
							}
						else
							{
								
							}
					},customerrideentry);
				
				/////
				  
				console.log("Ride created");
				res.statusCode = 200;
				}
			callback(null,res);
		});
		});
		
	});
	};
	
	exports.handle_request_fetchrequest = function(msg,callback){
		var res = {};
		console.log("In handle_request_fetchrequest");
		
		mongo.connect(mongoURL,function(){
			console.log("conected at"+mongoURL);
			var coll = mongo.collection('ride_demo');
			coll.findOne({d_id:parseInt(msg.id),"ride_status":0,c_id:msg.cid},function(err,results){
				if(err){
					throw err;
					res.data = "error";
				}
				else
					{
					res.data = results;
					}
				callback(null,res);
			});
		});
	}
	
	exports.handle_request_start_ride = function(msg,callback){
		var res = {};
		console.log("handle_request_start_ride");
		var did = parseInt(msg.did);
		mongo.connect(mongoURL,function(){
			var coll=mongo.collection('ride_demo');
			var date = new Date();
			
					coll.update({"c_id":msg.cid,"d_id":did,"ride_status":0},{
						$set:
						{"r_start_time":new Date(),"r_status":1}},function(err1,results){
					if(err1){
						throw err;
						res.statusCode=401;
					}	
					else
						{
						console.log("start ride"+parseInt(msg.cid));
						res.statusCode = 200;
						}
					callback(null,res);
					});		
			});
		};
		
exports.handle_request_end_ride = function(msg,callback){
			var res = {};
			var calculatedDist = "";
			var calculatedTime = "";
			var origin_addr = "";
			var destination_addr = "";
			console.log("handle_request_end_ride");
			var did = parseInt(msg.did);
			mongo.connect(mongoURL,function(){
				var coll=mongo.collection('ride_demo');
				var date = new Date();
				
				coll.findOne({"c_id":msg.cid,"d_id":did,"ride_status":0,"r_status":1},function(err1,results){
						if(err1){
							throw err1;
							res.statusCode=401;
						}	
						else
							{
							//console.log("end time"+results.r_);
							//res.statusCode = 200;
							//query2
							var r_end_time=new Date();
							console.log("end_time"+r_end_time.getTime());
							console.log("end_time"+results.r_start_time.getTime());
							var timeDiff = (r_end_time.getTime()-results.r_start_time.getTime())/60000;
							var origin = [results.origin];
							var destination = [results.destination];
							var rideid = results.r_id;
							console.log(results.origin +" "+results.destination + " "+origin);
							distance.matrix(origin,destination,function(err,dist){
								if(!err)
									{
									console.log(JSON.stringify(dist));
									calculatedDist = dist.rows[0].elements[0].distance.value;
									calculatedTime = dist.rows[0].elements[0].duration.value;
									origin_addr = dist.origin_addresses;
									destination_addr = dist.destination_addresses;
									console.log("Distance: " + calculatedDist + " Time: " + calculatedTime);
									
							
							
							coll.update({"c_id":msg.cid,"d_id":did,"ride_status":0,"r_status":1},{								
								$set:
								{"r_end_time":new Date(),"origin_addr":origin_addr,"destination_addr":destination_addr,"r_status":0,"ride_status":1,"r_time":timeDiff,"r_distance":calculatedDist,"net_time":calculatedTime}},function(err2,results1)
								{
								if(err2){
									throw err2;
									res.statusCode=401;
									//callback(null,res);
								}
								else
									{
									//res.statusCode=200;
									//res.rideid = rideid;
								///////////////////offline////////////////////////////////////////////////////
									mongo.connect(mongoURL,function(){
										console.log("conected at"+mongoURL);
										var coll = mongo.collection('driver');
										
										coll.update({d_emailid:msg.email},{$set:{d_online:1}},function(err3,user){
											if(err3){
												res.statusCode = 401;
												//res.data = user;
												console.log("User"+JSON.stringify(user));
												//callback(null,res);		
											}
											else
												{
													res.statusCode = 200;
													res.rideid = rideid;
													
												}
											callback(null,res);
											});
										});
								///////////////////////////////////////////////////////////////////////////
									}
								//callback(null,res);
							});
							//** here **
							}
							});
							}
							});
						
				});	
		};
		
		
/*exports.handle_request_end_ride = function(msg,callback){
	var res = {};
	console.log('handle_request_end_ride');
	var calculatedDist = "";
	var calculatedTime = "";
	console.log("handle_request_end_ride");
	var did = parseInt(msg.did);
	var cid = parseInt(msg.cid);
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection('ride_demo');
		coll.findOne({"c_id":cid,"d_id":did,"ride_status":0,"r_status":1},function(err,results){
			if(err)
				{
				res.statusCode = 401;
				throw err;
				//callback(null,res);
				}
			else
				{
				console.log(JSON.stringify(results));
				res.statusCode = 200;
				res.rideid = results.r_id;
				//callback(null,res);
				}
			callback(null,res);
		});
	});
}*/		
		
exports.handle_request_generate_bill_driver = function(msg,callback){
	var res = {};
	var did = parseInt(msg.did);
	console.log("In handle_request_generate_bill_driver");
	mongo.connect(mongoURL,function(db){
	console.log("connected at: " + mongoURL);
	var coll = mongo.collection('ride_demo');
	coll.findOne({c_id:msg.cid,d_id:did,r_id:msg.rideid,ride_status:1},function(err,results){
		if(err)
			{
			throw err;
			res.statusCode = 401;
			}
		else if(results)
			{
				var base_fare = 2.20;
				var safe_rides_fee = 1.35;
				var vfare = 0;
				var total_fare = 0;
				if((results.net_time / 60) > results.r_time)
					{
					var temp = results.r_distance * 0.000621371;
					vfare = (results.r_time * 0.26) + (temp * 1.30);
					total_fare = base_fare + safe_rides_fee + vfare;
					}
				else if((results.net_time / 60) < results.r_time)
					{
					vfare = (results.net_time / 60) * 0.26;
					total_fare = base_fare + safe_rides_fee + vfare;
					}
				if(total_fare > 0)
					{
					console.log("Amounts: "+ total_fare +" "+vfare+" ");
					var coll = mongo.collection('billings');
					var distance = (results.r_distance) * 0.000621371;
					var time = (results.r_time);
					var date = new Date();
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					autoIncrement.getNextSequence(db, 'billings', "b_id", function (err, autoIndex) {
						 console.log(JSON.stringify(autoIndex));
					coll.insert({
						"b_id": autoIndex,
						"r_id":msg.rideid,
						"origin":results.origin,
						"destination":results.destination,
						"destination_addr":results.destination_addr,
						"origin_addr": results.origin_addr,
						"c_id":msg.cid,
						"c_fname":results.c_fname,
						"c_lname":results.c_lname,
						"d_id":did,
						"d_fname":results.d_fname,
						"d_lname":results.d_lname,
						"distance":distance.toFixed(2),
						"time":time.toFixed(2),
						"amount":total_fare.toFixed(2),
						"base_fare":base_fare ,
						"safe_rides_fee":safe_rides_fee,
						"variable_fee":vfare.toFixed(2),
						"b_date":new Date(),
						"b_year":year,
						"b_month":month
						
					},function(err,result){
						if(err){throw err; res.statusCode = 401;}
						else
							{
							console.log("Ride created");
							res.statusCode = 200;
							res.data = {"b_id": autoIndex,
									"r_id":msg.rideid,
									"origin":results.origin,
									"destination":results.destination,
									"destination_addr":results.destination_addr,
									"origin_addr": results.origin_addr,
									"c_id":msg.cid,
									"c_fname":results.c_fname,
									"c_lname":results.c_lname,
									"d_id":msg.did,
									"d_fname":results.d_fname,
									"d_lname":results.d_lname,
									"distance":distance.toFixed(2),
									"time":time.toFixed(2),
									"amount":total_fare.toFixed(2),
									"base_fare":base_fare ,
									"safe_rides_fee":safe_rides_fee,
									"variable_fee":vfare.toFixed(2),
									"b_date":new Date(),
									"b_year":year,
									"b_month":month};
							}
						callback(null,res);
					});
					});
					}
			}
	});
	});
};		

exports.handle_request_generate_cutomer_Bill = function(msg,callback){
	console.log("handle_request_generate_cutomer_Bill");
	var res = {};
	var did = parseInt(msg.did);
	mongo.connect(mongoURL,function(){
		console.log("connected at: " + mongoURL);
		var coll = mongo.collection('billings');
		coll.findOne({c_id:msg.cid,d_id:did,r_id:msg.rideid},function(err,results){
			if(err)
				{
				throw err;
				res.statucCode = 401;
				}
			else
				{
				console.log(JSON.stringify(results));
				res.statusCode = 200;
				res.data = results;
				}
			callback(null,res);
		});
	});
}

		/*mongo.connect(mongoURL,function(){
			console.log("connected at: " + mongoURL);
			var coll = mongo.collection('ride_demo');
			coll.remove({c_id:msg.cid,d_id:msg.did},function(err,results){
				if(err3)
					{
					throw err;
					res.statusCode = 401;
					}
				else if(results)
					{
					res.statusCode = 200;
					}
				callback(null,res);
			});
		});*/
	