
var session = require('client-sessions');

var mysql = require('../services/mysql');
var bcrypt=require('bcrypt-nodejs');

function handle_request_signup(msg,callback){
	
	var res = {};
	console.log("In handle request:"+ msg.email);
	console.log(JSON.stringify(msg));
	  var email = msg.c_emailid;
	  var hash = bcrypt.hashSync(msg.c_password);
	  var firstname = msg.c_firstname;
	  var lastname = msg.c_lastname;
	  var mobile = msg.c_phone;
	  var ssn = msg.c_ssn;
	  var address = msg.c_address;
	  var city = msg.c_city;
	  var state = msg.c_state;
	  var zipcode = msg.c_zipcode;
	  var creditnumber = msg.c_creditcard;
	  var creditcvv = msg.c_cvv;
	  var creditmonth = msg.c_creditmonth;
	  var credityear = msg.c_credityear;
	  var postalcode = msg.c_postalcode;
//var password = bcrypt.hashSync(msg.password);
	
	  var insertCustomer = "insert into customer_signup SET ?";
	  set = {c_firstname:firstname,c_lastname:lastname,c_emailid:email,c_password:hash,c_creditcard:creditnumber,c_cvv:creditcvv,c_phone:mobile,c_ssn:ssn,C_address:address,c_city:city,c_state:state,c_zipcode:zipcode,c_creditmonth:creditmonth,c_credityear:credityear}
	  
	  var checkemail = "select * from customer_signup where c_emailid= '"+email+"'";
	  
	  mysql.fetchData(function(err,results){
		 if(results.length>0)
			 {
			 res.statusCode =500;
			 callback(null,res);
			 }
		 else
			 {
			 mysql.insertData(function(err,results){
					if(err)
						{
							throw err;
							console.log("error"+set);
						}
					else
						{
							if(results.insertId > 0)
								{
								console.log("valid insert");
								/*res.send({
									"statusCode" : 200
								});*/
								res.statusCode=200;
								res.data=msg;
								}
							else 
								{
									console.log(error);
									res.statusCode=401;
								}

						}callback(null,res);
				},insertCustomer,set);

			 }
	  },checkemail);
	  
	  	  
	
}

//login funtion

function handle_request_login(msg,callback)
{
	var res = {};
	var c_email = msg.c_emailid;
	var c_password = msg.c_password;
	
	var findCustomer = "select * from customer_signup where c_emailid='"+c_email+"' ";
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
						if(bcrypt.compareSync(c_password,results.c_password))
							{
						//req.session.data=results;
						console.log("valid inselect");
						res.statusCode=200;
						res.data=results;
							}
						else
							{
							res.statusCode=401;
							}
						}
					else 
						{
							console.log("error");
							res.statusCode=401;
						}

				}callback(null,res);
		},findCustomer);
	

}

exports.handle_request_signup = handle_request_signup;
exports.handle_request_login = handle_request_login;