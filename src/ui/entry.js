const startTime = new Date()
const Vue = require('vue')
// 引入全局样式
require.context('./public/css/', true, /\.styl(us)?$/i);

// 引入全局js
// require.context('./public/js/', true, /\.js$/i);

// 引入intro
require('./public/intro')

// 加载页面上下文
const pageName = document.documentElement.getAttribute('page-name')

function loadPageContext(ctx) {
    ctx.keys().forEach(key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) ctx(key)
    })
}

function loadVueComponents(ctx) {
    ctx.keys().forEach(key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) {
            const component = ctx(key).default
            const mount_id = `vue-${component.name}`
            if (document.getElementById(mount_id)) Vue.createApp(component).mount(`#${mount_id}`)
        }
    })
}

loadPageContext(require.context(`./pages/`, true, /\.styl(us)?$/i))

window.onload = () => {
    loadVueComponents(require.context(`./pages/`, true, /\.vue?$/i))
    loadPageContext(require.context(`./pages/`, true, /\.js?$/i))
    const endTime = new Date()
    console.log(`load complete. (${endTime - startTime}ms)`)
}
