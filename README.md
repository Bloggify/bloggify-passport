
# bloggify-passport

 [![Version](https://img.shields.io/npm/v/bloggify-passport.svg)](https://www.npmjs.com/package/bloggify-passport) [![Downloads](https://img.shields.io/npm/dt/bloggify-passport.svg)](https://www.npmjs.com/package/bloggify-passport)

> Passport.js authentication for Bloggify.

## :cloud: Installation

```sh
$ npm i --save bloggify-passport
```


## :clipboard: Example



```js
const passport = ["passport", {
    login_url: "/user/signin",
    verify_callback (email, password, cb) {
        if (email === "foo@bar.com" && password === "42") {
            return cb(null, { name: "foo" })
        }
        cb(new Error("Invalid username or password."))
    }
}]
```

## :question: Get Help

There are few ways to get help:

 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:
 3. For direct and quick help from me, you can [use Codementor](https://www.codementor.io/johnnyb). :rocket:


## :memo: Documentation


### `bloggify:init(config)`

#### Params
- **Object** `config`:
 - `strategy` (String): The PassportJS strategy name (default: "local").
 - `auth_options` (Object): Contains the authentication options.
 - `strategy_options` (Object): Contains the strategy options.
 - `success_url` (String): The access URL.
 - `login_url` (String): The login URL.
 - `verify_callback`(Function): The PassportJS callback function.
 - `failure_url` (String): The login error URL.

The model objects can be accessed by requiring the module or accessing the `Bloggify.models` object.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`bloggify-user-auth`](https://github.com/Bloggify/user-auth#readme) (by Bloggify)—User management for Bloggify.

## :scroll: License

[MIT][license] © [Bloggify][website]

[license]: http://showalicense.com/?fullname=Bloggify%20%3Csupport%40bloggify.org%3E%20(https%3A%2F%2Fbloggify.org)&year=2017#license-mit
[website]: https://bloggify.org
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
