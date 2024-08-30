function RNG(max) {
    return Math.floor(Math.random() * max)
}

function changeLoading(content, loader) {
    if ( content == 'flex' ) {
        setTimeout(() => {
            document.getElementById('movieContainerContent').style.display = content;
            document.getElementById('loadingScreen').style.display = loader;
        }, 200);
    } else {
        document.getElementById('movieContainerContent').style.display = content;
        document.getElementById('loadingScreen').style.display = loader;
    }
}
 
//  Sets movie genre to serach for
let genre = '';
document.querySelectorAll('option.movieGenre').forEach((el) => {
    el.addEventListener('click', () => {
        if (el.value !== 0) {
            genre = `?with_genres=${el.value}`;
        }
    })
})

//  Gets a list a movies with the specified genre
const getMovies = (genre) => {
    changeLoading('none', 'block');
    axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/discover/movie${genre}`,
        params: {
            api_key: '62b1a9584a2f2d350b05943ec3ca2630',
            language: 'pt-BR'
        }
    })
    .then(response => {
        changeLoading('flex', 'none');
        setMovie(response);
    })
}
getMovies(genre);

//  Shows the user a random movie from that list
function setMovie(response) {
    const movie = response.data.results[RNG(19)];
    let movieTitle = document.getElementById('movieTitle'),
        moviePoster = document.getElementById('moviePoster').querySelector('img'),
        movieDescription = document.getElementById('movieDescription'),
        movieRating = document.getElementById('movieRating');

    if ( Number(movie.vote_average) >= 6 ) {
        getMovieDetails(movie.id);
        getMovieCredits(movie.id);

        moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/original${movie.poster_path}`);
        
        movie.title ? 
            movieTitle.innerHTML = movie.title :
            movieTitle.innerHTML = '[Could not find a title for this movie]';
    
        movie.overview ? 
            movieDescription.innerHTML = movie.overview : 
            movieDescription.innerHTML = '[Could not find an overview for this movie]';
    
        movie.vote_average && movie.vote_count ? 
            movieRating.innerHTML = `<span id='ratingsIcon'><ion-icon name="star"></ion-icon>\n</span>${Number(movie.vote_average).toFixed(1)} / 10 <span id="voteCount">(${movie.vote_count})</span>` :
            movieRating.innerHTML = '[Could not find ratings for this movie]';
    }
}

//  Gets the selected movie's details
const getMovieDetails = (movieId) => {
    axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}`,
        params: {
            api_key: '62b1a9584a2f2d350b05943ec3ca2630',
            language: 'pt-BR'
        }
    })
    .then(response => {
        let runtimeResponse = JSON.stringify(response.data.runtime),
            hours = parseInt(runtimeResponse / 60),
            minutes = runtimeResponse - (hours * 60),
            runtime;

        (hours < 10) ? hours = 0 + String(hours) : hours = hours;
        (minutes < 10) ? minutes = 0 + String(minutes) : minutes = minutes;
        runtime = `${hours}<span class='timeLabel'>h</span> ${minutes}<span class='timeLabel'>min</span>`;

        document.getElementById('movieRuntime').innerHTML = runtime;
        document.getElementById('origin').innerHTML = JSON.stringify(response.data.origin_country).replace(/[\[\]"]+/g, '');
    })
}

const getMovieCredits = (movieId) => {
    axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        params: {
            api_key: '62b1a9584a2f2d350b05943ec3ca2630',
            language: 'pt-BR'
        }
    })
    .then(response => {
        let castBox = document.getElementById('castList');
        let directorBox = document.getElementById('directorList');

        castBox.innerHTML = '';
        for ( i = 0; i < 5; i++ ) {
            castBox.innerHTML += JSON.stringify(response.data.cast[i].name).replace(/"/g, '') + ', '; 

            if (i == 4) {
                castBox.innerHTML = castBox.innerHTML.slice(0, -2);
            }
        }

        directorBox.innerHTML = '[Not Found]';
        response.data.cast.forEach((el) => {
            if ( el.known_for_department == 'Directing' ) {
                directorBox.innerHTML = JSON.stringify(el.name).replace(/"/g, '');
            }
        })
    })
}