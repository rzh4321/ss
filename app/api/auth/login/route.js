import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function authenticate(username, password) {
  console.log("in authenticate function");
  const regex = new RegExp(username, "i");
  const user = await User.findOne({ username: { $regex: regex } });
  if (!user) {
    console.log("USERNAME DOESNT EXIST");
    return { status: false, message: "Username does not exist" };
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    // passwords do not match
    console.log("PASSWOWRDS DONT MATCH");
    return { status: false, message: "Incorrect password" };
  }
  return { status: true, user };
}

export async function GET() {
  console.log("IN GET");
  return NextResponse.json({ message: "hi" });
}

// checks if user exists and pw matches. If yes, return user object and token. Otherwise return error
export async function POST(req) {
  await connectToDB();
  console.log("We are in POST log in api call");
  const { username, password } = await req.json();
  //return NextResponse.json({hi: 'hi'})

  const authRes = await authenticate(username, password);

  if (authRes.status) {
    const token = jwt.sign({ id: authRes.user._id }, process.env.JWT_SECRET);
    return NextResponse.json({
      message: "Logged in",
      user: authRes.user,
      token,
    });
  } else {
    return NextResponse.json({ message: "Log in failed" }, { status: 400 });
  }
}
