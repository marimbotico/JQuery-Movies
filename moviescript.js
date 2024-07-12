// Create a full CRUD application of your choice using an API or JSON Server.
// Use JQuery/AJAX to interact with the API. 
// Use a form to post new entities.
// Build a way for users to update or delete entities.
// Include a way to get entities from the API.
// Use Bootstrap and CSS to style your project.


$(document).ready(function () {//This code ensures that the script runs only after the entire HTML document is fully loaded.
    const API_URL = 'http://localhost:3000/Movies'; // defining the constant API_URL is defined with the URL of the API endpoint that provides the movie data.


    // FETCH ALL MOVIES

    function getMovies() {// fecth movie data from the API.
        $.ajax({ // using Ajax I submit a request with the 'get' method. If it is successful then the function will be executed
            url: API_URL,
            method: 'GET',
            success: function (movies) {
                console.log('movies', movies);
                $('#action .row, #comedy .row, #sci-fi .row, #drama .row, #independent-film .row').empty();//empty() clears all te data from these containers to proper display the new data.
                movies.forEach(movie => {// iterates over each movie
                    const favClass = movie.favorite ? 'fas' : 'far'; // for each movie, check if it's already a favorite
                    const movieCard = `
                        <div class="col-md-4 menu-item">
                          <div class="card">
                            <img src="${movie.image}" class="card-img-top" alt="${movie.name}" />
                            <div class="card-body">
                              <h5 class="card-title">${movie.title}</h5>
                              <p class="card-text">${movie.description}</p>
                              <button class="btn btn-primary favorite-btn" data-id="${movie.id}">
                                <i class="${favClass} fa-heart"></i>
                              </button>
                              <button class="btn btn-danger delete-btn" data-id="${movie.id}">Delete</button>
                            </div>
                          </div>
                        </div>
                    `;// A template literal is used to create an HTML structure for each movie card, incorporating movie details and dynamically setting classes and data attributes.

                    if (movie.category === "action") {
                        $('#action .row').append(movieCard);
                    } else if (movie.category === "comedy") {
                        $('#comedy .row').append(movieCard);
                    } else if (movie.category === "sci-fi") {
                        $('#sci-fi .row').append(movieCard);
                    } else if (movie.category === "drama") {
                        $('#drama .row').append(movieCard);
                    } else if (movie.category === "independent-film") {
                        $('#independent-film .row').append(movieCard);
                    }
                });//depending on the category of each movie, a corresponding container is selected and the movie card is appended to it.
            },
            error: function (xhr, status, error) {
                console.error("Error fetching movies:", error);// if the AJAX request fails, an error message is logged to the console.
            }
        });
    }

    // FETCH FAVORITE MOVIES
    function getFavoriteMovies() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function (movies) {
                $('#favorite-movies').empty();
                movies.forEach(movie => {
                    if (movie.favorite) {
                        const movieCard = `
                        <div class="col-md-4 menu-item">
                            <div class="card">
                                <img src="${movie.image}" class="card-img-top" alt="${movie.title}" />
                                <div class="card-body">
                                    <h5 class="card-title">${movie.title}</h5>
                                    <p class="card-text">${movie.description}</p>
                                    <button class="btn btn-primary favorite-btn" data-id="${movie.id}">
                                        <i class="${movie.favorite} fa-heart"></i>
                                    </button>
                                    <button class="btn btn-danger delete-btn" data-id="${movie.id}">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
                        if (movie.favorite == true)
                            $('#favorite .row').append(movieCard);
                    }// A template literal is used to create an HTML structure for each movie card, incorporating movie details and dynamically setting classes and data attributes.
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching movies:", error);// error handling
            }
        });
    }

    // TOGGLE FAVORITE STATUS
    $(document).on('click', '.favorite-btn', function () {//event handler for clicks with the class '.favorite-btn'
        const id = $(this).data('id');// retrieves the data id of the item that was clicked
        const icon = $(this).find('i');// finds the icon within the clicked element
        const isFavorite = icon.hasClass('far');// checks if the element is already a favorite

        $.ajax({// Ajax request to toggle favorite status
            url: `${API_URL}/${id}`,// using the database and the movie id
            method: 'PATCH',// I use patch as it typically is used for partially updating a resource
            contentType: 'application/json',
            data: JSON.stringify({ favorite: isFavorite }),//The data property is set to a JSON string representing the updated favorite status. isFavorite is passed as the new favorite status.
            success: function () {
                getMovies();//If the request is successful, the getMovies function is called to refresh the list of movies, ensuring the updated favorite status is displayed.
            },
            error: function (xhr, status, error) {
                console.error("Error toggling favorite status:", error);// if it fails displays an error
            }
        });
    });

    // HANDLE FORM SUBMISSION TO ADD A NEW MOVIE

    $("#add-movie-form").submit(function (event) {//submit event handler to the form with the ID add-movie-form. 
        event.preventDefault();

        const newMovie = {
            title: $("#movie-title").val(),
            description: $("#movie-description").val(),
            image: $("#movie-image").val(),
            favorite: false,
            category: $("#movie-category").val(),
        };// defining the properties of the new movie

        $.ajax({// 
            url: API_URL,// same database
            method: "POST",// POST- sending data to te server
            contentType: "application/json",// the application contains JSON data
            data: JSON.stringify(newMovie),// converts the object to a string
            success: function () {// if successful then it alerts the movie has been added
                alert("Movie added successfully!");
                $("#add-movie-form")[0].reset();// resets all form fields
                getMovies();
            },
            error: function (xhr, status, error) {
                console.error("Error adding new movie:", error);// error handling
            },
        });
    });

    // DELETE A MOVIE
    $(document).on('click', '.delete-btn', function () {// event handler when clicked on the delete button
        const id = $(this).data('id');// This line retrieves the value of the data-id attribute from the clicked element (referred to by $(this)). 
        //This value is stored in the variable id and represents the identifier of the movie to be deleted.

        $.ajax({
            url: `${API_URL}/${id}`,// appends the id to the database
            method: 'DELETE',// request to remove the resource from the server
            success: function () {
                getMovies();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting movie:", error);// error handling
            }
        });
    });


    //FAVORITE BUTTON

    $(document).on('click', '.favorite-btn', function () {
        const id = $(this).data('id');// retrieves the data id of the item that was clicked
        const icon = $(this).find('i');// finds the icon within the clicked element
        const isFavorite = icon.hasClass('fas');// checks if the element is already a favorite

        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ favorite: !isFavorite }),
            success: function () {
                getFavoriteMovies();
            },
            error: function (xhr, status, error) {
                console.error("Error toggling favorite status:", error);
            }
        });
    });

    // DELETE A MOVIE FROM FAVORITES PAGE
    $(document).on('click', '.delete-btn', function () {// event handler delete button
        const id = $(this).data('id');

        $.ajax({
            url: `${API_URL}/${id}`,// database plus specific id
            method: 'DELETE',
            success: function () {
                getFavoriteMovies();// if successful calls the getFavoriteMovies function
            },
            error: function (xhr, status, error) {
                console.error("Error deleting movie:", error);// error handling
            }
        });
    });

    //LOAD ALL MOVIES 
    if (window.location.pathname.endsWith('favorites.html')) {
        getFavoriteMovies();
    } else {
        getMovies();
    }
});






















