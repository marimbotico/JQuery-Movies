$(document).ready(function () {
    const API_URL = 'https://movies-1-ahs6.onrender.com/movies';

    document.addEventListener('DOMContentLoaded', function() {
        var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        var navbarToggler = document.querySelector('.navbar-toggler');
        var navbarCollapse = document.querySelector('.navbar-collapse');
    
        navLinks.forEach(function(navLink) {
            navLink.addEventListener('click', function() {
                if (window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    });

    // FETCH ALL MOVIES
    function getMovies() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function (movies) {
                console.log('movies', movies);
                $('#action .row, #comedy .row, #sci-fi .row, #drama .row, #independent-film .row').empty();
                movies.forEach(movie => {
                    const favClass = movie.favorite ? 'fas' : 'far';
                    const movieCard = `
                        <div class="col-md-4 menu-item">
                          <div class="card">
                            <img src="${movie.image}" class="card-img-top" alt="${movie.name}">
                            <div class="card-body">
                              <h5 class="card-title">${movie.title}</h5>
                              <p class="card-text">${movie.description}</p>
                              <button class="btn btn-primary favorite-btn" data-id="${movie.id}" data-favorite="${movie.favorite}">
                                <i class="${favClass} fa-heart"></i>
                              </button>
                              <button class="btn btn-danger delete-btn" data-id="${movie.id}">Delete</button>
                            </div>
                          </div>
                        </div>
                    `;

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
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching movies:", error);
            }
        });
    }

    // FETCH FAVORITE MOVIES
    function getFavoriteMovies() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function (movies) {
                $('#favorites .row').empty();
                movies.forEach(movie => {
                    if (movie.favorite) {
                        const movieCard = `
                        <div class="col-md-4 menu-item">
                            <div class="card">
                                <img src="${movie.image}" class="card-img-top" alt="${movie.title}" />
                                <div class="card-body">
                                    <h5 class="card-title">${movie.title}</h5>
                                    <p class="card-text">${movie.description}</p>
                                    <button class="btn btn-primary favorite-btn" data-id="${movie.id}" data-favorite="true">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                    <button class="btn btn-danger delete-btn" data-id="${movie.id}">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
                        $('#favorites .row').append(movieCard);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching movies:", error);
            }
        });
    }

    // TOGGLE FAVORITE STATUS
    $(document).on('click', '.favorite-btn', function () {
        const id = $(this).data('id');
        const isFavorite = $(this).data('favorite') === true;
        const newFavoriteStatus = !isFavorite;

        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ favorite: newFavoriteStatus }),
            success: function () {
                if (window.location.pathname.endsWith('favorites.html')) {
                    getFavoriteMovies();
                } else {
                    getMovies();
                }
            },
            error: function (xhr, status, error) {
                console.error("Error toggling favorite status:", error);
            }
        });
    });

    // HANDLE FORM SUBMISSION TO ADD A NEW MOVIE
    $("#add-movie-form").submit(function (event) {
        event.preventDefault();

        const newMovie = {
            title: $("#movie-title").val(),
            description: $("#movie-description").val(),
            image: $("#movie-image").val(),
            favorite: false,
            category: $("#movie-category").val(),
        };

        $.ajax({
            url: API_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(newMovie),
            success: function () {
                alert("Movie added successfully!");
                $("#add-movie-form")[0].reset();
                getMovies();
            },
            error: function (xhr, status, error) {
                console.error("Error adding new movie:", error);
            },
        });
    });

    // DELETE A MOVIE
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');

        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'DELETE',
            success: function () {
                if (window.location.pathname.endsWith('favorites.html')) {
                    getFavoriteMovies();
                } else {
                    getMovies();
                }
            },
            error: function (xhr, status, error) {
                console.error("Error deleting movie:", error);
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