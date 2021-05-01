function fadeNav() {
    var offset = getScrollXY()
    let featuredImageHeight = document.documentElement.clientHeight * 0.6
    setNavOpacity(offset[1] / featuredImageHeight)
}

function setNavOpacity(newOpacity) {
    var navBar = document.getElementById('navbar')
    navBar.style.background = 'rgba(19, 21, 22,' + newOpacity + ')'
}

function getScrollXY() {
    var scrOfX = 0,
        scrOfY = 0
    if (typeof window.pageYOffset == 'number') {
        //Netscape compliant
        scrOfY = window.pageYOffset
        scrOfX = window.pageXOffset
    } else if (
        document.body &&
        (document.body.scrollLeft || document.body.scrollTop)
    ) {
        //DOM compliant
        scrOfY = document.body.scrollTop
        scrOfX = document.body.scrollLeft
    } else if (
        document.documentElement &&
        (document.documentElement.scrollLeft ||
            document.documentElement.scrollTop)
    ) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop
        scrOfX = document.documentElement.scrollLeft
    }

    return [scrOfX, scrOfY]
}

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
