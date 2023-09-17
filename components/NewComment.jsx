import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

export default function NewComment({
  postid,
  comments,
  setComments,
  authuserData,
}) {
  const { data: session } = useSession();
  const [commentInput, setCommentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContentError, setIsContentError] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleNewComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    // must comment something
    if (commentInput.trim().length === 0) {
      setIsContentError(true);
      setIsLoading(false);
      return;
    }
    const res = await fetch(
      `/api/users/${session.user.userId}/posts/${postid}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          content: commentInput,
        }),
      },
    );
    const data = await res.json();
    console.log("back from posting comment api. data is ", data);
    switch (res.status) {
      case 201:
        setIsLoading(false);
        setIsContentError(false);
        setIsError(false);
        setCommentInput("");
        setComments([
          ...comments,
          {
            ...data.comment,
            // we have to manually populate user data field. We need this to render name and profile pic
            user: {
              ...data.comment.user,
              profilePicUrl: authuserData.profilePicUrl,
              name: authuserData.name,
            },
          },
        ]);
        console.log("comments is now ", comments);
        break;
      default:
        setIsLoading(false);
        setIsContentError(false);
        setIsError(true);
    }
  };

  return (
    <div className="row g-0 mt-1 comment-row">
      {authuserData.profilePicUrl ? (
        <Image
          className={`my-auto rounded-circle user-profile-pic32`}
          alt="profile pic"
          width={40}
          height={40}
          src={authuserData.profilePicUrl}
        />
      ) : (
        <div className={`my-auto rounded-circle user-profile-pic32`}>
          <span
            className={`material-symbols-outlined user-profile-pic-32 comment-profile`}
          >
            <svg
              className="user-profile-pic post-card"
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
          </span>
        </div>
      )}
      <form className="col ms-2" onSubmit={handleNewComment}>
        <div className={`input-group w-100 user-profile-pic32`}>
          <input
            id={`newCommentInput${postid}`}
            type="text"
            className="form-control border-0 h-100 rounded-start-5"
            placeholder="Add a comment"
            aria-label="New comment"
            aria-describedby="button-addon"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            className="btn border-0 h-100 rounded-end-5 d-flex align-items-center send-icon-span"
            type="submit"
            id="button-addon"
          >
            {!isLoading && (
              <span className="fs-4 material-symbols-outlined text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="send-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </span>
            )}
            {isLoading && (
              <div>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
        {isError && (
          <div className="mt-2 mb-0 alert alert-danger px-3 py-1" role="alert">
            <small>Failed to comment, please try again</small>
          </div>
        )}
        {isContentError && (
          <div className="mt-2 mb-0 alert alert-danger px-3 py-1" role="alert">
            Content is required
          </div>
        )}
      </form>
    </div>
  );
}
