import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  userID: {
    type: String,
  },
  heading: {
    type: String,
  },
  variant: {
    type: String,
  },
  pinned: {
    type: Boolean,
  },
  data: {
    type: Object || String,
  },
  theme: {
    type: Object,
  },
  pinnedData: {
    type: Object,
  },
});

const Todo = mongoose.model("Todo", todoSchema, "todos");

export default Todo;
