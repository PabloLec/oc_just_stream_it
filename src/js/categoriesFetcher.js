let APIURL = 'https://pablo.hd.free.fr/django/api/v1/'

function createDivWithClass(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
}

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

function fetchResults(results, category) {
    for (const result of results) {
        let movie = document.createElement('div')
        movie.className = 'item'
        movie.id = result['id']

        let image_div = document.createElement('div')
        image_div.className = 'item__image'
        movie.appendChild(image_div)

        let image = document.createElement('img')
        image.src = result['image_url']
        image_div.appendChild(image)

        let body_div = document.createElement('div')
        body_div.className = 'item__body'
        movie.appendChild(body_div)

        let title = document.createElement('div')
        title.className = 'item__title'
        title.innerHTML =
            result['title'].substr(0, 20) + (this.length > 20 ? '&hellip;' : '')
        body_div.appendChild(title)

        let description = document.createElement('div')
        description.className = 'item__description'
        description.innerHTML =
            result['year'] + ' - ' + getRatingStars(result['imdb_score'])
        body_div.appendChild(description)

        let carouselId = 'carousel-' + category
        document.getElementById('carousel-' + category).appendChild(movie)
        addModal(movie)
    }
}

async function queryPage(page, category) {
    let response = await fetch(page)
    let data = await response.json()
    fetchResults(data['results'], category)
    return data['next']
}

async function getCategory(category) {
    let nextPage = await queryPage(
        APIURL + 'titles/?sort_by=-year;-imdb_score,-votes&genre=' + category,
        category,
    )

    for (let i = 0; i < 5; i++) {
        nextPage = await queryPage(nextPage, category)
    }
}

var genres = ['Comedy', 'Action', 'Sci-Fi']

for (var i = 0; i < genres.length; i++) {
    getCategory(genres[i])
}
