import mongoose, { Schema, Document } from "mongoose";

export interface ITodo {
  todo: string;
  checked: boolean;
}

export interface IUser extends Document {
  name: string;
  todos: ITodo[];
}

const todoSchema = new Schema<ITodo>({
  todo: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, unique: true },
  todos: [todoSchema]
});

export const User = mongoose.model<IUser>("User", userSchema);