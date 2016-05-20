# trailsjs Mongoose User Model

- User Model with Password salt/hashing for use with Mongoose and/or Trails.js + (trailpack-mongoose)
- Model assumes that your user has an `email` and `passwordHash` field that is required.
- Built-in email address validation using `/^\S+@\S+$/`.
- This model uses BCrypt for password salting/hashing. Prior to saving a model the user's `passwordHash` will hashed.
- This model exposes two public methods - `comparePassword(attempt)` and `comparePasswordSync(attempt)` that can be called directly on an individual model.

## What if I just want the Mongoose Schema?

* soon
