const startTime = new Date();
// 引入intro
require('./public/intro');

// 引入全局样式
require.context('./public/css/', true, /\.styl(us)?$/i);

// 引入全局js
require.context('./public/js/', true, /\.js$/i);

// 加载页面上下文
const pageName = document.documentElement.getAttribute('page-name');

async function loadVueComponents() {
  require.ensure(
    [],
    () => {
      const ctx = require.context(`./pages/`, true, /\.vue?$/i, 'lazy-once');
      ctx.keys().forEach(async key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) {
          const Vue = require('vue');
          const component = (await ctx(key)).default;
          const mount_id = `vue-${component.name}`;
          if (document.getElementById(mount_id))
            Vue.createApp(component).mount(`#${mount_id}`);
        }
      });
    },
    'vue-components'
  );
}

async function loadPageStyles() {
  require.ensure(
    [],
    () => {
      const ctx = require.context(
        `./pages/`,
        true,
        /\.styl(us)?$/i,
        'lazy-once'
      );
      ctx.keys().forEach(async key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) await ctx(key);
      });
    },
    'page-styles'
  );
}

async function loadPageScripts() {
  require.ensure(
    [],
    () => {
      const ctx = require.context(`./pages/`, true, /\.js?$/i, 'lazy-once');
      ctx.keys().forEach(async key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) await ctx(key);
      });
    },
    'page-scripts'
  );
}

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    console.log('using development hot update.');
    module.hot.accept();
  }
}

window.addEventListener('load', async () => {
  await loadPageStyles();
  await loadPageScripts();
  await loadVueComponents();
  const endTime = new Date();
  console.log(`page load complete. (${endTime - startTime}ms)`);
});
