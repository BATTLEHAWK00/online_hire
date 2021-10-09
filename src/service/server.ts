import http from 'http';
import configProvider, { MainConfig } from '../lib/configProvider';

function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

// function normalizeAddress(val: string | null) {
//   if (val === '::') return '0.0.0.0';
//   return val;
// }

class HttpServer {
  server: http.Server;

  GlobalConfig: MainConfig;

  port: string | number | boolean;

  private static onError(
    that: HttpServer,
    error: { syscall: string; code: never }
  ) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind =
      typeof that.port === 'string' ? `Pipe ${that.port}` : `Port ${that.port}`;
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private static onListening(that: HttpServer) {
    console.log(`Server listening on ${that.port}`);
  }

  Start(app: http.RequestListener) {
    this.server.addListener('request', app);
    this.server.listen(this.port);
  }

  constructor() {
    this.server = http.createServer();
    this.server.on('error', (error: { syscall: string; code: never }) =>
      HttpServer.onError(this, error)
    );
    this.server.on('listening', () => HttpServer.onListening(this));
    this.GlobalConfig = configProvider.getGlobalConfig();
    this.port = normalizePort(
      process.env.PORT || this.GlobalConfig.server.port || '3000'
    );
  }
}

module.exports = {
  server: new HttpServer(),
};
