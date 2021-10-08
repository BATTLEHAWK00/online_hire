const startTime = new Date()
// 引入全局样式
require.context('./public/css/', true, /\.styl(us)?$/i);

// 引入全局js
require.context('./public/js/', true, /\.js$/i);

// 引入intro
import(/* webpackChunkName: "intro" */'./public/intro')

// 加载页面上下文
const pageName = document.documentElement.getAttribute('page-name')

function loadVueComponents() {
    require.ensure([], () => {
        const ctx = require.context(`./pages/`, true, /\.vue?$/i)
        ctx.keys().forEach(key => {
            const contextDir = key.split('/')[1];
            if (contextDir === pageName) {
                const Vue = require("vue");
                const component = ctx(key).default
                const mount_id = `vue-${component.name}`
                if (document.getElementById(mount_id)) Vue.createApp(component).mount(`#${mount_id}`)
            }
        })
    }, 'vue-components');
}

function loadPageStyles() {
    require.ensure([], () => {
        const ctx = require.context(`./pages/`, true, /\.styl(us)?$/i)
        ctx.keys().forEach(key => {
            const contextDir = key.split('/')[1];
            // if (contextDir === pageName) ctx(key)
        })
    }, 'page-styles');
}

function loadPageScripts() {
    require.ensure([], () => {
        const ctx = require.context(`./pages/`, true, /\.js?$/i)
        ctx.keys().forEach(key => {
            const contextDir = key.split('/')[1];
            if (contextDir === pageName) ctx(key)
        })
    }, 'page-scripts');
}

window.onload = () => {
    loadPageStyles()
    loadPageScripts()
    loadVueComponents()
    const endTime = new Date()
    console.log(`page load complete. (${endTime - startTime}ms)`)
}

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        console.log('using development hot update.')
        module.hot.accept();
    }
}
