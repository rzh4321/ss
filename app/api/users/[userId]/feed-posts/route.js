import User from "../../../../../models/User";
import Post from "../../../../../models/Post";
import Comment from "../../../../../models/Comment";

import { NextResponse } from "next/server";
import connectToDB from "../../../../../utils/database";

// gets user data given userId param
export async function GET(req, context) {
  await connectToDB();
  console.log("getting all feed posts");
  const userId = context.params.userId;
  // console.log('userid is ', userId);

  const currentUser = await User.findById(userId);
  // this is how we check what to show on feed
  const usersIds = [currentUser._id, ...currentUser.friends];
  // console.log(usersIds)
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  //console.log("search params of startId (if u included) is ", startId);
  // get all posts in feed
  if (startId) {
    try {
      const posts = await Post.find({ user: { $in: usersIds } })
        .where("_id")
        .lt(startId)
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      //console.log("next 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    console.log("this is first call (initial page load)");
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find({ user: { $in: usersIds } })
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      //console.log("first 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  }
}
