var session = require('client-sessions');

var mysql = require('../services/mysql');
var mongo = require('../services/mongo');
var mongoURL1 = 'mongodb://localhost:27017/uberapp' ;

function handle_request_getOnlineDrivers(msg,callback){
var res={};
console.log("in handle request:"+msg.task);
var lat = msg.c_lat;
var lng = msg.c_lng;


console.log("devi rad "+lat+"lng"+lng);
////
//console.log("rabbit latlng"+lat);
//console.log("rabbit lng"+lng);

function distance(obj) {
    var R = 6371; // km
    var dLat = (obj.lat2 - obj.lat1) * Math.PI / 180;
    var dLon = (obj.lon2 - obj.lon1) * Math.PI / 180;
    var lat1 = obj.lat1 * Math.PI / 180;
    var lat2 = obj.lat2 * Math.PI / 180;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    var m = d * 0.621371;
    return {
        km: d,
        m: m
    }
}

////
mongo.connect(mongoURL,function(){
	console.log("conected at"+mongoURL1);
	var coll = mongo.collection('driver');
	//var coll = mongo.collection('driver');
	console.log("mongourl in rad : "+mongoURL1);
	coll.find({d_online:1}).toArray(function(err,user){
		if(user){
			console.log("readadada : "+user);
			///
			var rad={};
			var dinradius = [], dist = {}, point = {};
			for (var i = 0; i < user.length; i++) {
				rad = user[i];
			    dist = distance({
			        lat1: lat,
			        lon1: lng,
			        lat2: user[i].d_lat,
			        lon2: user[i].d_lng
			    });
			    console.log("I"+i);
			    if (dist.m < 100000000) {
			        rad.distance = dist.m;
			        dinradius.push(rad);
			    }
			    console.log("10 mile radius........ " + i + " radius " + JSON.stringify(dinradius[i]));
			}
			
			console.log("10 mile radius ouside for. " + JSON.stringify(dinradius));
			
			
			///
			res.statusCode = 200;
			res.data = user;
			res.data1 = dinradius;
			console.log("User"+JSON.stringify(user));
			callback(null,res);		
		}
		else
			{
				res.statusCode = 401;
				callback(null,res);
			}
	});
});
	
};



function handle_request_getSelectedDriver(msg,callback){
	var res={};
	console.log("in handle request:"+msg.task);
	
	var d_id=msg.d_id;
	console.log("driver : "+d_id);
	
	mongo.connect(mongoURL1,function(){
		console.log("conected at"+mongoURL1);
		//var coll = mongo.collection('map_coorditnates');
		var coll = mongo.collection('driver');
		
		coll.findOne({d_id:d_id},function(err,user){
			if(user){
				res.statusCode = 200;
				res.data = user;
				console.log("User"+JSON.stringify(user));
				callback(null,res);		
			}
			else
				{
					res.statusCode = 401;
					callback(null,res);
				}
		});
	});
		
};



function handle_request_getStartRide_queue(msg,callback){
	var res={};
	console.log("in handle request:"+msg.task);
	
	var d_id=msg.d_id;
	console.log("driver : "+d_id);
	
	mongo.connect(mongoURL1,function(){
		console.log("conected at"+mongoURL1);
		//var coll = mongo.collection('map_coorditnates');
		var coll = mongo.collection('driver');
		
		coll.findOne({d_id:d_id},function(err,user){
			if(user){
				res.statusCode = 200;
				res.data = user;
				console.log("User"+JSON.stringify(user));
				callback(null,res);		
			}
			else
				{
					res.statusCode = 401;
					callback(null,res);
				}
		});
	});
		
};



