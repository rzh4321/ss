import Image from "../../../../models/Image";
import connectToDB from "../../../../utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDB();
  console.log("inside of get image api");
  const pathParts = req.url.split("/");
  const imageId = pathParts[pathParts.length - 1];
  const image = await Image.findById(imageId);
  return NextResponse.json({ image });
}
