import mongoose from "mongoose";
const Schema = mongoose.Schema;

const comments = {
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
};

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  comments,
  otp: {
    type: Number,
    required: true,
  },
  metadata: {
    device: {
      type: String,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
