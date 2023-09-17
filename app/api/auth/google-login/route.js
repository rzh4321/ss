import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function GET() {
  console.log("IN GET");
  return NextResponse.json({ message: "hi" });
}

// check if user already exists. Otherwise create one
export async function POST(req) {
  await connectToDB();
  console.log("We are in POST google log in api call");
  const { username, name, profilePicUrl } = await req.json(); // username will be their email
  console.log(
    "username is ",
    username,
    " this is profilepicurl ",
    profilePicUrl,
  );
  const user = await User.findOne({ username: username });
  if (user) {
    console.log(
      "already have an acc with this google acc, returning existing user obj",
    );
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return NextResponse.json({
      message: "Logged in",
      user,
      token,
    });
  }
  try {
    console.log(
      "this is a new acc. trying to create and save google user to db now. profilepicurl is ",
      profilePicUrl,
    );
    // no need for password if signing in with provider
    const user = new User({
      name: name,
      username: username,
      profilePicUrl: profilePicUrl,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("we saved the new user to db. returning status 201 now");
    return NextResponse.json(
      { message: "Logged in", user, token },
      { status: 201 },
    );
  } catch (err) {
    console.log("errored: ", err);
    throw new Error("couldnt create and save user to db for some reaosn");
  }
}
