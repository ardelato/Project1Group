// run js function after html finish loading
$(function() {
  // run event when button is clicked
  $("#searchBtn").on("click", function(event) {
    // empty previous search data in container
    $("#movie-container").empty();

    event.preventDefault();
    // create var to store user input
    var movie = $("#movie-input")
      .val()
      .trim();
    // search user input and retrive data from OMDb API through AJAX
    var URL = "https://www.omdbapi.com/?s=" + movie + "&apikey=trilogy";

    $.ajax({
      url: URL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      // After retriving all movie with related title, run a for loop to list out all movies

      for (var i = 0; i < response.Search.length; i++) {
        console.log(response.Search[i]);

        var ID = response.Search[i].imdbID;
        console.log(response.Search[i].imdbID);

        // search by ID to get all data we need.

        var URL = "https://www.omdbapi.com/?i=" + ID + "&apikey=trilogy";

        $.ajax({
          url: URL,
          method: "GET"
        }).then(function(response) {
          console.log(response);

          // set each movie with attr: 1) rating, 2) plot, 3) actors, 4) rotten tomatoes scores, 5) poster.

          var movieBtn = $("<button class='movie'>");

          var title = response.Title;

          var pTitle = $("<p>").text("Title: " + title);

          movieBtn.append(pTitle);

          var rating = response.Rated;

          var pRated = $("<p>").text("Rating: " + rating);

          movieBtn.append(pRated);

          var plot = response.Plot;

          var pPlot = $("<p>").text("Plot: " + plot);

          movieBtn.append(pPlot);

          var actors = response.Actors;

          var pActors = $("<p>").text("Actors: " + actors);

          movieBtn.append(pActors);
          // create if else statement to aviod content without ratings not showing in html
          if (response.Ratings.length > 2) {
            var rottenTomatoes = response.Ratings[1].Value;

            var pRottenTomatoes = $("<p>").text(
              "Rotten Tomatoes Score: " + rottenTomatoes
            );

            movieBtn.append(pRottenTomatoes);
          } else {
            var pRottenTomatoes = $("<p>").text(
              "No Rotten Tomatoes Score Available"
            );

            movieBtn.append(pRottenTomatoes);
          }

          var posterURL = response.Poster;

          var pPoster = $("<img>").attr("src", posterURL);

          movieBtn.append(pPoster);

          // store all movie in a container.
          $("#movie-container").append(movieBtn);
        });
      }
    });
  });
});

// FIREBASE Functionality
var firebaseConfig = {
  apiKey: "AIzaSyDvVoaxb3fAckCI9QjeArsJfmx9Bl4nFx4",
  authDomain: "binge-watch-74349.firebaseapp.com",
  databaseURL: "https://binge-watch-74349.firebaseio.com",
  projectId: "binge-watch-74349",
  storageBucket: "binge-watch-74349.appspot.com",
  messagingSenderId: "365798929386",
  appId: "1:365798929386:web:4ace1385f70f2b289bf893"
};
// Initialize Firebase
const fireApp = firebase.initializeApp(firebaseConfig);
var database = firebase.database();

function errorMessage(message, section) {
  var eMess = $("<small>").text(message);
  eMess.css({
    display: "inline-block",
    "margin-bottom": "20px",
    color: "red"
  });
  //Display Error
  section.append(eMess);
}

$(window).on("load", function() {
  // Clicking the Sign Up button will execute the following
  // $(".signupbtn").on("click", function(event) {
  //   event.preventDefault();
  //   //Reset Error Messages
  //   $(".input-section")
  //     .find("small")
  //     .remove();

  //   console.group("Submitting");
  //   console.log("Email: " + $(".email").val());
  //   console.log("Password: " + $(".psw").val());
  //   console.log("Repeat Password: " + $(".psw-repeat").val());
  //   console.groupEnd();

  //   // Validate that the user enterred the same password
  //   if ($(".psw").val() == $(".psw-repeat").val()) {
  //     // Try to sign up the new user with the entered email and passowrd
  //     fireApp
  //       .auth()
  //       .createUserWithEmailAndPassword($(".email").val(), $(".psw").val())
  //       .catch(function(error) {
  //         // An error occured when trying to authenticate the new user
  //         var errorMessage = error.message;
  //         console.log("Error: " + errorMessage);

  //         //Email has incorrect syntax
  //         if (
  //           errorMessage === "The email address is badly formatted." ||
  //           errorMessage ===
  //             "The email address is already in use by another account."
  //         ) {
  //           var eMess = $("<small>").text(errorMessage);
  //           eMess.css({
  //             display: "inline-block",
  //             "margin-bottom": "20px",
  //             color: "red"
  //           });
  //           //Display Error
  //           $(".email-section").append(eMess);
  //         }
  //         //Password is not long enough
  //         else if (
  //           errorMessage === "Password should be at least 6 characters"
  //         ) {
  //           var eMess = $("<small>").text(errorMessage);
  //           eMess.css({
  //             display: "inline-block",
  //             "margin-bottom": "20px",
  //             color: "red"
  //           });
  //           // Display Error
  //           $(".psw-section").append(eMess);
  //         }
  //       });
  //   }
  //   //Passwords do not match
  //   else {
  //     console.warn("Passwords Do Not Match");
  //     var eMess = $("<small>").text("Passwords do not match!");
  //     eMess.css({
  //       display: "inline-block",
  //       "margin-bottom": "20px",
  //       color: "red"
  //     });

  //     //Display Error
  //     $(".psw-repeat-section").append(eMess);
  //   }
  // });

  $("#loginbtn").on("click", function(event) {
    event.preventDefault();

    //Remove current inputs if any
    $(".input-section")
      .find("small")
      .remove();

    // Save email and password to vars to reduce jquery calls
    var email = $(".email").val();
    var passowrd = $(".psw").val();

    console.log("Logging In");
    console.log(email);
    console.log(passowrd);

    //Checks if there is an email
    if (!(email === "")) {
      fireApp
        .auth()
        .signInWithEmailAndPassword(email, passowrd)
        .catch(function(error) {
          // Handle Errors here.
          var eMessage = error.message;

          //Bad Email format
          if (eMessage === "The email address is badly formatted.") {
            errorMessage(eMessage, $(".email-section"));
          }

          //User email not found
          else if (
            eMessage ===
            "There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            errorMessage(
              "No user with this email could be found.",
              $(".email-section")
            );
          }
          //Password is Incorrect
          else if (
            eMessage ===
            "The password is invalid or the user does not have a password."
          ) {
            errorMessage("Incorrect Password", $(".psw-section"));
          }
        });
    }
    // Email has not been entered
    else {
      errorMessage("Please enter an email", $(".email-section"));
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log(user);
        database.ref(user.uid).set({
          currentUserID: user.uid
        });
        window.location.href = "myList.html";
      } else {
        // No user is signed in.
        console.log("Not signed in");
      }
    });
  });
});

// Before the user leaves log them out
window.addEventListener("beforeunload", function(event) {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
});
