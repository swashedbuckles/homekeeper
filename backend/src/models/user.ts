import mongoose from 'mongoose';
const {Schema, model} = mongoose;
import {isEmail} from 'validator';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => isEmail(value),
      message: (props) => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  preferences: {
    theme: String,
    notifications: {
      email: Boolean,
      push: Boolean,
    },
    defaultHouseholdId: Schema.Types.ObjectId,
  },
  householdRoles: {
    type: Map,
    of: String // "owner" | "admin" | "member" | "guest"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const User = model('User', userSchema);