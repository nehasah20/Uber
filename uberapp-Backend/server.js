var amqp = require('amqp')

, util = require('util');

//Devanshi Update

var redis = require('redis');
var client = redis.createClient();

////redis client on//client on
client.on('error',function(error)
	{
	 console.log("Error while opening the Socket Connection");	
	});
/////
var login = require('./services/login');
var signup = require('./services/signup');
var dlogin = require('./services/loginServer');
var profileUpdate = require('./services/profileUpdate');
var creditDetailsUpdate=require('./services/creditDetailsUpdate');
var handleDriver = require('./services/handleDriver');
var handleCustomer = require('./services/handleCustomer');
var billing = require('./services/billing');

/*************BOC Pranav 30.11.2015************/

var driverservice = require('./services/driverservice');
var rideservice = require('./services/rideservice');

/************EOC*********************/

var cnn = amqp.createConnection({
	host : '127.0.0.1'
});

cnn.on('ready', function() {
cnn.queue('signup_queue', function(q) {
	console.log("in signup queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		
		if(message.task === "driversignup")
		{
			console.log("In task: "+message.task);
			signup.handle_request_driversignup(message, function(err, res) {
			console.log(JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
		}
		
		else if(message.task === "addCarDetails")
		{
			console.log("In task: "+message.task);
			signup.handle_request_addCarDetails(message, function(err, res) {
			console.log(JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
		}
		else if(message.task === "addSSN")
		{
			console.log("In task: "+message.task);
			signup.handle_request_addSSN(message, function(err, res) {
			console.log(JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
		}
		else{
		login.handle_request_signup(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});}
	});
});

//login queue
cnn.queue('login_queue', function(q) {
	console.log("in login queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		
		if(message.task === "driverLogin")
		{
			console.log("In task: "+message.task);
			dlogin.handle_request_driverlogin(message, function(err, res) {
			console.log("ssss"+JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
		}
		else{
		login.handle_request_login(message, function(err, res) {
			console.log(JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});}
	});
});

///////////////////////////////selected driver data////////////////////


////////////////////////////////////////////////////////

cnn.queue('customerUpdate_queue', function(q) {
	console.log("in customerUpdate_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("devanshi we are here...");
	profileUpdate.handle_request_customerUpdate(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

/**********Pranav 30.11.2015*************/
//driver goonline queue
cnn.queue('driver_goonline_queue', function(q) {
	console.log("in customerUpdate_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		driverservice.handle_request_goonline(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

cnn.queue('driver_gooffline_queue', function(q) {
	console.log("in driver_gooffline_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		driverservice.handle_request_gooffline(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


// ride control

cnn.queue('customer_ride_queue', function(q) {
	console.log("in customer_ride_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		rideservice.handle_request_request_ride_customer(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

//fetch_request_queue
cnn.queue('fetch_request_queue', function(q) {
	console.log("in fetch_request_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		rideservice.handle_request_fetchrequest(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

////detailed bill///
cnn.queue('detailedBill', function(q) {
	console.log("in show bills queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		billing.handle_request_detailedBill(message,function(err, res) {
console.log("JSON trial"+JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});



//start_ride
cnn.queue('start_ride', function(q) {
	console.log("in getOnlineDrivers_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		rideservice.handle_request_start_ride(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

//end_ride

cnn.queue('end_ride_queue', function(q) {
	console.log("in end ride queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		rideservice.handle_request_end_ride(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

//generate_bill_queue_driver
cnn.queue('generate_bill_queue_driver', function(q) {
	console.log("in generate_bill_queue_driver queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		rideservice.handle_request_generate_bill_driver(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

//cutomer_Billing_queue
cnn.queue('cutomer_Billing_queue', function(q) {
	console.log("in generate_bill_queue_driver queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		rideservice.handle_request_generate_cutomer_Bill(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


/********************************************************************************************/

cnn.queue('driverUpdate_queue', function(q) {
	console.log("in driverUpdate_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("devanshi we are here...");
	profileUpdate.handle_request_driverUpdate(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


//credit details update
cnn.queue('creditDetailsUpdate_queue', function(q) {
	console.log("in customerUpdate_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("devanshi we are here...");
	creditDetailsUpdate.handle_request_creditDetailsUpdate(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

//addDriver_queue

cnn.queue('addDriver_queue', function(q) {
	console.log("in addDriver_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
		///addDriver redis
		client.get('select * from driver_signup where d_flag=0',function(error,result){
			if(result)
				{
				console.log("CACHE HIT!!!! "+result);
					// return index sent
		cnn.publish(m.replyTo, result, {
			contentType : 'application/json',
			contentEncoding : 'utf-8',
			correlationId : m.correlationId
				});
				
				}
			else{
				
				handleDriver.handle_request_addDriver(message,function(err, res) {
				
					client.set('select * from driver_signup where d_flag=0',JSON.stringify(res));
					console.log("CACHE MISS server.js res : "+res);
					// return index sent
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});
			}
	});
});

});
//approve Driver

cnn.queue('approvedriver_queue', function(q) {
	console.log("in addDriver_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	handleDriver.handle_request_approvedriver(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


//deny driver
cnn.queue('denydriver_queue', function(q) {
	console.log("in denyDriver_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	handleDriver.handle_request_denydriver(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});




//addCustomer_queue

cnn.queue('addCustomer_queue', function(q) {
	console.log("in addCustomer_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
		
		//addCustomer redis
		client.get('select * from customer_signup where c_flag=0',function(error,result){
			if(result)
				{
				console.log("CACHE HIT!!!! "+result);
					// return index sent
		cnn.publish(m.replyTo, result, {
			contentType : 'application/json',
			contentEncoding : 'utf-8',
			correlationId : m.correlationId
				});
				
				}
			else{
				handleCustomer.handle_request_addCustomer(message,function(err, res) {
					client.set('select * from customer_signup where c_flag=0',JSON.stringify(res));
					// return index sent
					cnn.publish(m.replyTo, res, {
						contentType : 'application/json',
						contentEncoding : 'utf-8',
						correlationId : m.correlationId
					});
				});

			}
		});
		
		});
});


//show customer

cnn.queue('showCustomer_queue', function(q) {
	console.log("in showCustomer_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	//redis Devanshi
		client.get('select * from customer_signup',function(error,result){
			if(result)
				{
				console.log("CACHE HIT!!!! "+result);
					// return index sent
		cnn.publish(m.replyTo, result, {
			contentType : 'application/json',
			contentEncoding : 'utf-8',
			correlationId : m.correlationId
				});
				
				}
			else
				{
		
		
		handleCustomer.handle_request_showCustomer(message,function(err, res) {
			//set cache customer
			
			client.set('select * from customer_signup',JSON.stringify(res));
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		
				});
				}
		});
		//////
		});
	});




//show driver

cnn.queue('showDriver_queue', function(q) {
	console.log("in showDriver_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
		///check cache	
		client.get('select * from driver_signup',function(error,result){
				if(result)
					{
					console.log("CACHE HIT!!!! "+result);
						// return index sent
			cnn.publish(m.replyTo, result, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
					});
					
					}
		else{
	handleDriver.handle_request_showDriver(message,function(err, res) {
			console.log("CACHE MISSS!!!! "+res);
			//set clinet redis call
			//redis.cacheClients(JSON.stringify(res));
			client.set('select * from driver_signup',JSON.stringify(res));
			
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
		}
		});
	});
});



//approve Customer

cnn.queue('approvecustomer_queue', function(q) {
	console.log("in addcustomer_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	handleCustomer.handle_request_approvecustomer(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


//deny Customer

cnn.queue('denycustomer_queue', function(q) {
	console.log("in denyCustomer_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	handleCustomer.handle_request_denycustomer(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


//driverview_queue
cnn.queue('driverview_queue', function(q) {
	console.log("in denyDriver_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	handleDriver.handle_request_driverview(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


//driverviewride_queue
cnn.queue('driverviewride_queue', function(q) {
	console.log("in driverviewride_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("yanki we are here...");
	handleDriver.handle_request_driverviewride(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


cnn.queue('getOnlineDrivers_queue', function(q) {
	console.log("in getOnlineDrivers_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		profileUpdate.handle_request_getOnlineDrivers(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});



cnn.queue('getSelectedDriver_queue', function(q) {
	console.log("in getSelectedDriver_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		profileUpdate.handle_request_getSelectedDriver(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


cnn.queue('getStartRide_queue', function(q) {
	console.log("in getStartRide_queue queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		profileUpdate.handle_request_getStartRide_queue(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


////showBills///
cnn.queue('showBills', function(q) {
	console.log("in show bills queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		billing.handle_request_showBills(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

////showMonth///
cnn.queue('showMonth', function(q) {
	console.log("in show bills queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		billing.handle_request_showMonth(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

////showYear///
cnn.queue('showYear', function(q) {
	console.log("in show bills queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here.11..");
		billing.handle_request_showYear(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});


////showYear///
cnn.queue('showBillid', function(q) {
	console.log("in show bills queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		billing.handle_request_showBillid(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});
////del///
cnn.queue('delSearch', function(q) {
	console.log("in show bills queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("we are here...");
		billing.handle_request_delSearch(message,function(err, res) {

			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});



//////////////////////////////////////////Get Trips/////////////////////////////////////////////////
cnn.queue('customertrips_queue', function(q) {
	console.log("customertrips_queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("We are in customer trips queue.....");
		billing.handle_request_showtrips(message,function(err, res) {
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});
/////////////////////////////////////////////Get Graphs////////////////////////////////////////////////////
cnn.queue('getgraphs_queue', function(q) {
	console.log("getgraphs_queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("We are in customer trips queue.....");
		billing.handle_request_getgraphs(message,function(err, res) {
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

//////////////////////////////////////////Get Driver Trips/////////////////////////////////////////////////
cnn.queue('drivertrips_queue', function(q) {
	console.log("drivertrips_queue");
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		console.log("We are in customer trips queue.....");
		billing.handle_request_showdrivertrips(message,function(err, res) {
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

