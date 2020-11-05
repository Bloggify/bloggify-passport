"use strict";

const passport = require("passport");

/**
 * @name bloggify:init
 * @param {Object} config
 *
 *  - `strategy` (String): The PassportJS strategy name (default: "local").
 *  - `auth_options` (Object): Contains the authentication options.
 *  - `strategy_options` (Object): Contains the strategy options.
 *  - `success_url` (String): The access URL.
 *  - `login_url` (String): The login URL.
 *  - `verify_callback`(Function): The PassportJS callback function.
 *  - `failure_url` (String): The login error URL.
 *  - `fresh_user` (String): Whether to reload the user data on each request (default: `false`)
 *
 * The model objects can be accessed by requiring the module or accessing the `Bloggify.models` object.
 */
module.exports = function (conf) {

    let Strategy = null;
    try {
        Strategy = require("passport-" + conf.strategy);
    } catch (e) {
        if (e.code === "MODULE_NOT_FOUND") {
            throw new Error("Please install 'passport-" + conf.strategy + "' manually in your app, by running: npm install --save passport-" + conf.strategy);
        }
        throw e;
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
        cb(null, {});
    });

    passport.use(new Strategy(conf.strategy_options, () => {
        if (typeof conf.verify_callback !== "function") {
            Bloggify.log(new Error("Please provide a verify_callback function in the configuration."));
        } else {
            conf.verify_callback.apply(Bloggify, arguments);
        }
    }));

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

        if (ctx.user) {
            return done(null, ctx.user);
        }

        passport.authenticate(conf.strategy, conf.auth_options, (err, user, info) => {
            if (err) { return done(err); }
            ctx.setSessionData({ user: user });
            done(null, user);
        })(ctx.req, ctx.res, ctx.next);
    });

    const proxyFn = conf.fresh_user ? (ctx, cb) => {
        ctx.user = ctx.getSessionData("user");
        Bloggify.models.User.findOne({
            where: {
                id: ctx.user.id
            }
        }).then(user => {
            setTimeout(() => {
                if (!user) {
                    Bloggify.log(new Error("Cannot find the user."), "error")
                } else {
                    ctx.user = ctx.session.user = user.toJSON()
                    ctx.setSessionData("user", ctx.user);
                }
                cb()
            })
        }).catch(e => {
            Bloggify.log(e)
            cb()
        })
    } : ctx => {
        ctx.user = ctx.getSessionData("user");
    };
    Bloggify.server.before("*", "all", proxyFn);

    if (conf.success_url) {
        Bloggify.server.before(conf.login_url, "get", function (ctx, cb) {
            if (ctx.user) {
                return ctx.redirect(conf.success_url);
            }
            cb();
        });
    }
};
