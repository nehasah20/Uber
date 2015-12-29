var session = require('client-sessions');

var mysql = require('../services/mysql');


function handle_request_creditDetailsUpdate(msg,callback){
	
	var res = {};
	console.log("In handle request:"+ msg.c_emailid);
	console.log(JSON.stringify(msg));
		
	var c_cvv=msg.c_cvv;
	  var c_creditcard = msg.c_creditcard;
	  var c_creditmonth = msg.c_creditmonth;
	  var c_credityear = msg.c_credityear;
	  var c_id = msg.c_id;
	 
	  
//var password = bcrypt.hashSync(msg.password);
	
	  var updateCCreditDetails = "update customer_signup SET ? where c_id='"+c_id+"'";
	  set = {c_creditcard:c_creditcard,c_creditmonth:c_creditmonth,c_credityear:c_credityear,c_cvv:c_cvv}
	  console.log("update Quer  "+updateCCreditDetails);
	  mysql.insertData(function(err,results){
			if(err)
				{
					throw err;
					console.log("error"+set);
				}
			else
				{
					

				}callback(null,res);
		},updateCCreditDetails,set);
	  

	  
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


exports.handle_request_creditDetailsUpdate = handle_request_creditDetailsUpdate;