const pageName = document.documentElement.getAttribute('page-name');

// 引入intro
require('@public/intro');

// 引入全局样式
require('@public/css/common.styl');

// 引入全局js
require.context('@public/js/', true, /\.js$/i);

async function waitVueLoading(components) {
  if (!components.length) return;
  try {
    const Vue = await import('vue');
    const antd = (await import('@lib/antd-components')).default;
    components.forEach(component => {
      const mountId = `vue-${component.name}`;
      if (document.getElementById(mountId)) {
        const app = Vue.createApp(component);
        antd.use(app);
        app.mount(`#${mountId}`);
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`load Vue components failed: ${e}`);
  }
}

// 加载页面上下文
async function loadVueComponents() {
  await require.ensure(
    [],
    async () => {
      const ctx = require.context(`@pages/`, true, /\.vue?$/i, 'lazy-once');
      const components = [];
      await Promise.all(
        ctx.keys().map(async key => {
          const contextDir = key.split('/')[1];
          if (contextDir === pageName)
            components.push((await ctx(key)).default);
        })
      );
      await waitVueLoading(components);
    },
    'vue-components'
  );
}

async function loadPageStyles() {
  await require.ensure(
    [],
    () => {
      const ctx = require.context(
        `@pages/`,
        true,
        /\.(styl(us)?|css)?$/i,
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
  await require.ensure(
    [],
    () => {
      const ctx = require.context(`@pages/`, true, /\.js?$/i, 'lazy-once');
      ctx.keys().forEach(async key => {
        const contextDir = key.split('/')[1];
        if (contextDir === pageName) await ctx(key);
      });
    },
    'page-scripts'
  );
}

const pageLoadStartTime = Date.now();
Promise.all([loadPageStyles(), loadPageScripts(), loadVueComponents()]).then(
  () => {
    // eslint-disable-next-line no-console
    console.log(`content load time: ${Date.now() - pageLoadStartTime}ms`);
  }
);
