class Carousel {
    constructor(element) {
        var _this = this
        this.id_list = []
        this.element = element

        this.scrollStep = 2
        this.imagesVisibile = window.innerWidth / (182 + 50)
        this.items = []
        this.currentItem = 0

        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)

        this.createNavButtons()

        // Evenements
        this.element.addEventListener(
            'DOMNodeInserted',
            function (e) {
                let id = e.target.id
                if (_this.id_list.includes(id) || id.length === 0) {
                    return
                } else {
                    _this.id_list.push(id)
                }
                _this.items.push(e.target)
                let item = _this.createDivWithClass('carousel__item')
                item.appendChild(e.target)
                _this.container.appendChild(item)
                _this.setCarouselWidth()
            },
            false,
        )
    }

    setCarouselWidth() {
        let ratio = this.items.length / this.imagesVisibile + 1
        this.container.style.width = ratio * 100 + '%'
    }

    createNavButtons() {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
    }

    next() {
        this.gotoItem(this.currentItem + this.scrollStep)
    }

    prev() {
        this.gotoItem(this.currentItem - this.scrollStep)
    }

    gotoItem(index) {
        if (index < 0) {
            return
        } else if (
            index >= this.items.length ||
            (this.items[this.currentItem + Math.floor(this.imagesVisibile)] ===
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

    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }
}

var carousels = []

let onReady = function () {
    carousels.push(new Carousel(document.querySelector('#carousel1')))
}

if (document.readyState !== 'loading') {
    onReady()
}
document.addEventListener('DOMContentLoaded', onReady)

function onWindowResize() {
    for (var i = 0; i < carousels.length; i++) {
        carousels[i].imagesVisibile = window.innerWidth / (182 + 50)
        carousels[i].setCarouselWidth()
    }
}

window.addEventListener('resize', onWindowResize)
