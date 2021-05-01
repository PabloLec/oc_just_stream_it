async function queryMovieInfo(id) {
    const response = await fetch(APIURL + 'titles/' + id)
    const data = await response.json()
    return data
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

async function createFeaturedMovieDiv() {
    let container = document.getElementsByClassName('featured-container')[0]
    container.style.display = 'none'
    let loader = document.getElementById('loader-Featured')

    const featuredMovieId = await searchFeaturedMovie((page = 1))
    let featuredMovie = await queryMovieInfo(featuredMovieId)

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
