/**
 * New node file
 */

var session = require('client-sessions');
var mysql = require('../services/mysql');
var mongo = require('../services/mongo');
 mongoURL = 'mongodb://localhost:27017/uberapp';

function handle_request_showBills(msg,callback){
	console.log("in show bills2223333");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("connected at: "+mongoURL);
		var coll = mongo.collection('billings');
		
		coll.find().toArray(function(err,user)
				{
					if(user)
						{
							//req.session.username = user.username;
							//console.log(req.session.username+" is the session");
							//json_response = {"statusCode":200};
						res.statusCode=200;	
						res.data=user;
						callback(null,res);
						}
					else
						{
						console.log("returned false");
						res.statusCode=401;
						callback(null,res);
						}
					//callback(null,res);
				});
	});
	
}
//month//
function handle_request_showMonth(msg,callback){
	console.log("in show bills666");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("connected at: "+mongoURL);
		var coll = mongo.collection('billings');
		
		coll.find({b_month:parseInt(msg.month)}).toArray(function(err,user)
				{
					if(user)
						{
							//req.session.username = user.username;
							//console.log(req.session.username+" is the session");
							//json_response = {"statusCode":200};
							//res.send(user);
						res.statusCode=200;
						res.data=user;
						callback(null,res);
						}
					else
						{
						console.log("returned false");
						//json_responses = {"statusCode" : 401};
						//res.send(json_responses);
						res.statusCode=401;
						callback(null,res);
						}
				})
	});
			}

//year//
function handle_request_showYear(msg,callback){
	console.log("in show year bills"+parseInt(msg.year));
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("connected at: "+mongoURL);
		var coll = mongo.collection('billings');
		
		coll.find({b_year:parseInt(msg.year)}).toArray(function(err,user)
				{
					if(user)
						{
							res.statusCode=200;
							res.data=user;
							callback(null,res);
						}
					else
						{
						console.log(" year returned false");
						res.statusCode=401;
						callback(null,res);
						}
				})
	});
}
//billid//
function handle_request_showBillid(msg,callback){
	console.log("in show bills8888");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("connected at: "+mongoURL);
		var coll = mongo.collection('billings');
		
		coll.find({"b_id":parseInt(msg.b_id)}).toArray(function(err,user)
				{
					if(user)
						{
							//req.session.username = user.username;
							//console.log(user+" is the session");
							//json_response = {"statusCode":200};
							//res.send(user);
						res.statusCode=200;
						res.data=user;
						callback(null,res);
						}
					else
						{
						res.statusCode=401;
						//console.log("returned false billid"+user);
						//json_responses = {"statusCode" : 401};
						//res.send(json_responses);
						callback(null,res);
						}
				})
	});
}

//del//
function handle_request_delSearch(msg,callback){
	console.log("in show bills222");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('billings');
		
		coll.remove({b_id: parseInt(msg.b_id)},function(err, user){
			if(user){
				res.statusCode = 200;
				//res.data = user;
				//console.log("User"+JSON.stringify(user));
				
				
				callback(null,res);		
			}
			else
				{
					res.statusCode = 401;
					callback(null,res);
				}
		})
	});}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function handle_request_showtrips(msg,callback){
	console.log("in show trips");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('billings');
	//	coll.find({b_year:parseInt(msg.year)}).toArray(function(err,user)
		coll.find({c_id: msg.c_id}).toArray(function(err, user){
			if(user){
				console.log(user);
				res.statusCode = 200;
				res.data = user;
				//console.log("User"+JSON.stringify(user));
				callback(null,res);		
			}
			else
				{
					res.statusCode = 401;
					callback(null,res);
				}
		});
	});
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function handle_request_showdrivertrips(msg,callback){
	console.log("in show trips");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('billings');
	//	coll.find({b_year:parseInt(msg.year)}).toArray(function(err,user)
		coll.find({d_id: msg.d_id}).toArray(function(err, user){
			if(user){
				console.log(user);
				res.statusCode = 200;
				res.data = user;
				//console.log("User"+JSON.stringify(user));
				callback(null,res);		
			}
			else
				{
					res.statusCode = 401;
					callback(null,res);
				}
		});
	});
}

///////////////////////////////////////////////GRPAHS//////////////////////////////////////////////////////////////
function handle_request_getgraphs(msg,callback){
console.log("in get graphssssssssssssssssssssssssssssssss");
		var res = {};
			mongo.connect(mongoURL,function(){
				console.log("conected at"+mongoURL);
				var coll = mongo.collection('ride_demo');
				coll.find().toArray(function(err, user){
						if(user){
						console.log(user);
						res.statusCode = 200;
						res.data = user;
						//console.log("User"+JSON.stringify(user));
						callback(null,res);		
						}
				else
				{
				res.statusCode = 401;
				callback(null,res);
				}
			});
		});
}

////////

//ddetailed bill//
function handle_request_detailedBill(msg,callback){
	console.log("in show detailed bill");
	var res = {};
	mongo.connect(mongoURL,function(){
		console.log("conected at"+mongoURL);
		var coll = mongo.collection('billings');
		
		coll.find({"b_id":parseInt(msg.b_id)}).toArray(function(err,user)
				{
					if(user)
						{
							//req.session.username = user.username;
							//console.log(user+" is the session");
							//json_response = {"statusCode":200};
							//res.send(user);
						res.statusCode=200;
						console.log("trial"+JSON.stringify(user));
						res.data=user;
						callback(null,res);
						}
					else
						{
						res.statusCode=401;
						//console.log("returned false billid"+user);
						//json_responses = {"statusCode" : 401};
						//res.send(json_responses);
						callback(null,res);
						}
				})
	});}
//////////////////////////////////////////////////////
exports.handle_request_detailedBill = handle_request_detailedBill;
exports.handle_request_getgraphs =handle_request_getgraphs;
exports.handle_request_showtrips =handle_request_showtrips;
exports.handle_request_showdrivertrips =handle_request_showdrivertrips;
exports.handle_request_delSearch = handle_request_delSearch;
exports.handle_request_showBillid = handle_request_showBillid;
exports.handle_request_showMonth = handle_request_showMonth;
exports.handle_request_showYear = handle_request_showYear;
exports.handle_request_showBills = handle_request_showBills;	