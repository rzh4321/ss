import connectToDB from "../../../../../../utils/database";
import User from "../../../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  await connectToDB();
  console.log("insde unfriend request api handler");
  const userId = context.params.userId;
  const friendId = context.params.friendId;

  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await User.findById(userId);
    user.friends.splice(user.friends.indexOf(friend._id, 1));
    await user.save();
    friend.friends.splice(friend.friends.indexOf(user._id, 1));
    await friend.save();
    return NextResponse.json(
      { message: "unfriend successful", user, friend },
      { status: 200 },
    );
  } catch (err) {
    console.log("error unfriending: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
