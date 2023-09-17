import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import Link from "next/link";

export default function FeedPostCardLikeSection({ post, comments }) {
  const { data: session } = useSession();
  // likeStatus: 'unliked' || 'liked' || 'loading' || 'error'
  const [likeStatus, setLikeStatus] = useState("unliked");
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    if (post.likes.length > 0) {
      // see if userId is in likes array
      post.likes.some((like) => like.toString() === session.user.userId)
        ? setLikeStatus("liked")
        : setLikeStatus("unliked");
    }
  }, [post.likes, session.user.userId]);

  const handleClickComment = () => {
    const commentInputElement = document.getElementById(
      `newCommentInput${post._id}`,
    );
    commentInputElement.focus();
  };

  const handleClickLike = async () => {
    const status = likeStatus;
    setLikeStatus("loading");
    if (status === "unliked") {
      console.log("abiut to call like api");
      console.log(post._id);
      const res = await fetch(
        `/api/users/${session.user.userId}/posts/${post._id}/give-like`,
        {
          method: "POST",
        },
      );
      const data = await res.json();
      console.log("back from give like api. data is ", data);
      switch (res.status) {
        // Successfully liked
        case 201:
          setLikeStatus("liked");
          setLikes(data.post.likes);
          break;
        // Failed to like
        default:
          setLikeStatus("error");
      }
    } else if (status === "liked") {
      const res = await fetch(
        `/api/users/${session.user.userId}/posts/${post._id}/cancel-like`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      switch (res.status) {
        // Successfully unliked
        case 201:
          setLikeStatus("unliked");
          setLikes(data.post.likes);
          break;
        // Failed to like
        default:
          setLikeStatus("error");
      }
    }
  };

  return (
    <>
      <div className="mx-3 my-1 d-flex d-row justify-content-between">
        <div className="text-secondary">
          {likes.length > 0 && (
            <span>
              {likes.length} {likes.length > 1 ? "likes" : "like"}
            </span>
          )}
        </div>
        <div className="text-secondary">
          {comments.length > 0 && (
            <span>
              {comments.length} {comments.length > 1 ? "comments" : "comment"}
            </span>
          )}
        </div>
      </div>
      {(likes.length > 0 || comments.length > 0 || !post.image) && (
        <hr className="mx-3 my-1 border-bottom" />
      )}
      <div className="mx-3 d-flex d-row gap-2">
        <button
          className={`w-50 btn btn-outline-light text-secondary p-0 py-1 border-0 icon-text-button`}
          onClick={handleClickLike}
        >
          {(() => {
            switch (likeStatus) {
              case "unliked":
                return (
                  <div className="d-flex align-items-center">
                    <span className="material-symbols-outlined fs-5 me-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="like-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                        />
                      </svg>
                    </span>
                    Like
                  </div>
                );
              case "loading":
                return (
                  <div>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                );
              case "liked":
                return (
                  <div className="d-flex align-items-center text-primary fw-bold">
                    <span
                      className={`material-symbols-outlined fs-5 me-1 icon-bold`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="like-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                        />
                      </svg>
                    </span>
                    Like
                  </div>
                );
              default:
                return (
                  <div className="d-flex align-items-center text-danger">
                    <span className="material-symbols-outlined fs-5 me-1">
                      thumb_up
                    </span>
                    Error, try again
                  </div>
                );
            }
          })()}
        </button>
        <button
          className={`w-50 btn btn-outline-light text-secondary p-0 py-1 border-0 icon-text-button`}
          onClick={handleClickComment}
        >
          <span className="material-symbols-outlined fs-5 me-1">
            <svg
              className="like-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
          </span>
          Comment
        </button>
      </div>
      <hr className="mx-3 my-1 border-bottom" />
    </>
  );
}
