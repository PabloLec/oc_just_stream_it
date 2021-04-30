const focusableSelector = 'button, a, input, textarea'
let modal = null

const openModal = async function (id) {
    modal = await loadModal(id)
    const movieInfo = await queryMovieInfo(id)
    populateModal(movieInfo)
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
    modal.querySelector('.modal-wrapper').innerHTML = ''
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
