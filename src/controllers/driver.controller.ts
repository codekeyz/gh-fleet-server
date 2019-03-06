import express = require('express');

class DriverController {
  constructor() {}

  async logme(req: express.Request, res: express.Response) {
      return await res.send(req.body)
  }
}

export = DriverController;
