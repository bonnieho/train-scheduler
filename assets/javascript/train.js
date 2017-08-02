//This ia a class homework assignment created using Javascript, jQuery, and Firebase
// Author: Bonnie L. Hoffman - bonnieho@rice.edu



// Initialize Firebase
  var config = {
    apiKey: "AIzaSyD3H7YyVYpGhKGwuD8_EMESnrtBErMs3z0",
    authDomain: "mytrainscheduler-83071.firebaseapp.com",
    databaseURL: "https://mytrainscheduler-83071.firebaseio.com",
    projectId: "mytrainscheduler-83071",
    storageBucket: "mytrainscheduler-83071.appspot.com",
    messagingSenderId: "499945370935"
  };

  firebase.initializeApp(config);

  var dataRef = firebase.database();

// =============================================================

// SECTION - global variables

// Initial Values
    var name = "";
    var destination = "";
    var firstTime; // started out having this defined as a number, but letting it be a string was easier to parse in the end!
    var frequency = 0;
	

// =============================================================

// SECTION - functions

// Capture Submit Button Click
    $("#add-train").on("click", function(event) {
      event.preventDefault();

      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();

      firstTime = moment($("#first-time-input").val().trim(),'HH:mm');
      frequency = $("#frequency-input").val().trim();

      // Code for the push (pushing new 'record' as a JSON object)
      dataRef.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime.format('HH:mm'),
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

    // Firebase watcher + initial loader 
    dataRef.ref().on("child_added", function(childSnapshot) {

      // TESTING - Log everything that's coming out of snapshot
      // console.log(childSnapshot.val().name);
      // console.log(childSnapshot.val().destination);
      // console.log(childSnapshot.val().firstTime);
      // console.log(childSnapshot.val().frequency);


      // crunching up the time stuff below
      var now = moment();
      // backticks let you perform variable substitution without concatenation
      // console.log(`now: ${now}`);

      var firstTime = childSnapshot.val().firstTime;
      // console.log(`firstTime: ${firstTime}`);

      var frequency = childSnapshot.val().frequency;
      // console.log(`frequency: ${frequency}`);

      var diffTime = now.diff(moment(firstTime, "HH:mm"), "minutes");

      // I had to do this because whenever firstTime is later than now, diffTime is negative and results are wonky
      if (diffTime < 0) {
      	diffTime = now.add(1, 'days').diff(moment(firstTime, "HH:mm"), "minutes");
      }
      // console.log(`diffTime: ${diffTime}`);

      var remainder = diffTime % frequency;
      if (remainder < 0) {
      	remainder += frequency;
      }
      //console.log(`remainder: ${remainder}`);

      var minutesAway = frequency - remainder;
      //console.log(`minutesAway: ${minutesAway}`);

      var nextTime = now.add(minutesAway, "minutes");
      //console.log(`nextTime: ${nextTime}`);

      // list of trains 
      $("#full-train-list").append("<div class='row'><div class='col-lg-3'> " + childSnapshot.val().name +
        " </div><div class='col-lg-3'> " + childSnapshot.val().destination +
        " </div><div class='col-lg-2'> " + childSnapshot.val().frequency +
        " </div><div class='col-lg-2'> " + moment(nextTime).format('HH:mm') + 
      	" </div><div class='col-lg-2'> " + minutesAway + " </div></div>");

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

		
// =============================================================

// SECTION - main processes

	// Move along. Nothing to see here at the moment.
	







