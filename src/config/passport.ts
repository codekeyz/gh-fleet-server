import User = require('../models/user.model');
import bcrypt = require('bcrypt');
import * as config from './config';

import * as passport from 'passport';
import {ExtractJwt, Strategy as JWTStrategy} from 'passport-jwt';
import {Strategy as LocalStrategy} from "passport-local";

const localLogin = new LocalStrategy({
    usernameField: 'email'
}, async (email: string, password: string, done: any) => {

    let user: any = await User.findOne({email});
    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
    }
    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
});

const jwtLogin = new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}, async (payload, done) => {
    let user = await User.findById(payload._id);
    if (!user) {
        return done(null, false);
    }
    const userObj: any = user.toObject();
    delete userObj.hashedPassword;
    done(null, user);
});


passport.use(jwtLogin);
passport.use(localLogin);

export = passport;
