/** Creates modal header.
 *
 * @param {object} movieDetails Movie details fetched from API.
 * @return {object} Created div.
 */
function createHeader(movieDetails) {
    let header = createElementWithClass('div', 'modal-header')

    let image = document.createElement('img')
    image.src = movieDetails['image_url']
    image.setAttribute('class', 'modal-image')
    header.appendChild(image)

    let title_div = createElementWithClass('div', 'modal-title')
    title_div.innerHTML = movieDetails['title']
    header.appendChild(title_div)

    return header
}

/** Creates movie date of publication display.
 *
 * @param {number} date_published Date of publication.
 * @return {object} Created span.
 */
function createDate(date_published) {
    let date = date_published
    date = date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4)
    let dateDiv = createElementWithClass('span', 'modal-globaldetails')
    dateDiv.innerHTML = date

    return dateDiv
}

/** Creates movie age rating display.
 *
 * @param {number} rated Age rating.
 * @return {object} Created span.
 */
function createAgeRating(rated) {
    if (rated === 'Not rated or unkown rating') {
        rated = ''
    } else {
        rated = rated + '+'
    }

    if (rated != '') {
        let ratedDiv = createElementWithClass('span', 'modal-globaldetails')
        ratedDiv.innerHTML = rated
        return ratedDiv
    } else {
        return null
    }
}

/** Creates movie duration display.
 *
 * @param {number} duration Movie duration.
 * @return {object} Created span.
 */
function createDuration(duration) {
    if (duration < 60) {
        duration = duration + 'min'
    } else {
        duration =
            Math.floor(duration / 60) +
            'h' +
            (duration - 60 * Math.floor(duration / 60) + 'min')
    }
    let durationDiv = createElementWithClass('span', 'modal-globaldetails')
    durationDiv.innerHTML = duration
    return durationDiv
}

/** Creates movie critics rating display.
 *
 * @param {number} rating Critics rating /10.
 * @return {object} Created span.
 */
function createCriticsRating(rating) {
    let starsDiv = createElementWithClass('span', 'modal-globaldetails')
    starsDiv.innerHTML = getRatingStars(rating)
    return starsDiv
}

/** Creates movie box office income display.
 *
 * @param {number} income Box office income in $.
 * @return {object} Created span.
 */
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
        let boxOfficeDiv = createElementWithClass('span', 'modal-globaldetails')
        boxOfficeDiv.innerHTML = income
        return boxOfficeDiv
    } else {
        return null
    }
}

/** Creates movie global details display by calling corresponding functions.
 *
 * @param {object} movieDetails Fetched movie details.
 * @return {object} Created div.
 */
function createGlobalDetails(movieDetails) {
    let globalDetails = createElementWithClass('div', 'modal-global')

    globalDetails.appendChild(createDate(movieDetails['date_published']))
    ageRating = createAgeRating(movieDetails['rated'])
    if (ageRating) {
        globalDetails.appendChild(ageRating)
    }
    globalDetails.appendChild(createDuration(movieDetails['duration']))
    globalDetails.appendChild(createCriticsRating(movieDetails['imdb_score']))
    boxOffice = movieDetails['worldwide_gross_income']
    if (boxOffice) {
        globalDetails.appendChild(
            createBoxOffice(movieDetails['worldwide_gross_income']),
        )
    }

    return globalDetails
}

/** Creates movie description display.
 *
 * @param {string} description Movie description
 * @return {object} Created div.
 */
function createDescription(description) {
    let descriptionDiv = createElementWithClass('div', 'modal-summary')
    descriptionDiv.innerHTML = '<hr>' + description + '<hr>'
    return descriptionDiv
}

/** Creates movie additional movie details display.
 *
 * @param {string} movieDetails Movie details.
 * @return {object} Created div.
 */
function createAdditionalDetails(movieDetails) {
    let additionalDetails = []

    let origin = createElementWithClass('div', 'modal-origin')
    origin.innerHTML = '<b>Origine:</b> ' + movieDetails['countries'].join(', ')
    additionalDetails.push(origin)

    let genre = createElementWithClass('div', 'modal-genre')
    genreList = movieDetails['genres']
    if (genreList.length < 2) {
        genre.innerHTML = '<b>Genre:</b> ' + movieDetails['genres']
    } else {
        genre.innerHTML = '<b>Genres:</b> ' + movieDetails['genres'].join(', ')
    }
    additionalDetails.push(genre)

    let director = createElementWithClass('div', 'modal-director')
    director.innerHTML = '<b>Réalisateur:</b> ' + movieDetails['directors']
    additionalDetails.push(director)

    let actors = createElementWithClass('div', 'modal-actors')
    actors.innerHTML = '<b>Acteurs:</b> ' + movieDetails['actors'].join(', ')
    additionalDetails.push(actors)

    return additionalDetails
}

/** Calls helper functions to create all elements corresponding to
 *  movie details and then appends them to the modal.
 *
 * @param {object} movieDetails Movie details.
 */
function populateModal(movieDetails) {
    let modal = document.getElementsByClassName('modal-wrapper')[0]

    let elements = []

    elements.push(createHeader(movieDetails))

    elements.push(createGlobalDetails(movieDetails))

    elements.push(createDescription(movieDetails['description']))

    elements.push(...createAdditionalDetails(movieDetails))

    for (var i = 0; i < elements.length; i++) {
        modal.appendChild(elements[i])
    }
}

/** Given a movie's id, calls for its details fetching and display
 *  to show the corresponding modal.
 *
 * @param {number} id Movie's unique id.
 */
const openModal = async function (id) {
    modal = await loadModal(id)
    loader = document.getElementById('loader-Modal')
    loader.style.display = 'block'
    const movieDetails = await queryMovieDetails(id)
    populateModal(movieDetails)
    loader.style.display = 'none'
    modal.style.display = null

    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.modal-close').addEventListener('click', closeModal)
}

/** Handles modal removal on click.
 *
 * @param {object} e Click object.
 */
const closeModal = function (e) {
    if (modal === null) return
    modal.querySelector('.modal-wrapper').innerHTML =
        '<div class="loader" id="loader-Modal" style="display: none">'
    e.preventDefault()
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.modal-close').removeEventListener('click', closeModal)

    const hideModal = function () {
        modal.style.display = 'none'
        modal.removeEventListener('animationend', hideModal)
        modal = null
    }
    modal.addEventListener('animationend', hideModal)
}

/** Loads the modal element from its HTML file.
 *
 * @return {object} Modal element.
 */
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

/** Add an event listener to a DOM element opening
 * corresponding modal on click.
 *
 * @param {object} item DOM Element to be considered.
 */
function addModal(item) {
    item.addEventListener('click', function () {
        openModal(item.id)
    })
}
