import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import Link from "next/link";
import FeedPostCardCommentSection from "./FeedPostCardCommentSection";
import FeedPostCardLikeSection from "./FeedPostCardLikeSection";

import Image from "next/image";

export default function FeedPostCard({ post, authuserData }) {
  const [comments, setComments] = useState(post.comments);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageData, setImageData] = useState();
  const router = useRouter();

  // Fetch the image if the post has one
  useEffect(() => {
    async function getImage() {
      setImageLoading(true);
      const res = await fetch(`/api/images/${post.image}`);
      const data = await res.json();
      setImageData(data.image);
      setImageLoading(false);
    }
    if (post.image) {
      getImage();
    }
  }, [post.image, post.user]);

  // Display the post timestamp in a readable format
  function postTimeStampDisplay() {
    const postTimestamp = DateTime.fromISO(post.timestamp);
    const nowTimestamp = Date.now();
    const timeDiffInMinutes = Math.ceil(
      (nowTimestamp - postTimestamp) / 1000 / 60,
    );
    if (timeDiffInMinutes < 60) {
      return `${timeDiffInMinutes}m`;
    }
    const timeDiffInHours = Math.ceil(timeDiffInMinutes / 60);
    if (timeDiffInHours < 24) {
      return `${timeDiffInHours}h`;
    }
    const timeDiffInDays = Math.ceil(timeDiffInHours / 24);
    if (timeDiffInDays < 5) {
      return `${timeDiffInDays}d`;
    }
    return DateTime.fromISO(post.timestamp).toLocaleString(
      DateTime.DATETIME_SHORT,
    );
  }

  // Handle clicks on a user profile picture
  function handleUserProfilePicClick() {
    if (authuserData._id.toString() === post.user._id) {
      return router.push(`/profile/${authuserData._id}`);
    }
    router.push(`/users/${post.user._id}`);
  }

  return (
    <div className="row mt-3 justify-content-center" key={post._id}>
      <div className={`card shadow-sm py-3 px-0 feed-card`}>
        <div className={`mx-3 d-flex d-row gap-2`}>
          {post.user.profilePicUrl ? (
            <Image
              className={`my-auto rounded-circle user-profile-pic`}
              src={post.user.profilePicUrl}
              onClick={handleUserProfilePicClick}
              alt="profile pic"
              height={40}
              width={40}
            />
          ) : (
            <div
              className={`my-auto rounded-circle user-profile-pic`}
              onClick={handleUserProfilePicClick}
            >
              <svg
                className="user-profile-pic"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          )}
          <div>
            <Link
              href={`/users/${post.user._id}`}
              className="p-0 mb-0 text-decoration-none"
            >
              <strong>{post.user.name}</strong>
            </Link>
            <p className="p-0 mb-0">
              <small>{postTimeStampDisplay()}</small>
            </p>
          </div>
        </div>
        <div className="mx-3 card-text mt-1">
          <p className="my-2">{post.content}</p>
        </div>
        <div className="mx-auto">
          {imageLoading && (
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {imageData && (
            <Image
              className={`w-100 feed-card-image`}
              src={
                imageData
                  ? `data:${imageData.contentType};base64,${Buffer.from(
                      imageData.data,
                    ).toString("base64")}`
                  : ""
              }
              alt="post image"
              height={300}
              width={300}
            />
          )}
        </div>
        <FeedPostCardLikeSection post={post} comments={comments} />
        <FeedPostCardCommentSection
          post={post}
          comments={comments}
          setComments={setComments}
          authuserData={authuserData}
        />
      </div>
    </div>
  );
}
