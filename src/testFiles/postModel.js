import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  content: {
    type: String,
    required: true,
  },

  otp: {
    type: Number,
    required: true,
  },
  metadata: {
    device: {
      type: String,
    },
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
