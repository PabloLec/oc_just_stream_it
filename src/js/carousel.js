/** A carousel builder for categories' movies display. */
class Carousel {
    /**
     * @param {object} targetDiv DOM div to create the carousel in.
     */
    constructor(targetDiv) {
        var _this = this
        this.targetDiv = targetDiv
        this.scrollStep = 2
        this.imagesVisible = window.innerWidth / (182 + 50)

        this.id_list = []
        this.items = []
        this.currentItem = 0

        this.root = createElementWithClass('div', 'carousel')
        this.container = createElementWithClass('div', 'carousel-container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.targetDiv.appendChild(this.root)

        this.createNavButtons()

        // Add any new movie div to carousel
        var newMovieObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    let id = mutation.addedNodes[i].id
                    if (_this.id_list.includes(id) || id.length === 0) {
                        return
                    } else {
                        _this.id_list.push(id)
                    }
                    _this.items.push(mutation.addedNodes[i])
                    let item = createElementWithClass('div', 'carousel-item')
                    item.appendChild(mutation.addedNodes[i])
                    _this.container.appendChild(item)
                    _this.setCarouselWidth()
                }
            })
        })
        newMovieObserver.observe(this.targetDiv, { childList: true })
    }

    /** Sets sufficient carousel width to hide overflow depending
     * on browser window width.
     */
    setCarouselWidth() {
        let ratio = this.items.length / this.imagesVisible + 1
        this.container.style.width = ratio * 100 + '%'
    }

    /** Creates left and right nav buttons. */
    createNavButtons() {
        let nextButton = createElementWithClass('div', 'carousel-next')
        let prevButton = createElementWithClass('div', 'carousel-prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
    }

    /** Called on right nav button click. */
    next() {
        this.gotoItem(this.currentItem + this.scrollStep)
    }

    /** Called on left nav button click. */
    prev() {
        this.gotoItem(this.currentItem - this.scrollStep)
    }

    /** Translates the carousel to required item.
     *
     * @param {number} index Carousel item index to go to.
     */
    gotoItem(index) {
        if (index < 0) {
            index = this.items.length - Math.floor(this.imagesVisible)
        } else if (
            index >= this.items.length ||
            (this.items[this.currentItem + Math.floor(this.imagesVisible)] ===
                undefined &&
                index > this.currentItem)
        ) {
            index = 0
        }
        let translateX = (index * -100) / this.items.length
        this.container.style.transform =
            'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
    }
}

/** Creates a carousel for every element present in
 * CATEGORIES array.
 */
function createCarousels() {
    for (var i = 0; i < CATEGORIES.length; i++) {
        carousels.push(
            new Carousel(document.querySelector('#carousel-' + CATEGORIES[i])),
        )
    }
}

/** Calls the API Fetch to populate the carousels. */
async function populateCarousels() {
    for (var i = 0; i < CATEGORIES.length; i++) {
        getCategory(CATEGORIES[i])
    }
}

/** Reset every carousel's width on window resize. */
function onWindowResize() {
    for (var i = 0; i < carousels.length; i++) {
        carousels[i].imagesVisible = window.innerWidth / (182 + 50)
        carousels[i].setCarouselWidth()
    }
}

window.addEventListener('resize', onWindowResize)

// Array of created carousels, useful for dynamic resizing.
var carousels = []

createCarousels()

populateCarousels()
