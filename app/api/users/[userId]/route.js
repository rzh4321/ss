import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

// gets user data given userId param
export async function GET(req, context) {
  await connectToDB();
  const userId = context.params.userId;

  try {
    const user = await User.findById(userId).populate(
      "friends friendRequestsSent friendRequestsReceived",
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (e) {
    console.log("error occurred when trying to get user data: ", e);
    throw new Error(e);
  }
}
