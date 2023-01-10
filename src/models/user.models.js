const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

//  Define user Schema
const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: [true, 'username already exist!!!'],
      min: [3, 'username cannot be lesser than 3characters, got {value}'],
      max: [15, 'username cannot be more than 15characters, got {value}'],
      required: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'user already exists!!!'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
        'password must contain, at least a capital letter, at least a small letter, at must be at least 8 characters long'
      ]
    },
    intro: {
      //  brief introduction of the Author to be displayed on each post
      type: String,
      max: 255
    },
    urlToImage: {
      type: String
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Posts'
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Posts'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret.id;
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

UserSchema.index({
  posts: 1
});

//  method to hash password beefore saving to database
UserSchema.pre('save', async function (next) {
  const user = this;

  //  if password is modified, do nothing
  if (!user.isModified('password')) return next();

  this.email = this.email.toLowerCase();
  //  hash password
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

// user trying to log in has the correct credentials.
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = mongoose.model('users', UserSchema);

module.exports = User;
