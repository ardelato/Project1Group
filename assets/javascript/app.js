$(window).on("load", function() {
  // PAGELOAD Firebase
  //Pull initial movie list and also updates list
  let movieWatchList;
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
    }
  });

  // DOM Search Queries

  $("#find-movie").on("click", function(event) {
    // Preventing the submit button from trying to submit the form
    // We're optionally using a form so the user may hit Enter to search instead of clicking the button
    event.preventDefault();
    // Here we grab the text from the input box
    let movie = $("#movie-input")
      .val()
      .trim();
    $("#movie-view").empty();
    // Here we construct our URL
    let queryURL =
      "https://www.omdbapi.com/?s=" +
      movie +
      "&type=movie" +
      "&apikey=trilogy&page=1";

    // Write code between the dashes below to hit the queryURL with $ajax, then take the response data
    // and display it in the div with an id of movie-view

    // YOUR CODE GOES IN THESE DASHES. DO NOT MANUALLY EDIT THE HTML ABOVE
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // console.log(response.Search);
      // $("#movie-view").text(JSON.stringify(response));

      //Appending all possible results of search onto page in form of Poster, Title
      let len = response.Search.length;
      console.log(len);
      console.log(response.Search);
      for (let m = 0; m < len; m++) {
        //creating Objects
        let object = $("<div>");
        let image = $(
          "<img src = " + response.Search[m].Poster + " alt = 'Poster is N/A'>"
        );
        let title = response.Search[m].Title;

        $(image).addClass("modal-click");
        $(image).attr("data-imdbID", response.Search[m].imdbID);
        //creating overall class and unique IDs
        $(object).addClass("movie-container");
        //appending into #movie-view
        $(object).append(image);
        $(object).append(title);
        $(object).append(
          `<button data-imdbID=${response.Search[m].imdbID} class='clickable'>Add Movie</button>`
        );
        $("#movie-view").append(object);
      }
    });
  });

  $(document.body).on("click", ".clickable", function() {
    let movieFireBase = $(this).attr("data-imdbID");
    $(this).removeClass("clickable");
    console.log(typeof movieFireBase);
    if (movieWatchList[0] === "") {
      movieWatchList[0] = movieFireBase;
    }
    // Check if movie is in database already
    else if (!movieWatchList.includes(movieFireBase)) {
      console.log(movieWatchList.includes(movieFireBase));
      movieWatchList.push(movieFireBase);
      console.log("New Movie Added");
      console.log(movieWatchList);
    }
    //At the moment it is immediately pushing. Plan to push into array and place into database as an array
    database.ref("DXji6kUNySV5oc5x80REEeuSRfH3").update({
      movielist: movieWatchList.join()
    });
  });

  $(document.body).on("click", ".modal-click", function() {
    console.group("Entered Modal Code");
    getModalInfo($(this).attr("data-imdbID"));
  });
});

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
