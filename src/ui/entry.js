// noinspection JSUnresolvedFunction

const startTime = Date.now();

require('./pageloader');

window.addEventListener('load', async () => {
  const endTime = Date.now();
  // eslint-disable-next-line no-console
  console.log(
    `server process time: ${window.handleTime}ms, render time: ${window.renderTime}ms `
  );
  // eslint-disable-next-line no-console
  console.log(`page load complete. (${endTime - startTime}ms)`);
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      // eslint-disable-next-line no-console
      console.log('using hot update.');
      module.hot.accept();
    }
  }
});
