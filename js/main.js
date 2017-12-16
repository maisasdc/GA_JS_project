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


//Initialize Map in Come Dine with Us session

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

	//List Customer Review and keep them in the database
	$('#customerReview').on('submit', function(event) {

		//Prevent the DOM realod the page
		event.preventDefault();

		//Grab user name and comment
		userName = $('#name_reviewer').val();
		userComment = $('#comment').val();

		console.log(userName);
		console.log(userComment);

		// clear the user's comment from the input (for UX purposes)
		$('#name_reviewer').val('');
		$('#comment').val('');

		//Create a section for comments in database
		var commentsReference = database.ref('comments');

		//save data to the comments
		commentsReference.push({
			name: userName,
			comment: userComment,
			likes: 0
		});
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
					likes: allComments[item].likes,
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

				$('.list_coments').append(comments[i]);

			}
		});
	}

	//When page loads, get comments

	getComments();




