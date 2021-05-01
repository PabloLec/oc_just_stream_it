function createHeader(movieInfo) {
    let header = createDivWithClass('modal-header')

    let image = document.createElement('img')
    image.src = movieInfo['image_url']
    image.setAttribute('class', 'modal-image')
    header.appendChild(image)

    let title_div = createDivWithClass('modal-title')
    title_div.innerHTML = movieInfo['title']
    header.appendChild(title_div)

    return header
}

function createDate(date_published) {
    let date = date_published
    date = date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4)
    let dateDiv = document.createElement('span')
    dateDiv.setAttribute('class', 'modal-globalinfo')
    dateDiv.innerHTML = date

    return dateDiv
}

function createAgeRating(rated) {
    if (rated === 'Not rated or unkown rating') {
        rated = ''
    } else {
        rated = rated + '+'
    }

    if (rated != '') {
        let ratedDiv = document.createElement('span')
        ratedDiv.setAttribute('class', 'modal-globalinfo')
        ratedDiv.innerHTML = rated
        return ratedDiv
    } else {
        return null
    }
}

function createDuration(duration) {
    if (duration < 60) {
        duration = duration + 'min'
    } else {
        duration =
            Math.floor(duration / 60) +
            'h' +
            (duration - 60 * Math.floor(duration / 60) + 'min')
    }
    let durationDiv = document.createElement('span')
    durationDiv.setAttribute('class', 'modal-globalinfo')
    durationDiv.innerHTML = duration
    return durationDiv
}

function createCriticsRating(rating) {
    let starsDiv = document.createElement('span')
    starsDiv.setAttribute('class', 'modal-globalinfo')
    starsDiv.innerHTML = getRatingStars(rating)
    return starsDiv
}

function createBoxOffice(income) {
    if (!income) {
        income = ''
    } else if (income >= 1e9) {
        income = (income / 1e9).toPrecision(3) + 'Md$'
    } else if (income >= 1e6) {
        income = (income / 1e6).toPrecision(3) + 'Mn$'
    } else if (income >= 1e3) {
        income = (income / 1e3).toPrecision(3) + 'k$'
    } else {
        income = income + ' $'
    }

    if (income != '') {
        let boxOfficeDiv = document.createElement('span')
        boxOfficeDiv.setAttribute('class', 'modal-globalinfo')
        boxOfficeDiv.innerHTML = income
        return boxOfficeDiv
    } else {
        return null
    }
}

function createGlobalInfos(movieInfo) {
    let globalInfos = createDivWithClass('modal-global')

    globalInfos.appendChild(createDate(movieInfo['date_published']))
    ageRating = createAgeRating(movieInfo['rated'])
    if (ageRating) {
        globalInfos.appendChild(ageRating)
    }
    globalInfos.appendChild(createDuration(movieInfo['duration']))
    globalInfos.appendChild(createCriticsRating(movieInfo['imdb_score']))
    boxOffice = movieInfo['worldwide_gross_income']
    if (boxOffice) {
        globalInfos.appendChild(
            createBoxOffice(movieInfo['worldwide_gross_income']),
        )
    }

    return globalInfos
}

function createDescription(description) {
    let descriptionDiv = createDivWithClass('modal-summary')
    descriptionDiv.innerHTML = '<hr>' + description + '<hr>'
    return descriptionDiv
}

function createAdditionalInfos(movieInfo) {
    let additionalInfos = []

    let origin = createDivWithClass('modal-origin')
    origin.innerHTML = '<b>Origine:</b> ' + movieInfo['countries'].join(', ')
    additionalInfos.push(origin)

    let genre = createDivWithClass('modal-genre')
    genreList = movieInfo['genres']
    if (genreList.length < 2) {
        genre.innerHTML = '<b>Genre:</b> ' + movieInfo['genres']
    } else {
        genre.innerHTML = '<b>Genres:</b> ' + movieInfo['genres'].join(', ')
    }
    additionalInfos.push(genre)

    let director = createDivWithClass('modal-director')
    director.innerHTML = '<b>Réalisateur:</b> ' + movieInfo['directors']
    additionalInfos.push(director)

    let actors = createDivWithClass('modal-actors')
    actors.innerHTML = '<b>Acteurs:</b> ' + movieInfo['actors'].join(', ')
    additionalInfos.push(actors)

    return additionalInfos
}

function populateModal(movieInfo) {
    let modal = document.getElementsByClassName('modal-wrapper')[0]

    let elements = []

    elements.push(createHeader(movieInfo))

    elements.push(createGlobalInfos(movieInfo))

    elements.push(createDescription(movieInfo['description']))

    elements.push(...createAdditionalInfos(movieInfo))

    for (var i = 0; i < elements.length; i++) {
        modal.appendChild(elements[i])
    }
}

const openModal = async function (id) {
    modal = await loadModal(id)
    loader = document.getElementById('loader-Modal')
    loader.style.display = 'block'
    const movieInfo = await queryMovieInfo(id)
    populateModal(movieInfo)
    loader.style.display = 'none'
    modal.style.display = null

    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal
        .querySelector('.js-modal-stop')
        .addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    modal.querySelector('.modal-wrapper').innerHTML =
        '<div class="loader" id="loader-Modal" style="display: none">'
    e.preventDefault()
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal
        .querySelector('.js-modal-close')
        .removeEventListener('click', closeModal)
    modal
        .querySelector('.js-modal-stop')
        .removeEventListener('click', stopPropagation)
    const hideModal = function () {
        modal.style.display = 'none'
        modal.removeEventListener('animationend', hideModal)
        modal = null
    }
    modal.addEventListener('animationend', hideModal)
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const loadModal = async function () {
    const target = '#modal'
    const exitingModal = document.querySelector(target)
    if (exitingModal !== null) return exitingModal
    const html = await fetch('src/modal.html#modal').then((response) =>
        response.text(),
    )
    const element = document
        .createRange()
        .createContextualFragment(html)
        .querySelector(target)
    document.body.append(element)
    return element
}

function addModal(item) {
    item.addEventListener('click', function () {
        openModal(item.id)
    })
}
