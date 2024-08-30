const listedMovies = [];
let addToList = document.getElementById('addToList');
addToList.style.color = 'white';
addToList.addEventListener('click', saveMovie);
document.getElementsByClassName('refresh')[0].addEventListener('click', unsaveMovie);

function saveMovie() {
    if ( addToList.style.color == 'white' ) {
        addToList.innerHTML = '<ion-icon name="heart"></ion-icon>';
        addToList.style.color = 'var(--highlight)';
        addToList.style.opacity = 1;
        
        renderList();
    }
}

function unsaveMovie() {
    addToList.innerHTML = '<ion-icon name="heart-outline"></ion-icon>';
    addToList.style.color = 'white';
    addToList.style.opacity = .7;
}

function renderList() {
    listedMovies.push(movie.id);
    let listItem = document.createElement('li');
    listItem.innerHTML = movie.id;

    document.getElementById('listContainer').appendChild( listItem );
}