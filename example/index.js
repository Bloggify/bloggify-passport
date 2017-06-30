...
"bloggify-passport": {
    login_url: "/user/signin",
    verify_callback (email, password, cb) {
        if (email === "foo@bar.com" && password === "42") {
            return cb(null, { name: "foo" })
        }
        cb(new Error("Invalid username or password."))
    }
},
...
