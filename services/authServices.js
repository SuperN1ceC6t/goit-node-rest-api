import User from "../models/User.js";

const signup = (data) => User.create(data);

const findUser = (filter) => User.findOne(filter);

const updateUser = (filter, data) => User.findByIdAndUpdate(filter, data);

export default {
  signup,
  findUser,
  updateUser,
};
