/** Fetches a movie details from API.
 *
 * @param {number} id Unique id of movie to be fetched.
 * @return {object} Movie details fetched from API.
 */
async function queryMovieDetails(id) {
    const response = await fetch(APIURL + 'titles/' + id)
    const data = await response.json()
    console.log(typeof data)
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
