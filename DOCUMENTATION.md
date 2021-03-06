## Documentation

You can see below the API reference of this module.

### Plugin Configuration

- **Object** `config`:
 - `strategy` (String): The PassportJS strategy name (default: "local").
 - `auth_options` (Object): Contains the authentication options.
 - `strategy_options` (Object): Contains the strategy options.
 - `success_url` (String): The access URL.
 - `login_url` (String): The login URL.
 - `verify_callback`(Function): The PassportJS callback function.
 - `failure_url` (String): The login error URL.
 - `fresh_user` (String): Whether to reload the user data on each request (default: `false`)

The model objects can be accessed by requiring the module or accessing the `Bloggify.models` object.

