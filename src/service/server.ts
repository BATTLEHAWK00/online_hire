import http from 'http';

let server: http.Server | null = null;

class HttpServer {
  port: string | undefined;

  onError(error: { syscall: string; code: any }) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind =
      typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    // @ts-ignore
    const addr = server.address();
    // @ts-ignore
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    // @ts-ignore
    console.log('Server listening on ' + addr.address + ' ' + bind);
  }

  async Start(app: http.RequestListener | undefined) {
    const configProvider = require('../lib/configProvider');

    const GlobalConfig = configProvider.default.getGlobalConfig();
    const port = normalizePort(
      process.env.PORT || GlobalConfig.server.port || '3000'
    );
    /**
     * Create HTTP server.
     */
    server = http.createServer(app);

    // @ts-ignore
    app.set('port', port);
    server.listen(port);
    server.on('error', this.onError);
    server.on('listening', this.onListening);
  }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = {
  server: new HttpServer(),
};
