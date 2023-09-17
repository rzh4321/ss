import User from "../../../../../../../models/User";
import Post from "../../../../../../../models/Post";
import Comment from "../../../../../../../models/Comment";
import mongoose from "mongoose";

import connectToDB from "../../../../../../../utils/database";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .transform((val) => val.trim()),
});

export async function POST(req, context) {
  await connectToDB();
  console.log("inside making post api call");
  const { content } = await req.json();
  const userId = context.params.userId;
  const postId = context.params.postId;
  try {
    const data = schema.parse({ content });
  } catch (err) {
    console.log("error comment validation: ", err);
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }
  try {
    const currentUser = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) {
      console.log("cant find post for so,e reasn");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const comment = new Comment({
      content,
      user: new mongoose.Types.ObjectId(currentUser._id),
      post: new mongoose.Types.ObjectId(post._id),
    });
    await comment.save();
    post.comments.push(comment);
    await post.save();
    return NextResponse.json({ post, comment }, { status: 201 });
  } catch (err) {
    console.log("error posting comment: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
