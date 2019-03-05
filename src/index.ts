import * as app from './config/express';
import * as config from './config/config';

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port} (${config.env})`);
});

export = app;
