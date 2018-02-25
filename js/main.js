// Initialize Firebase
var config = {
  apiKey: "AIzaSyA4OTCs6PEmVgEmtqYlSUD5j9Teh--8TWs",
  authDomain: "restaurant-site-81511.firebaseapp.com",
  databaseURL: "https://restaurant-site-81511.firebaseio.com",
  projectId: "restaurant-site-81511",
  storageBucket: "restaurant-site-81511.appspot.com",
  messagingSenderId: "168003809387"
};
firebase.initializeApp(config);

//Connect with database
var database = firebase.database();

var today = new Date();

//RESERVATION
//Make Reservation

var reservationData = {};

//User is not able to select the day before today
function calendar(){


  var date = document.getElementById('date');

  if(!date) {
  	return;
  }

  var today = new Date().toISOString().split('T')[0];

  //return today;
  date.setAttribute('min', today);

}

calendar();


	// when clicked, the name data should be set
	// and all data should be sent to your database

$('.form_reservation').on('submit', function(event) {
//prevent the page to reload
	event.preventDefault();

	//get name from input
	reservationData.name = $('#name').val();
	reservationData.date = new Date($('#date').val()).toString();
	reservationData.time = $('#time-list :selected').text();

	//Validate all fields
	if( (!reservationData.name) &&
		(isNaN(reservationData.date) == true) &&
		($('#time-list')[0].selectedIndex == "") ){


		alert("Please, fill all the fields to confirm the reservation.")

	} else {

		//Clear the fields
		$('#name').val('');
		$('#date').val('');
		$('#time-list').val('');

		var reservationReference = database.ref('reservation');

		reservationReference.push({

			name: reservationData.name,
			date: reservationData.date,
			time: reservationData.time

		});
	}
});

// on initial load and addition of each reservation update the view
database.ref('reservation').on('value', function(snapshot){
	//Grab element to hook
	var reservationList = $('.reservation-list');
	// get data from database
	var reservations = snapshot.val();

    reservationList.empty();
	// iterate (loop) through all comments coming from database call
	for ( var item in reservations) {

    var reservationDate = new Date(reservations[item].date);

    if (reservationDate.getTime() >= today.getTime()) {

    	var reservationUpdated = {
    		name: reservations[item].name,
    		date: reservations[item].date.slice(4,15),
    		time: reservations[item].time,
    		commentId: item
    	};
      // get your template from your script tag
      var source = $("#reservation-template").html();
      // compile template
      var template = Handlebars.compile(source);
      // pass data to template to be evaluated within handlebars
      // as the template is created
      var reservationTemplate = template(reservationUpdated);
    // prepend created templated
      reservationList.prepend(reservationTemplate);
    }
  }
});

//Delete Reservation

$('.reservation-list').on('click', '.delete',  function(e) {
	// Get the ID for the comment we want to update
	var id = $(e.target).parent().parent().data('id');
	// find comment whose objectId is equal to the id we're searching with
	var commentReference = database.ref('reservation/' + id);

	// Use remove method to remove the reservation from the database
	commentReference.remove();

});




// COME DINE WITH US

//Initialize Map

function initMap(){

  // create a new instance of a map
  // configure map with options object
  var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.8054491, lng: -73.9654415},
      zoom: 15,
      scrollwheel: false
    });

  var marker = new google.maps.Marker({
    position: map.center,
    map: map
  });
}

// CUSTOMER REVIEW

//List Customer Review and keep them in the database
$('#customerReview').on('submit', function(event) {

	//Prevent the DOM realod the page
	event.preventDefault();

	//Grab user name and comment
	userName = $('#name_reviewer').val();
	userComment = $('#comment').val();

	if(userName.length == 0) {

		window.alert("Please, inform your name.");
	} else if(userComment.length == 0){
		window.alert("Please, inform write a coment.");

	} else {

  	// clear the user's comment from the input (for UX purposes)
  	$('#name_reviewer').val('');
  	$('#comment').val('');

  	//Create a section for comments in database
  	var commentsReference = database.ref('comments');

  	//save data to the comments
  	commentsReference.push({
  		name: userName,
  		comment: userComment,

		});
	}
});

// Retrieve comments data when page loads nd when comments are added/updated

function getComments(){

	database.ref('comments').on('value', function(results){

		// Get all comments stored in the results we received back from Firebase
		var allComments = results.val();
		//Set an array
		var comments = [];
		// Loop to iterate through all comments coming from database call
		for(var item in allComments){

			// Create an object literal with the data we'll pass to Handlebars
			var context = {

				name: allComments[item].name,
				comment: allComments[item].comment,
				commentId: item
			};

			// Get the HTML from our Handlebars comment template

			var source = $('#comment-template').html();
			// Compile Handlebar template
			var template = Handlebars.compile(source);
			// Pass the data for this comment (context) into the template
			var commentListElement = template(context);
			// push newly created element to array of comments
			comments.push(commentListElement);

		}

		// remove all list items from DOM before appending list items
		$('.list_coments').empty();
		// append each comment to the list of comments in the DOM
		for(var i in comments){

			$('.list_coments').prepend(comments[i]);

		}

	});
}

//When page loads, get comments

getComments();

// CONTACT US Section
	$('#contact_form').on('submit', function(e){

	e.preventDefault();

	// Get data from Contact Us form
	user_name = $('#contact_name').val();
	message = $('#contact_message').val();
	email = $('#contact_email').val();

	if(user_name.length == 0 || message.length == 0 || email.length == 0) {

		window.alert("Please, enter with information in the blank field");
		//$('#result').html("Please, enter with information in hte blank field");

	} else {

  	// Clear inputs
  	$('#contact_name').val('');
  	$('#contact_message').val('');
  	$('#contact_email').val('');


  	window.confirm("Thanks for contacting us " + user_name + ". We will reply your request in 3 work days.");

  	//Create a section for user data in database
  	var contactReference = database.ref('contact_form');

  	//save data to the contact form
  	contactReference.push({

  		name: user_name,
  		message: message,
  		userEmail: email
  	});
	}
});
