/**
 * New node file
 */
/**
 * http://usejsdoc.org/
 */
var mysql = require('../services/mysql');
var mongo = require('../services/mongo');
mongoURL = 'mongodb://localhost:27017/uberapp';

exports.handle_request_goonline = function(msg,callback){
	var res = {};
	console.log("In hadle request of handle_request_goonline");
	mongo.connect(mongoURL,function(){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('driver');
		
		coll.update({d_emailid:msg.email},{$set:{d_online:1}},function(err,user){
			if(err){
				res.statusCode = 401;
				//res.data = user;
				console.log("User"+JSON.stringify(user));
				callback(null,res);		
			}
			else
				{
				
					/////////////////////mysql///////////////////
				
				var goOnline = 'update driver_signup set d_online = "1" where d_emailid = "'+msg.email+'" ';
				  console.log("in goOnline js "+goOnline);
				  //set = {c_emailid:email,c_password:password}
				  mysql.fetchData(function(err,results){
						if(err)
							{
								throw err;
								console.log("error"+set);
							}
						else
							{
/*							console.log("results"+results);
								if(results.length > 0)
									{
									//req.session.data=results;
									console.log("valid inselect");
									res.statusCode=200;
									res.data=results;
									}
								else 
									{
										console.log("error");
										res.statusCode=401;
									}*/
							res.statusCode = 200;
							callback(null,res);

							}callback(null,res);
					},goOnline);
				
					////////////////////////////////////////////
				
					/*res.statusCode = 200;
					callback(null,res);*/
				}
		});
	});
}

exports.handle_request_gooffline = function(msg,callback){
	var res = {};
	console.log("In hadle request of handle_request_gooffline");
	mongo.connect(mongoURL,function(){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('driver');
		
		coll.update({d_emailid:msg.email},{$set:{d_online:0}},function(err,user){
			if(err){
				res.statusCode = 401;
				//res.data = user;
				console.log("User"+JSON.stringify(user));
				callback(null,res);		
			}
			else
				{
/////////////////////mysql///////////////////
				
				var goOffline = 'update driver_signup set d_online = "0" where d_emailid = "'+msg.email+'" ';
				  console.log("in goOffline js "+goOffline);
				  //set = {c_emailid:email,c_password:password}
				  mysql.fetchData(function(err,results){
						if(err)
							{
								throw err;
								console.log("error"+set);
							}
						else
							{
/*							console.log("results"+results);
								if(results.length > 0)
									{
									//req.session.data=results;
									console.log("valid inselect");
									res.statusCode=200;
									res.data=results;
									}
								else 
									{
										console.log("error");
										res.statusCode=401;
									}*/
							res.statusCode = 200;
							callback(null,res);

							}callback(null,res);
					},goOffline);
				
					////////////////////////////////////////////
					/*res.statusCode = 200;
					callback(null,res);*/
				}
		});
	});
}