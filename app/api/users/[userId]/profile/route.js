import { z } from "zod";
import connectToDB from "../../../../../utils/database";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import { url } from "inspector";

const nameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .transform((val) => val.trim()),
});

const urlSchema = z.object({
  profilePicUrl: z
    .string()
    .min(1, { message: "URL is invalid" })
    .transform((val) => val.trim()),
});

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .transform((val) => val.trim()),
  profilePicUrl: z
    .string()
    .min(1, { message: "URL is invalid" })
    .transform((val) => val.trim()),
});

export async function PUT(req, context) {
  await connectToDB();
  console.log("insde editing profile api handler");
  const data = await req.formData();
  const arr = Array.from(data.entries());
  //return;
  const userId = context.params.userId;

  try {
    // updated name and pic with URL
    if (arr[0][1].trim().length > 0 && arr[1][1].trim().length > 0) {
      // console.log("update name and pic with url");
      try {
        const data = schema.parse({
          name: arr[0][1],
          profilePicUrl: arr[1][1],
        });
      } catch (err) {
        console.log("error form validation: ", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        name: arr[0][1],
        profilePicUrl: arr[1][1],
      });
      // only updated pic with URL
    } else if (arr[1][1].trim().length > 0) {
      //console.log("only pic with url");
      try {
        const data = urlSchema.parse({ profilePicUrl: arr[1][1] });
      } catch (err) {
        // console.log("error form validation: ", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        profilePicUrl: arr[1][1],
      });
      // updated name
    } else if (arr[0][1].trim().length > 0) {
      //console.log("updated name, but maybe also image with uplaod......");
      try {
        const data = nameSchema.parse({ name: arr[0][1] });
      } catch (err) {
        //console.log("error form validation: ", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      // also updated pic with upload
      if (arr.length > 2) {
        //console.log("yep, also pic with upload");
        const arrayBuffer = await arr[2][1].arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = `data:${arr[2][1].type};base64,${buffer.toString(
          "base64",
        )}`;
        const user = await User.findByIdAndUpdate(userId, {
          name: arr[0][1],
          profilePicUrl: url,
        });
      } else {
        //console.log('nope, just the name')
        const user = await User.findByIdAndUpdate(userId, {
          name: arr[0][1],
        });
      }
    }
    // only updated pic with uplaod
    else {
      //console.log("only pic with upload");
      const arrayBuffer = await arr[2][1].arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = `data:${arr[2][1].type};base64,${buffer.toString("base64")}`;
      const user = await User.findByIdAndUpdate(userId, {
        profilePicUrl: url,
      });
    }
    return NextResponse.json({ message: "Updated profile" }, { status: 200 });
  } catch (err) {
    console.log("error updating profile: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
