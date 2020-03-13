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
var modal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

$(window).on("load", function() {
  // Clicking the Sign Up button will execute the following
  $(".signupbtn").on("click", function(event) {
    event.preventDefault();
    //Reset Error Messages
    $(".input-section")
      .find("small")
      .remove();

    console.group("Submitting");
    console.log("Email: " + $("#email").val());
    console.log("Password: " + $("#psw").val());
    console.log("Repeat Password: " + $("#psw-repeat").val());
    console.groupEnd();

    // Validate that the user enterred the same password
    if ($("#psw").val() == $("#psw-repeat").val()) {
      // Try to sign up the new user with the entered email and passowrd
      fireApp
        .auth()
        .createUserWithEmailAndPassword($("#email").val(), $("#psw").val())
        .catch(function(error) {
          // An error occured when trying to authenticate the new user
          var errorMessage = error.message;
          console.log("Error: " + errorMessage);

          //Email has incorrect syntax
          if (errorMessage === "The email address is badly formatted.") {
            var eMess = $("<small>").text(errorMessage);
            eMess.css({
              display: "inline-block",
              "margin-bottom": "20px",
              color: "red"
            });
            //Display Error
            $("#email-section").append(eMess);
          }
          //Password is not long enough
          else if (
            errorMessage === "Password should be at least 6 characters"
          ) {
            var eMess = $("<small>").text(errorMessage);
            eMess.css({
              display: "inline-block",
              "margin-bottom": "20px",
              color: "red"
            });
            // Display Error
            $("#psw-section").append(eMess);
          }
        });
    }
    //Passwords do not match
    else {
      console.warn("Passwords Do Not Match");
      var eMess = $("<small>").text("Passwords do not match!");
      eMess.css({
        display: "inline-block",
        "margin-bottom": "20px",
        color: "red"
      });

      //Display Error
      $("#psw-repeat-section").append(eMess);
    }
  });

  $(".loginbtn").on("click", function(event) {
    event.preventDefault();
    console.log("Logging In");
    console.log($("#email").val());
    console.log($("#psw").val());

    fireApp
      .auth()
      .signInWithEmailAndPassword($("#email").val(), $("#psw").val())
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);
        // ...
      });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log(user);
        database.ref(user.uid).set({
          currentUserID: user.uid
        });
      } else {
        // No user is signed in.
        console.log("Not signed in");
      }
    });
  });
});
