import express = require('express');

class UserController {
  constructor() {}

  async getUser(req: express.Request, res: express.Response) {
    return await res.send('Hello world')
  }
}

export = UserController;
