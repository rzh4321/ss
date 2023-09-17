import User from "../../../../../../../models/User";
import Post from "../../../../../../../models/Post";
import connectToDB from "../../../../../../../utils/database";
import { NextResponse } from "next/server";

// user gives a like to a post
export async function POST(req, context) {
  await connectToDB();
  console.log("inside api like post call");
  const userId = context.params.userId;
  const postId = context.params.postId;
  //console.log('userid is ', userId, ' postid is ', postId);
  try {
    const currentUser = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) {
      console.log("cant find post for so,e reasn");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    post.likes.push(currentUser._id);
    await post.save();
    console.log("liked post success");
    return NextResponse.json({ message: "Liked post", post }, { status: 201 });
  } catch (err) {
    console.log("error loking post: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
