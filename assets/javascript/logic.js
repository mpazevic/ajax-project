var topics = ["mac n cheese", "pizza", "tacos", "sandwich", "french fries",
  "apples", "burgers", "steak", "soup", "nachos",
  "marshmallows", "chocolate", "cupcakes", "cake", "ramen",
  "guacamole", "cookies", "ice cream", "belgian waffles", "pancakes",
  "hashbrowns" 
];
var imgURL;
var animatedImgURL;
var myURLs = [];
var myAnimatedURLs = [];
var animatedURL;
var staticURL;

// Function for displaying food buttons
function renderButtons() {
  $('#foodButtons').empty();
  for (var i = 0; i < topics.length; i++) {
    var food = $('<button>' + topics[i] + '</button>');
      food.addClass("btn-default food-choice");
      $('#foodButtons').append(food);
  };
};
// Call to immediately render the buttons upon page load
renderButtons();

// Adds a button to the div containing initial buttons
$('#add-food').on("click", function(event) { 
  event.preventDefault();
  var addedFood = $('#food-input').val().trim();
  for (var i = 0; i < topics.length; i++) {
    if (topics[i] === addedFood.trim()) {
      return $('#error-add').text("That topic already exists!");
    }
  };
  //Reports an error indicating that the user must enter a value, or updates buttons
  if (addedFood === '') {
    $('#error-add').text("Please enter a food(or any other topic)!")
  }
  else {
    $('#error-add').empty();
    $('#error-remove').empty();
    $('#food-remove').val('');
    topics.push(addedFood);
    renderButtons();
    $('#food-input').val('');
  };
});

// Allow user to remove a button by typing the name and clicking remove
$('#remove-food').on("click", function(event) { 
  event.preventDefault();
  var removedFood = $('#food-remove').val().trim();
  for (var i = 0; i < topics.length; i++) {
    if (topics[i] === removedFood) {
      topics.splice(i, 1);
      $('#food-remove').val('');
      $('#error-remove').text("You removed " + removedFood + " from the list!");
      return renderButtons();
    }
  };
  // Feedback for the user if a food button already exists
  $('#error-remove').text("Sorry, but the topic " + '"' + removedFood + '"' +
    " isn't listed!");
});

// Enable user to press the enter key to search a topic
$('#food-input').keydown(function(event) {
  var keyCode = event.which;
  if (keyCode === 13) {
    $('#add-food').trigger('click');
  };
});

// Enable user to press the enter key to remove a topic
$('#food-remove').keydown(function(event) {
  var keyCode = event.which;
  if (keyCode === 13) {
    $('#remove-food').trigger('click');
  };
});

// Allow for all buttons to be clicked, and ping relevant API
$(document).on("click", ".food-choice", function() {
  myURLs = [];
  myAnimatedURLs = [];
  var topicClicked = $(this).text();
  var queryString = topicClicked.replace(/\s+/g, '+').trim();
  var apiKey = "api_key=dc6zaTOxFJmzC";
  var limit = 10;
  var rating = "pg-13";
  var queryURL = "https://api.giphy.com/v1/gifs/search?" + "q=" + queryString +
    "&" + apiKey + "&limit=" + limit + "&rating=" + rating;
  var options = {
    url: queryURL,
    method: "GET"
  };
  // Display static images and update html upon clicking
  $.ajax(options).done(function(response) {
    console.log(response);
    $('#foodGIFs').empty();
    for (var i = 0; i < 10; i++) {
      imgURL = response.data[i].images.original_still.url;
      // Store all imgURLs from the giphy API response for later manipulation
      myURLs.push(imgURL);
      animatedImgURL = response.data[i].images.original.url;
      // Store the animated URLs as well 
      myAnimatedURLs.push(animatedImgURL);
      // Create divs to display ratings and images
      var container = $('<div>');
      container.addClass("positioning");
      var h4 = $('<h4>');
      h4.html('Rating: ' + response.data[i].rating);
      var imgDiv = $('<img>');
      imgDiv.attr('src', imgURL);
      container.append(h4);
      container.append(imgDiv);
      $('#foodGIFs').append(container);
    };
  });

});

// Conditions for displaying animated urls
$(document).on("click", "img", function(event) {
  var currentURL = event.target.src;
  var animatedURL = myAnimatedURLs[myAnimatedURLs.indexOf(event.target.src)];
  var staticURL = myURLs[myURLs.indexOf(event.target.src)];
  if (currentURL === animatedURL) {
  	// Dynamically alter the value of staticURL to change img src (thanks GT!)
    staticURL = myURLs[myAnimatedURLs.indexOf(animatedURL)];
    event.target.src = staticURL;
  }
  else if (currentURL === staticURL) {
  	// Dynamically alter the value of animatedURL to change img src (thanks GT!)
    animatedURL = myAnimatedURLs[myURLs.indexOf(staticURL)];
    event.target.src = animatedURL;
  }

});

