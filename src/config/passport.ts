import {userModel as User} from '../models/user.model';
import * as config from './config';
import {ExtractJwt, Strategy as JWTStrategy} from 'passport-jwt';
import {Strategy as LocalStrategy} from "passport-local";
import passport = require('passport');
import bcrypt = require('bcrypt');

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
    let user = await User.findById(payload.id);
    if (!user) {
        return done(null, false);
    }
    done(null, user);
});


passport.use('jwt', jwtLogin);
passport.use('local', localLogin);

export = passport;
