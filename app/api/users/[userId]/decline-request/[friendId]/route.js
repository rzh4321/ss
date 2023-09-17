import connectToDB from "../../../../../../utils/database";
import User from "../../../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  await connectToDB();
  console.log("insde decline friend request api handler");
  const userId = context.params.userId;
  const friendId = context.params.friendId;

  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await User.findById(userId);
    user.friendRequestsReceived.splice(
      user.friendRequestsReceived.indexOf(friend._id, 1),
    );
    await user.save();
    friend.friendRequestsSent.splice(
      friend.friendRequestsSent.indexOf(user._id, 1),
    );
    await friend.save();
    return NextResponse.json(
      { message: "friend request declined", user, friend },
      { status: 200 },
    );
  } catch (err) {
    console.log("error declining FR: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
