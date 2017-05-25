"use strict";

const passport = require("passport");

module.exports = (conf, Bloggify) => {

    let Strategy = null;
    try {
        Strategy = require(`passport-${conf.strategy}`);
    } catch (e) {
        if (e.code === "MODULE_NOT_FOUND") {
            throw new Error(`Please install 'passport-${conf.strategy}' manually in your app, by running: npm install --save passport-${conf.strategy}`);
        }
    }

    // Configure the strategy options
    conf.auth_options = Object.assign({
        successRedirect: conf.success_url,
        failure_redirect: conf.login_url,
        session: false
    }, conf.auth_options);

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((user, cb) => {
        cb(null, {
            johnny: true
        });
    });

    passport.use(new Strategy(
        conf.strategy_options,
        function () {
            if (typeof conf.verify_callback !== "function") {
                Bloggify.log(new Error("Please provide a verify_callback function in the configuration."));
            } else {
                conf.verify_callback.apply(Bloggify, arguments);
            }
        }
    ));

    // Configure the login url
    Bloggify.server.app.use(passport.initialize());
    Bloggify.server.before(conf.login_url, "post", (ctx, cb) => {
        const done = (err, user) => {
            if (err) {
                if (conf.failure_url) {
                    return ctx.redirect(conf.failure_url);
                } else {
                    ctx.loginError = err;
                    cb();
                }
            } else {
                if (conf.success_url) {
                    return ctx.redirect(conf.success_url);
                } else {
                    ctx.user = user;
                    cb();
                }
            }
        };
        if (ctx.user) { return done(null, ctx.user); }
        passport.authenticate(conf.strategy, conf.auth_options, (err, user, info) => {
            if (err) { return done(err); }
            ctx.setSessionData({ user });
            done(null, user);
        })(ctx.req, ctx.res, ctx.next);
    });

    Bloggify.server.before("*", "all", ctx => {
        ctx.user = ctx.getSessionData("user");
    });

    if (conf.success_url) {
        Bloggify.server.before(conf.login_url, "get", (ctx, cb) => {
            if (ctx.user) {
                return ctx.redirect(conf.success_url);
            }
            cb();
        });
    }
};
