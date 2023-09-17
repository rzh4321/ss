import User from "../../../../../../../models/User";
import Post from "../../../../../../../models/Post";
import connectToDB from "../../../../../../../utils/database";
import { NextResponse } from "next/server";

// user gives a like to a post
export async function DELETE(req, context) {
  await connectToDB();
  console.log("inside api cancel like call");
  const userId = context.params.userId;
  const postId = context.params.postId;
  try {
    const currentUser = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) {
      console.log("cant find post for so,e reasn");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    post.likes.pull(currentUser._id);
    await post.save();
    console.log("cancelled like success");
    return NextResponse.json(
      { message: "Cancelled like", post },
      { status: 201 },
    );
  } catch (err) {
    console.log("error cancelling like: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
