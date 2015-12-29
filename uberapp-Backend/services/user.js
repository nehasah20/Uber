/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;
//mongoose.connect(mongoURL);


var workSchema = new schema({
	name: String,
	email: {type: String, index: true},
	work: String
});

var placesSchema = new schema({
	name: String,
	email: {type: String, index: true},
	place: String
});

var contactsSchema = new schema({
	name: String,
	email: {type: String, index: true},
	contact: String
});

var educationSchema = new schema({
	name: String,
	email: {type: String, index: true},
	education: String
});

var detailsSchema = new schema({
	name: String,
	email: {type: String, index: true},
	details: String
});

var friendSchema = new schema(
		{
			name: String,
			email: {type: String, index: true},
			friendName: String,
			friendEmail: String,
			isFriend: Boolean
		});

var groups = new schema ({
	groupname : {type: String, index: true},
	isAdmin:Boolean
});

var books = new schema({name: String,
	email: {type: String, index: true},
	bookname: String});

var music = new schema({
	name: String,
	email: {type: String, index: true},
	music: String
});

var sports = new schema({
	name: String,
	email: {type: String, index: true},
	sport: String
});

var userSchema = new schema(
		{
			fname: String,
			lname: String,
			email: {type: String, index: true},
			phone: Number,
			gender: String,
			dob: String,
			password: String,
			work: [workSchema],
			place: [placesSchema],
			education: [educationSchema],
			details: [detailsSchema],
			contacts:[contactsSchema],
			friend: [friendSchema],
			group: [groups],
			books: [books],
			music: [music],
			sports: [sports]
		});

module.exports = mongoose.model('user', userSchema);
