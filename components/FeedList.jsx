import "../styles/homefeed.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import FeedPostCard from "./FeedPostCard";
import Link from "next/link";

export default function FeedList({
  posts,
  setPosts,
  postsLoading,
  authuserData,
  feedType,
  endOfFeed,
}) {
  const { data: session } = useSession();
  const [morePostsLoading, setMorePostsLoading] = useState(false);
  const [newEndOfFeed, setNewEndOfFeed] = useState(false);

  // Fetch 10 of all posts startig from the last post id in the posts array
  const fetchMorePostsFromLastId = async () => {
    setMorePostsLoading(true);
    const startId = posts[posts.length - 1]._id;
    let res;
    switch (feedType) {
      case "all":
        res = await fetch(`/api/posts?startId=${startId}`);
        break;
      case "profile":
        res = await fetch(
          `/api/users/${session.user.userId}/posts/?startId=${startId}`,
        );
        break;
      case "user":
        const userId = posts[0].user._id;
        res = await fetch(`/api/users/${userId}/posts/?startId=${startId}`);
        break;
      case "home":
        res = await fetch(
          `/api/users/${session.user.userId}/feed-posts/?startId=${startId}`,
        );
        break;
    }
    const data = await res.json();
    if (data.posts.length < 10) {
      setNewEndOfFeed(true);
    }
    setMorePostsLoading(false);
    setPosts(posts.concat(data.posts));
  };

  if (postsLoading) {
    return (
      <div className={`mx-auto feed-card text-center`}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (posts?.length > 0) {
    return (
      <>
        <ul className="ps-0">
          {posts.map((post) => {
            return (
              <FeedPostCard
                key={post._id}
                post={post}
                authuserData={authuserData}
              />
            );
          })}
        </ul>
        {!newEndOfFeed && !endOfFeed ? (
          <div className="d-flex justify-content-center">
            {morePostsLoading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <button
                className="btn btn-outline-secondary"
                onClick={fetchMorePostsFromLastId}
              >
                Load posts
              </button>
            )}
          </div>
        ) : (
          ""
        )}
      </>
    );
  } else {
    return (
      <div className={`row mx-auto mt-3 feed-card`}>
        {feedType === "home" && (
          <p className="">No posts from you or your friends yet...</p>
        )}
        {feedType === "user" && (
          <p className="">No posts from this user yet...</p>
        )}
        {feedType === "profile" && <p className="">No posts from you yet...</p>}
        {feedType === "all" && <p className="">No posts yet...</p>}
      </div>
    );
  }
}
