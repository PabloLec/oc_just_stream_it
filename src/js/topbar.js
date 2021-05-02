/** Calculates the navbar opacity depending on featured image height.*/
function fadeNav() {
    var offset = getScrollY()
    let featuredImageHeight = document.documentElement.clientHeight * 0.6
    setNavOpacity(offset / featuredImageHeight)
}

/** Sets the background opacity of the navbar.
 *
 * @param {number} newOpacity RGBA opacity to be set.
 */
function setNavOpacity(newOpacity) {
    var navBar = document.getElementById('navbar')
    navBar.style.background = 'rgba(19, 21, 22,' + newOpacity + ')'
}

/**  Gets current Y scroll offset.
 *
 * @return {number} Y offset.
 */
function getScrollY() {
    var scrollY = 0
    if (typeof window.pageYOffset == 'number') {
        //Netscape compliant
        scrollY = window.pageYOffset
    } else if (
        document.body &&
        (document.body.scrollLeft || document.body.scrollTop)
    ) {
        //DOM compliant
        scrollY = document.body.scrollTop
    } else if (
        document.documentElement &&
        (document.documentElement.scrollLeft ||
            document.documentElement.scrollTop)
    ) {
        //IE6 standards compliant mode
        scrollY = document.documentElement.scrollTop
    }

    return scrollY
}

/**  Called on "Categories" topbar button click. Displays
 *   the categories sub menu or hide it if already displayed.
 */
function displaySubMenu() {
    let subMenu = document.getElementsByClassName('cat-sub-menu')[0]
    let actualDisplay = subMenu.style.display
    if (actualDisplay !== '') {
        subMenu.style.display = ''
    } else {
        subMenu.style.display = 'none'
    }
}

window.onscroll = fadeNav
