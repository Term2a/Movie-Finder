//  Nav bar hover show & hide
document.getElementById('navBarTrigger').addEventListener('mouseenter', () => {
    document.getElementById('navBarHandle').style.left = '4.7%';
    document.getElementById('navBar').style.width = '4vw';
    document.getElementById('navBar').querySelectorAll('h1').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'scale(1)';
    })
})

document.getElementById('navBar').addEventListener('mouseleave', () => {
    document.getElementById('navBarHandle').style.left = '.7%';
    document.getElementById('navBar').style.width = '0';
    document.getElementById('navBar').querySelectorAll('h1').forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'scale(0)';
    })
})

//  Swap screens
let screenIcon = document.getElementById('navBar').querySelectorAll('h1');
document.getElementById('searchApp').style.display = 'block';

screenIcon[0].addEventListener('click', () => {
    if ( document.getElementById('searchApp').style.display != 'block' ) {
        screenIcon.forEach((el) => {
            el.style.pointerEvents = 'none';
            setTimeout(() => {
                el.style.pointerEvents = 'all';
            }, 1050);
        })
        document.getElementById('movieList').style.opacity = 0;
        document.getElementById('movieList').style.filter = 'blur(.5vw)';
        document.getElementById('listContainer').style.gap = '4vw';
        document.getElementById('listContainer').style.columnGap = '';
        setTimeout(() => {
            document.getElementById('searchApp').style.display = 'block';
        }, 500);
        setTimeout(() => {
            document.getElementById('movieList').style.display = 'none';
            document.getElementById('searchFilters').style.top = '10%';
            document.getElementById('movieContainer').style.top = '2vw';
            document.getElementById('searchApp').style.opacity = 1;
        }, 700);
    }
})

screenIcon[1].addEventListener('click', () => {
    if ( document.getElementById('movieList').style.display != 'flex' ) {
        screenIcon.forEach((el) => {
            el.style.pointerEvents = 'none';
            setTimeout(() => {
                el.style.pointerEvents = 'all';
            }, 1050);
        })
        document.getElementById('searchFilters').style.top = '-2vw';
        document.getElementById('movieContainer').style.top = '20vw';
        document.getElementById('searchApp').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('movieList').style.display = 'flex';            
        }, 500);
        setTimeout(() => {
            document.getElementById('searchApp').style.display = 'none';
            document.getElementById('movieList').style.opacity = 1;
            document.getElementById('movieList').style.filter = 'none';
            document.getElementById('listContainer').style.gap = '2vw';
            document.getElementById('listContainer').style.columnGap = 0;
        }, 700);
    }
})