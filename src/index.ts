﻿import * as http from './config/socket.io';
import * as config from './config/config';

http.listen(config.port, () => {
    console.log(`Server started on ${config.port} (${config.env})`);
});
