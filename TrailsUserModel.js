'use strict'

const Model = require('trails-model')
const BCrypt = require('bcryptjs')
const SALT_FACTOR = 10

/**
 * @module Person
 * @description Mongoose specific person model
 */
module.exports = class User extends Model {

  static config () {
    return {
      // MongoDB Collection name
      tableName: 'users',
      // Schema options
      schema: {
        timestamps: true,
        versionKey: false,
        toObject: {
          virtuals: true
        },
        toJSON: {
          virtuals: true
        }
      },
      // Schema statics
      statics: {
        getByEmail: (email) => {
          return this
            .findOne({
              email: _.trim(email)
            })
            .exec()
        },
      },
      // Schema methods
      methods: {
        toJSON: () => {
          const user = this.toObject()
          delete user.password
          return user
        }
      }
    }
  }

  // Mongoose Schema
  // http://mongoosejs.com/docs/guide.html
  static schema () {
    return {
      username: {
        type: String,
        required: true,
        unique: true
      },
      firstName: String,
      lastName: String,
      passwordHash: String,
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (val) => {
            let pattern = /^\S+@\S+$/
            return pattern.test(val)
          },
          message: '{VALUE} is not a valid email'
        }
      }
    }
  }

  static onSchema (schema) {
    schema.pre('save', function (next) {
      // performing actions
      let user = this,
          salt = BCrypt.genSaltSync(SALT_FACTOR)
      // only hash the password if it has been modified / is new
      if (!user.isModified('passwordHash')) return next()
      BCrypt.hash(user.passwordHash, salt, (err, hash) => {
        console.log(err)
        if (err) return next(err)
        // override the plaintext password with the hashed one
        user.passwordHash = hash
        next()
      })
    })
    schema.methods.comparePassword = function(attempt, callback) {
      BCrypt.compare(attempt, this.passwordHash, (err, isMatch) => {
        if (err) return cb(err)
        else cb(null, isMatch)
      })
    }
    schema.methods.comparePasswordSync = function(attempt) {
      return BCrypt.compareSync(attempt, this.passwordHash)
    }
  }

}
