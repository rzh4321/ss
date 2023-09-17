import ProfileSection from "../../../../components/ProfileSection";
import HomeFeed from "../../../../components/HomeFeed";
import User from "../../../../models/User";
import { notFound } from "next/navigation";

async function findUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    notFound();
  }
  return user;
}

async function getPosts(userId) {
  try {
    // dont cache fetch response since user can edit profile and the changes wouldnt show in the post.user
    // object. Instead you'd still be fetching cached post objects with the outdated post.user object
    let posts = await fetch(
      `https://social-media-eight-rho.vercel.app/api/users/${userId}/posts`,
      {
        cache: "no-store",
      },
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
  console.log(posts);
  return (
    <div className="mt-4">
      <ProfileSection stringData={JSON.stringify(user)} edit={false} />
      <HomeFeed feedType={"user"} postsData={posts.posts} />
    </div>
  );
}
