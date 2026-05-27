export const getWindowAnchorID = (start: number) => `card-window-${start}`

const getScrollOffset = () => {
    if (window.matchMedia('(max-width: 1100px)').matches) {
        return 150
    }

    return 96
}

export const scrollToCardWindow = (start: number) => {
    const target = document.getElementById(getWindowAnchorID(start))

    if (target == null) {
        return
    }

    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset()

    window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth',
    })
}
