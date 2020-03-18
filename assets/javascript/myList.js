// Pull Firebase Movielist
// Parse the list and make AJAX Calls
// Then create DOM element

function apiCall(id) {
  //Ajax calls
  //Eventually when TV shows are implemented, needs conditional
  var movieQueryURL = "https://www.omdbapi.com/?i=" + id + "&apikey=trilogy";
  $.ajax({
    url: movieQueryURL,
    method: "GET"
  }).then(function(object) {
    console.log(object);
    //DOM Populate
    let title = object.Title;
    let image = $("<img src = " + object.Poster + " alt = 'Poster is N/A'>");
    let runtime = object.Runtime;

    let combineString = title + " (" + runtime + ")";
    let newObject = $("<div>");

    $(image).addClass("modal-click");
    $(image).attr("data-imdbID", object.imdbID);

    $(newObject).addClass("object-container");

    $(newObject).append(image);
    $(newObject).append(combineString);
    $(newObject).append(
      `<button data-imdbID=${object.imdbID} class='clickable'>Remove Movie</button>`
    );
    $("#object-view").append(newObject);
  });
}

function queueCalls(movieWatchList) {
  let len = movieWatchList.length;
  for (let i = 0; i < len; i++) {
    let val = movieWatchList[i];
    apiCall(val);
  }
}

function getModalInfo(id) {
  let URL = "https://www.omdbapi.com/?i=" + id + "&apikey=trilogy";

  $.ajax({
    url: URL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    // set each movie with attr: 1) rating, 2) plot, 3) actors, 4) rotten tomatoes scores, 5) poster.

    $(".modal-title").text(response.Title);
    $("#rating").text(response.Rated);
    $("#plot").text(response.Plot);
    $("#actors").text(response.Actors);

    // create if else statement to aviod content without ratings not showing in html
    if (response.Ratings.length > 2) {
      let rottenTomatoes = response.Ratings[1].Value;

      $("#rotten-tomatoes").text("Rotten Tomatoes Score: " + rottenTomatoes);
    } else {
      $("#rotten-tomatoes").text("No Rotten Tomatoes Score Available");
    }

    $("#movie-poster").attr("src", response.Poster);
    $("#myModal").modal("show");
    console.groupEnd();
  });
}

$(window).on("load", function() {
  // PAGELOAD Firebase
  //Pull initial movie list and also updates list
  var movieWatchList;
  database.ref().on("value", function(snapshot) {
    // First Call
    if (movieWatchList === undefined) {
      movieWatchList = snapshot
        .child("DXji6kUNySV5oc5x80REEeuSRfH3")
        .val()
        .movielist.split(",");
      console.group("Movie Watch List ");
      console.log("Movie List", movieWatchList);
      if (movieWatchList[0] === "") {
        console.log("TRUE");
      } else {
        console.log("FALSE");
      }
      console.groupEnd();

      console.log(movieWatchList);
      queueCalls(movieWatchList);
    }

    $(document.body).on("click", ".modal-click", function() {
      console.group("Entered Modal Code");
      getModalInfo($(this).attr("data-imdbID"));
    });
  });

  //Remove Movie from List
  $(document.body).on("click", ".clickable", function() {
    let movieFireBase = $(this).attr("data-imdbID");
    $(this)
      .parent()
      .remove();

    // Check if movie is in database already

    console.log(movieWatchList.includes(movieFireBase));
    movieWatchList.splice(movieWatchList.indexOf(movieFireBase), 1);
    console.log("Movie Deleted");
    console.log(movieWatchList);

    //At the moment it is immediately pushing. Plan to push into array and place into database as an array
    database.ref("DXji6kUNySV5oc5x80REEeuSRfH3").update({
      movielist: movieWatchList.join()
    });
  });
});
