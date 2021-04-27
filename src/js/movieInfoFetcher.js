async function queryMovieInfo(id) {
    const response = await fetch(APIURL + 'titles/' + id)
    const data = await response.json()
    return data
}

function populateModal(movieInfo) {
    console.log('Début de Populate')
    let modal = document.getElementsByClassName('modal-wrapper')[0]

    let elements = []

    let header = createDivWithClass('modal__header')

    let image = document.createElement('img')
    image.src = movieInfo['image_url']
    image.setAttribute('class', 'modal__image')
    header.appendChild(image)

    let title_div = createDivWithClass('modal__title')
    title_div.innerHTML = movieInfo['title']
    header.appendChild(title_div)

    elements.push(header)

    let globalInfos = createDivWithClass('modal__global')
    let date = movieInfo['date_published']
    date = date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4)
    console.log(date)

    let rated = movieInfo['rated']
    if (rated === 'Not rated or unkown rating') {
        rated = ''
    } else {
        rated = ' - ' + rated + '+'
    }

    let duration = movieInfo['duration']
    if (duration < 60) {
        duration = duration + 'min'
    } else {
        duration =
            Math.floor(duration / 60) +
            'h' +
            (duration - 60 * Math.floor(duration / 60) + 'min')
    }

    let boxOffice = movieInfo['worldwide_gross_income']
    if (boxOffice === null) {
        boxOffice = ''
    } else if (boxOffice >= 1e9) {
        boxOffice = ' - ' + (boxOffice / 1e9).toPrecision(3) + 'Md$'
    } else if (boxOffice >= 1e6) {
        boxOffice = ' - ' + (boxOffice / 1e6).toPrecision(3) + 'Mn$'
    } else if (boxOffice >= 1e3) {
        boxOffice = ' - ' + (boxOffice / 1e3).toPrecision(3) + 'k$'
    } else {
        boxOffice = ' - ' + boxOffice + ' $'
    }

    globalInfos.innerHTML =
        date +
        ' - ' +
        getRatingStars(movieInfo['imdb_score']) +
        rated +
        ' - ' +
        duration +
        boxOffice

    elements.push(globalInfos)

    let origin = createDivWithClass('modal__origin')
    origin.innerHTML = '<b>Origine:</b> ' + movieInfo['countries']
    elements.push(origin)

    let genre = createDivWithClass('modal__genre')
    genreList = movieInfo['genres']
    if (genreList.length < 2) {
        genre.innerHTML = '<b>Genre:</b> ' + movieInfo['genres']
    } else {
        genre.innerHTML = '<b>Genres:</b> ' + movieInfo['genres'].join(', ')
    }

    elements.push(genre)

    let director = createDivWithClass('modal__director')
    director.innerHTML = '<b>Réalisateur:</b> ' + movieInfo['directors']
    elements.push(director)

    let actors = createDivWithClass('modal__actors')
    actors.innerHTML = '<b>Acteurs:</b> ' + movieInfo['actors'].join(', ')
    elements.push(actors)

    console.log('BOX OFFICE: ', movieInfo['worldwide_gross_income'])

    for (var i = 0; i < elements.length; i++) {
        modal.appendChild(elements[i])
    }
}
