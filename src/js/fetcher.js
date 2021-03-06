/** Categories displayed in carousels on index page.*/
const CATEGORIES = ['TopRated', 'Comedy', 'Action', 'Sci-Fi']

/** Helper function to create a DOM element and set
 * its class in a single line.
 *
 * @param {string} tag Element tag.
 * @param {string} className Class name to be set.
 * @return {object} Created div.
 */
function createElementWithClass(tag, className) {
    let div = document.createElement(tag)
    div.setAttribute('class', className)
    return div
}

/** Helper function to transform a rating out of ten
 * into an out of five visual star rating using
 * font awesome stars.
 *
 * @param {number} rating Movie rating /10.
 * @return {string} Corresponding fa stars.
 */
function getRatingStars(rating) {
    let roundedRating = Math.ceil(rating * 2) / 4

    fullStar = '<i class="fas fa-star fa-sm" style="color:#7957ec"></i>'
    halfStar =
        '<i class="fas fa-star-half-alt fa-sm" style="color:#7957ec"></i>'
    emptyStar = '<i class="fas fa-star fa-sm" style="color:#2a2d2e"></i>'

    let starRating =
        fullStar.repeat(roundedRating - (roundedRating % 1)) +
        (roundedRating % 1 != 0 ? halfStar : '') +
        emptyStar.repeat(5 - Math.ceil(roundedRating))

    return starRating
}

/** Takes a results array corresponding to movies details
 * then creates their cards into the carousel.
 *
 * @param {array} results Movies details.
 * @param {string} category Movies category.
 */
function createMoviesCards(results, category) {
    for (const result of results) {
        let movie = createElementWithClass('div', 'item')
        movie.id = result['id']

        let image_div = createElementWithClass('div', 'item-image')
        movie.appendChild(image_div)

        let image = document.createElement('img')
        image.src = result['image_url']
        image_div.appendChild(image)

        let body_div = createElementWithClass('div', 'item-body')
        movie.appendChild(body_div)

        let title = createElementWithClass('div', 'item-title')
        title.innerHTML =
            result['title'].substr(0, 20) + (this.length > 20 ? '&hellip;' : '')
        body_div.appendChild(title)

        let description = createElementWithClass('div', 'item-description')
        description.innerHTML =
            result['year'] + ' - ' + getRatingStars(result['imdb_score'])
        body_div.appendChild(description)

        document.getElementById('carousel-' + category).appendChild(movie)
        addModal(movie)
    }
}

/** Fetch a result page from API and calls corresponding
 * cards creation.
 *
 * @param {number} page Current page number.
 * @param {string} category Category to be fetched.
 * @return {number} Next page to be fetched.
 */
async function queryPage(page, category) {
    let response = await fetch(page)
    let data = await response.json()
    createMoviesCards(data['results'], category)
    return data['next']
}

/** Handles the whole fetching process and loading spinner display.
 *
 * @param {string} category Category to be fetched.
 */
async function getCategory(category) {
    let container = document.getElementById('carousel-' + category)
    let loader = document.getElementById('loader-' + category)
    container.style.display = 'none'

    let firstPage = APIURL + 'titles/?sort_by=-year;-imdb_score,-votes'
    if (category != 'TopRated') {
        firstPage += '&genre=' + category
    }

    let nextPage = await queryPage(firstPage, category)

    loader.style.display = 'none'
    container.style.display = 'block'

    for (let i = 0; i < 5; i++) {
        nextPage = await queryPage(nextPage, category)
    }
}

/** Fetches a movie details from API.
 *
 * @param {number} id Unique id of movie to be fetched.
 * @return {object} Movie details fetched from API.
 */
async function queryMovieDetails(id) {
    const response = await fetch(APIURL + 'titles/' + id)
    const data = await response.json()
    return data
}

/** Searches in a result page for a suitable movie
 *  to be featured in index page.
 *
 * @param {number} page Page number to be searched in.
 * @return {number} Featured movie unique id.
 */
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
    return searchFeaturedMovie(page + 1)
}

/** Creates the div on index page for featured
 *  movie display.
 */
async function createFeaturedMovieDiv() {
    let container = document.getElementsByClassName('featured-container')[0]
    container.style.display = 'none'
    let loader = document.getElementById('loader-Featured')

    const featuredMovieId = await searchFeaturedMovie((page = 1))
    let featuredMovie = await queryMovieDetails(featuredMovieId)

    container.style.backgroundImage =
        "url('" + featuredMovie['image_url'].split('_.')[0] + "')"
    container.setAttribute('id', featuredMovieId)
    let name = document.getElementsByClassName('featured-name')[0]
    name.innerHTML = featuredMovie['title']
    loader.style.display = 'none'
    container.style.display = 'block'
    addModal(container)
}

createFeaturedMovieDiv()
