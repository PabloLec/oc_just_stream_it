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
        rated = rated + '+'
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
        boxOffice = (boxOffice / 1e9).toPrecision(3) + 'Md$'
    } else if (boxOffice >= 1e6) {
        boxOffice = (boxOffice / 1e6).toPrecision(3) + 'Mn$'
    } else if (boxOffice >= 1e3) {
        boxOffice = (boxOffice / 1e3).toPrecision(3) + 'k$'
    } else {
        boxOffice = boxOffice + ' $'
    }

    let dateDiv = document.createElement('span')
    dateDiv.setAttribute('class', 'modal__globalinfo')
    dateDiv.innerHTML = date
    globalInfos.appendChild(dateDiv)

    let starsDiv = document.createElement('span')
    starsDiv.setAttribute('class', 'modal__globalinfo')
    starsDiv.innerHTML = getRatingStars(movieInfo['imdb_score'])
    globalInfos.appendChild(starsDiv)

    if (rated != '') {
        let ratedDiv = document.createElement('span')
        ratedDiv.setAttribute('class', 'modal__globalinfo')
        ratedDiv.innerHTML = rated
        globalInfos.appendChild(ratedDiv)
    }

    let durationDiv = document.createElement('span')
    durationDiv.setAttribute('class', 'modal__globalinfo')
    durationDiv.innerHTML = duration
    globalInfos.appendChild(durationDiv)

    if (boxOffice != '') {
        let boxOfficeDiv = document.createElement('span')
        boxOfficeDiv.setAttribute('class', 'modal__globalinfo')
        boxOfficeDiv.innerHTML = boxOffice
        globalInfos.appendChild(boxOfficeDiv)
    }

    elements.push(globalInfos)

    let summary = createDivWithClass('modal__summary')
    summary.innerHTML = '<hr>' + movieInfo['description'] + '<hr>'
    elements.push(summary)

    let origin = createDivWithClass('modal__origin')
    origin.innerHTML = '<b>Origine:</b> ' + movieInfo['countries'].join(', ')
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

async function searchFeaturedMovie(page) {
    const response = await fetch(
        APIURL + 'titles/?page=' + page + '&sort_by=-year,-imdb_score,-votes',
    )
    const data = await response.json()
    const results = data['results']
    for (var i = 0; i < results.length; i++) {
        if (results[i]['votes'] > 300) {
            return results[i]['id']
        }
    }
}

async function getFeaturedMovie() {
    let container = document.getElementsByClassName('featured__container')[0]
    container.style.display = 'none'
    let loader = document.getElementById('loader-Featured')

    const featuredMovieId = await searchFeaturedMovie((page = 1))
    let featuredMovie = await queryMovieInfo(featuredMovieId)

    container.style.backgroundImage =
        "url('" + featuredMovie['image_url'].split('_.')[0] + "')"
    container.setAttribute('id', featuredMovieId)
    let name = document.getElementsByClassName('featured__name')[0]
    name.innerHTML = featuredMovie['title']
    loader.style.display = 'none'
    container.style.display = 'block'
    addModal(container)
    return
}

getFeaturedMovie()
