/**
 * http://usejsdoc.org/
 */
var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

client.on("error", function (err) {
    console.log("Error connecting REDIS Cache Server " + err);
});

////client set driver
exports.cacheClients = function(clients) {
	client.set("select * from driver_signup", JSON.stringify(clients));
};

//client set customer

////client set driver
exports.cacheClients = function(clients) {
	client.set("select * from customer_signup", JSON.stringify(clients));
};

//clinet addDriver
exports.cacheClients = function(clients) {
	client.set("select * from driver_signup where d_flag=0", JSON.stringify(clients));
};
//client addCustomer
exports.cacheClients = function(clients) {
	client.set("select * from customer_signup where c_flag=0", JSON.stringify(clients));
};