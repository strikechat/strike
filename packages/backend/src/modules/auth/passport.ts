import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {
    ExtractJwt,
    Strategy as JwtStrategy,
    VerifiedCallback,
} from 'passport-jwt';
import jwt from 'jsonwebtoken';
import UserModel, { User } from '../database/models/User';

// Passport Local Strategy setup
export const setupPassport = () => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username });
                if (!user)
                    return done(null, false, {
                        message: 'Incorrect username.',
                    });

                const isMatch = await user.checkPassword(password);
                if (!isMatch)
                    return done(null, false, {
                        message: 'Incorrect password.',
                    });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.STRIKE_JWT_SECRET ?? 'secret',
            },
            async (payload: any, done: VerifiedCallback) => {
                try {
                    const user = await UserModel.findById(payload.id);
                    if (!user) return done(null, false);

                    const safeUser = {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                    };

                    return done(null, safeUser);
                } catch (err) {
                    return done(err);
                }
            },
        ),
    );
};

// JWT auth function
export const login = (user: any) => {
    return jwt.sign(user, process.env.STRIKE_JWT_SECRET ?? 'secret');
};

// Middleware to require login
export const requireLoggedIn = () =>
    passport.authenticate('jwt', { session: false });

export const getUserFromToken = (req: any, res: any, next: any) => {
    passport.authenticate(
        'jwt',
        { session: false },
        async (err, user: User | false) => {
            if (err) return next(err);

            if (user) {
                req.user = user; // Nie musisz już wywoływać getSafeUser()
            }

            next();
        },
    )(req, res, next);
};

export { passport };
