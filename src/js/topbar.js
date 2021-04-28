function fadeNav() {
    var offset = getScrollXY()
    console.log('OFFSET', offset[1] / 100)
    //if y offset is greater than 0, set opacity to desired value, otherwise set to 1
    setNavOpacity(offset[1] / 150)
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

window.onscroll = fadeNav
