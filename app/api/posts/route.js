import User from "../../../models/User";
import Post from "../../../models/Post";

import { NextResponse } from "next/server";
import connectToDB from "../../../utils/database";

// gets ALL posts
export async function GET(req) {
  await connectToDB();
  console.log("getting all posts");
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  if (startId) {
    try {
      const posts = await Post.find()
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
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    //onsole.log("this is first call (initial page load)");
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  }
}
