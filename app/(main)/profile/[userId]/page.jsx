import ProfileSection from "../../../../components/ProfileSection";
import HomeFeed from "../../../../components/HomeFeed";
import { notFound } from "next/navigation";
import User from "../../../../models/User";

async function findUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    notFound();
  }
  return user;
}

async function getPosts(userId) {
  try {
    let posts = await fetch(
      `https://social-media-eight-rho.vercel.app/api/users/${userId}/posts`,
    );
    posts = posts.json();
    return posts;
  } catch (err) {
    console.log("error fecthing users posts: ", err);
    throw new Error(err);
  }
}

export default async function UserPage({ params }) {
  const user = await findUser(params.userId);
  const posts = await getPosts(params.userId);

  return (
    <div className="mt-4">
      <ProfileSection stringData={JSON.stringify(user)} edit={true} />
      <HomeFeed feedType={"profile"} postsData={posts.posts} />
    </div>
  );
}
