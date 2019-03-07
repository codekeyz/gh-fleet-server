import {Application, Request, Response, Router} from 'express';
import {injectable} from "inversify";
import {UserContract} from '../../di/interfaces';
import express = require('express');
import "reflect-metadata";


@injectable()
class UserController implements UserContract {

    private router = express.Router();

    initialize(app: Application) {
        app.use(this.getRouter());
    }

    login(req: Request, res: Response): void {
    }

    logout(): void {
    }

    register(req: Request, res: Response): void {
    }

    private getRouter(): Router {

        // User Controller REST METHODS HERE

        return this.router;
    }

}

export = UserController;
