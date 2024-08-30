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
            genre = `&with_genres=${el.value}`;
        }
    })
})

//  Gets a list a movies with the specified genre
const getMovies = (genre) => {
    changeLoading('none', 'block');
    axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/discover/movie?&page=${RNG(400)}${genre}&include_adult=false&without_genres=softcore`,
        params: {
            api_key: '62b1a9584a2f2d350b05943ec3ca2630',
            language: 'pt-BR'
        }
    })
    .then(response => {
        setMovie(response);
    })
    .catch(() => { getMovies(genre) });
}
getMovies(genre);

//  Shows the user a random movie from that list
let movie;
function setMovie(response) {
    movie = response.data.results[RNG(19)];
    let movieTitle = document.getElementById('movieTitle'),
        moviePoster = document.getElementById('moviePoster').querySelector('img'),
        movieDescription = document.getElementById('movieDescription'),
        movieRelease = document.getElementById('releaseDate'),
        movieRating = document.getElementById('movieRating');

    if ( 
        Number(movie.vote_average) >= 6.5 &&
        Number(movie.vote_count) > 10 &&
        isOnReleaseDate(movie) 
    ) {
        changeLoading('flex', 'none');
        
        getMovieDetails(movie.id);
        getMovieCredits(movie.id);

        moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/original${movie.poster_path}`);
        
        movie.title ? 
            movieTitle.innerHTML = movie.title :
            movieTitle.innerHTML = '[Could not find a title for this movie]';
    
        movie.overview ? 
            movieDescription.innerHTML = movie.overview : 
            movieDescription.innerHTML = '[Could not find an overview for this movie]';

        movie.release_date ?
            movieRelease.innerHTML = movie.release_date.split('-')[0] :
            movieRelease.innerHTML = '[Not found]'
    
        movie.vote_average && movie.vote_count ? 
            movieRating.innerHTML = `<span id='ratingsIcon'><ion-icon name="star"></ion-icon>\n</span>${Number(movie.vote_average).toFixed(1)} / 10 <span id="voteCount">(${movie.vote_count})</span>` :
            movieRating.innerHTML = '[Could not find ratings for this movie]';
    } else {
        getMovies(genre);
    }
}

function isOnReleaseDate(movie) {
    let datePicker = document.getElementsByClassName('datePicker')[0],
        desiredDate = datePicker.querySelectorAll(`option[value="${datePicker.value}"]`)[0].innerHTML.replace(/ /g, ''),
        desiredDateValue = desiredDate[1] + desiredDate[2] + desiredDate[3] + desiredDate[4],
        movieReleaseDate = movie.release_date.split('-')[0];

    if ( datePicker.value == 0 ) {
        return true

    } else
    if ( datePicker.value == 1 && movieReleaseDate <= desiredDateValue ) {
        return true

    } else
    if (
        ( datePicker.value == 2 || datePicker.value == 3 ) && 
        movieReleaseDate >= desiredDateValue 
    ) {
        return true

    } else {
        return false
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
            originCountry = JSON.stringify(response.data.origin_country).replace(/[\[\]"]+/g, ''),
            hours = parseInt(runtimeResponse / 60),
            minutes = runtimeResponse - (hours * 60),
            runtime;

        (hours < 10) ? hours = 0 + String(hours) : hours = hours;
        (minutes < 10) ? minutes = 0 + String(minutes) : minutes = minutes;
        runtime = `${hours}<span class='timeLabel'>h</span> ${minutes}<span class='timeLabel'>min</span>`;
        document.getElementById('movieRuntime').innerHTML = runtime;

        if (
            runtimeResponse >= 60 &&
            originCountry != 'KR' && 
            originCountry != 'JP' &&
            originCountry != 'CN' &&
            originCountry != 'CN,HK' &&
            originCountry != 'IL'
        ) {
            document.getElementById('origin').innerHTML = originCountry;
        } else {
            getMovies(genre);
        }
    })
    .catch(() => { getMovies(genre) });
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

        directorBox.innerHTML = '[Not found]';
        response.data.cast.forEach((el) => {
            if ( el.known_for_department == 'Directing' ) {
                directorBox.innerHTML = JSON.stringify(el.name).replace(/"/g, '');
            }
        })
    })
    .catch(() => { getMovies(genre) });
}