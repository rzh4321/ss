import User from "../../../models/User";
import FriendsSection from "../../../components/FriendsSection";

async function getUsersFromFilter(filter, userId) {
  const regex = new RegExp(`^${filter}`, "i"); // 'i' makes the search case-insensitive
  const names = await User.find({ name: regex, _id: { $ne: userId } });
  const usernames = await User.find({ username: regex, _id: { $ne: userId } });
  const res = [...names];
  const seenIds = new Set(names.map((obj) => obj._id.toString()));
  // make sure there are no duplicate users
  for (const obj of usernames) {
    if (!seenIds.has(obj._id.toString())) {
      seenIds.add(obj._id.toString());
      res.push(obj);
    }
  }
  return res;
}

export default async function Page({ searchParams }) {
  console.log(searchParams);
  const userId = searchParams.userId;
  const users = await getUsersFromFilter(searchParams.filter, userId);
  return (
    <div className="container">
      <FriendsSection
        friends={JSON.stringify(users)}
        heading={`Results for "${searchParams.filter}"`}
      />
    </div>
  );
}
