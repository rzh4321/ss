import User from "../../../../../models/User";
import Image from "../../../../../models/Image";
import Post from "../../../../../models/Post";
import connectToDB from "../../../../../utils/database";
import { NextResponse } from "next/server";

import { z } from "zod";

const schema = z.object({
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .transform((val) => val.trim()),
});

// get user's posts
export async function GET(req, context) {
  await connectToDB();
  console.log("getting all session users posts");
  const userId = context.params.userId;
  // console.log('userid is ', userId);

  const currentUser = await User.findById(userId);
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  if (startId) {
    try {
      const posts = await Post.find({ user: currentUser._id })
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
      // console.log("next 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    //console.log("this is first call (initial page load)");
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find({ user: currentUser._id })
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

// session user makes a post
export async function POST(req, context) {
  await connectToDB();
  console.log("insde making a post api handler");
  const data = await req.formData();
  const arr = Array.from(data.entries());
  //console.log('ARRR IS ', arr)
  const userId = context.params.userId;
  // console.log('userid is ', userId);

  const currentUser = await User.findById(userId);

  try {
    const data = schema.parse({ content: arr[0][1] });
  } catch (err) {
    console.log("error form fvalidation: ", err);
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    let image;
    let post;
    if (arr.length > 1) {
      // theres an image
      // convert file object to buffer
      const arrayBuffer = await arr[1][1].arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      image = new Image({
        filename: arr[1][1].name,
        contentType: arr[1][1].type,
        data: buffer,
      });

      await image.save();

      post = new Post({
        content: arr[0][1],
        user: currentUser._id,
        image: image,
      });
    } else {
      // no image
      post = new Post({
        content: arr[0][1],
        user: currentUser._id,
      });
    }

    await post.save();
    currentUser.posts.push(post);
    await currentUser.save();
    //console.log('saved user object with new post: ', currentUser);
    return NextResponse.json({ post }, { status: 201 });

    //await image.save;

    //console.log('post is ', post);
  } catch (err) {
    console.log("error: ", err);
    return NextResponse.json(
      { error: "Unknown server error" },
      { status: 500 },
    );
  }
}