function handle_request_customerUpdate(msg,callback){
	
	var res = {};
	console.log("In handle request:"+ msg.c_emailid);
	console.log(JSON.stringify(msg));
		
	  var c_id=msg.c_id;
	  var email = msg.c_emailid;
	  var password = msg.c_password;
	  var firstname = msg.c_firstname;
	  var lastname = msg.c_lastname;
	  var mobile = msg.c_phone;
	  var address = msg.c_address;
	  var city = msg.c_city;
	  var state = msg.c_state;
	  var zipcode = msg.c_zipcode;
	  
//var password = bcrypt.hashSync(msg.password);
	
	  var updateCustomer = "update customer_signup SET ? where c_id='"+c_id+"'";
	  set = {c_firstname:firstname,c_lastname:lastname,c_emailid:email,c_password:password,c_phone:mobile,C_address:address,c_city:city,c_state:state,c_zipcode:zipcode}
	  console.log("update Quer  "+updateCustomer);
	  mysql.insertData(function(err,results){
			if(err)
				{
					throw err;
					console.log("error"+set);
				}
			else
				{
					

				}callback(null,res);
		},updateCustomer,set);
	  

	  
	  //send back updated customer profile
	  var findCustomer = "select * from customer_signup where c_id='"+c_id+"' ";
	  console.log("in login js "+findCustomer);
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
						console.log("valid inselect"+JSON.stringify(results));
						res.statusCode=200;
						res.data=results;
						}
					else 
						{
							console.log("error");
							res.statusCode=401;
						}

				}callback(null,res);
		},findCustomer);
}




function handle_request_driverUpdate(msg,callback){
	
	var res = {};
	console.log("In handle request:"+ msg.d_emailid);
	console.log(JSON.stringify(msg));
		
	  var d_id=msg.d_id;
	  var email = msg.d_emailid;
	  var password = msg.d_password;
	  var firstname = msg.d_firstname;
	  var lastname = msg.d_lastname;
	  var mobile = msg.d_phone;
	  var address = msg.d_address;
	  var city = msg.d_city;
	  var state = msg.d_state;
	  var zipcode = msg.d_zipcode;
	  
//var password = bcrypt.hashSync(msg.password);
	  console.log("d_id is ...."+d_id);
	  var updateDriver = "update driver_signup SET ? where d_id="+parseInt(d_id);
	  set = {d_firstname:firstname,d_lastname:lastname,d_emailid:email,d_password:password,d_mobile:parseInt(mobile),d_address:address,d_city:city,d_state:state,d_zipcode:zipcode}
	  console.log("update Query "+updateDriver);
	  mysql.insertData(function(err,results){
			if(err)
				{
					throw err;
					console.log(err);
					callback(null,res);
				}
			else if(results)
				{
					console.log("Results after update: " + JSON.stringify(results));
	
					mongo.connect(mongoURL1, function() {
						console.log("connected to mongo at " + mongoURL1);
						var coll = mongo.collection('driver');
						coll.update({"d_id":parseInt(d_id)},{
							$set:
								{
									"d_firstname" : firstname,
									"d_lastname":lastname,
									"d_emailid":email,
									"d_password":password,
									"d_mobile":parseInt(mobile),
									"d_address":address,
									"d_city":city,
									"d_state":state,
									"d_zipcode":zipcode
								}
						}, function(err, doc) {
							if (err) {
								throw err;
							} else {
								/*req.session.userdata = doc;*/
				//				console.log(JSON.stringify(req.session.userdata) +" is the session");
							}
						})
					});
					
				}
		},updateDriver,set);
	  

	  //send back updated customer profile
	  var findDriver = "select * from driver_signup where d_id='"+d_id+"' ";
	  console.log("in login js "+findDriver);
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
						console.log("valid inselect"+JSON.stringify(results));
						res.statusCode=200;
						res.data=results;
						}
					else 
						{
							console.log("error");
							res.statusCode=401;
						}

				}callback(null,res);
		},findDriver);
}


exports.handle_request_driverUpdate = handle_request_driverUpdate;
exports.handle_request_customerUpdate = handle_request_customerUpdate;
exports.handle_request_getOnlineDrivers = handle_request_getOnlineDrivers;
exports.handle_request_getSelectedDriver = handle_request_getSelectedDriver;
exports.handle_request_getStartRide_queue = handle_request_getStartRide_queue;