// noinspection JSUnresolvedFunction

const pageName = document.documentElement.getAttribute('page-name');
const startTime = Date.now();

// 引入intro
require('./public/intro');

// 引入全局样式
require('./public/css/common.styl');

// 引入全局js
require.context('./public/js/', true, /\.js$/i);

// 加载页面上下文
async function loadVueComponents() {
  require.ensure(
    [],
    () => {
      const ctx = require.context(`./pages/`, true, /\.vue?$/i, 'lazy-once');
      ctx.keys().forEach(async key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) {
          const Vue = await import('vue');
          const component = (await ctx(key)).default;
          const mountId = `vue-${component.name}`;
          if (document.getElementById(mountId))
            Vue.createApp(component).mount(`#${mountId}`);
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
    // eslint-disable-next-line no-console
    console.log('using development hot update.');
    module.hot.accept();
  }
}

window.addEventListener('load', async () => {
  const pageLoadStartTime = Date.now();
  await Promise.all([loadPageStyles(), loadPageScripts(), loadVueComponents()]);
  const endTime = Date.now();
  // eslint-disable-next-line no-console
  console.log(`server process time: ${window.handleTime}ms`);
  // eslint-disable-next-line no-console
  console.log(`server render time: ${window.renderTime}ms`);
  // eslint-disable-next-line no-console
  console.log(`content load time: ${endTime - pageLoadStartTime}ms`);
  // eslint-disable-next-line no-console
  console.log(`page load complete. (${endTime - startTime}ms)`);
});
