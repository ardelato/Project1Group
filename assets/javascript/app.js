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
  $(".signupbtn").on("click", function(event) {
    event.preventDefault();
    console.log("Submitting");
    console.log($("#email").val());
    console.log($("#psw").val());

    fireApp
      .auth()
      .createUserWithEmailAndPassword($("#email").val(), $("#psw").val())
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        console.log(errorCode);
        console.log(errorMessage);
      });
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
