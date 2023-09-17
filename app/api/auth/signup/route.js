import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { error } from "console";
import { read } from "fs";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .transform((val) => val.trim()),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .transform((val) => val.trim()),
});

export async function GET() {
  console.log("IN GE signup route");
  return NextResponse.json({ message: "hi" });
}

export async function POST(req) {
  await connectToDB();
  const reqData = await req.json();
  console.log("we are in POST signup route. req is ", reqData);
  try {
    const data = schema.parse(reqData);
    const user = await User.findOne({ username: reqData.username });
    if (user) {
      console.log("username alredy exists in database");
      return NextResponse.json({
        errors: ["Username already taken"],
        input: reqData,
      });
    }
    // username available, save user to db
    const hashedPassword = bcrypt.hashSync(reqData.password, 10);
    try {
      console.log("trying to create and save user to db now after hashing");
      const user = new User({
        name: reqData.name,
        username: reqData.username,
        password: hashedPassword,
      });
      await user.save();
      console.log("we saved the new user to db. returning status 201 now");
      return NextResponse.json({ user }, { status: 201 });
    } catch (err) {
      throw new Error(
        "could create and save user to db for some reaosn: ",
        err,
      );
    }
  } catch (e) {
    console.log("error parsing data: ", e.issues);
    const errorsArr = e.issues.map((obj) => {
      return obj.message;
    });
    return NextResponse.json({
      errors: errorsArr,
      input: reqData,
    });
  }
}
