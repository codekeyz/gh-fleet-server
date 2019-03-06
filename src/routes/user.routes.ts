import express = require('express');
import UserController = require('../controllers/user.controller');
import DriverController = require("../controllers/driver.controller");

const userCtrl = new UserController();
const driverCtrl = new DriverController();

const router = express.Router();

router.get('/', userCtrl.getUser);
router.get('/me', driverCtrl.logme);

export = router;
