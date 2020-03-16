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
