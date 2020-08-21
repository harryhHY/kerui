function showHttploading(showHttploading) {
    if (showHttploading == true) {
        this.setData({
            showHttploading: false
        })
    } else {
        this.setData({
            showHttploading: true
        })
    }
}
export {
    showHttploading
}