import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

export default function CommentsList({ comments, authuserData }) {
  const router = useRouter();

  // Handle clicks on a user profile picture
  function handleUserProfilePicClick(userId) {
    if (authuserData._id.toString() === userId) {
      return router.push(`/profile/${authuserData._id}`);
    }
    router.push(`/users/${userId}`);
  }

  return (
    <ul className="ps-0 comments-list">
      {comments.map((comment) => {
        return (
          <div className="g-0 mt-2 d-flex flex-nowrap" key={comment._id}>
            {comment.user?.profilePicUrl ? (
              <Image
                className={`my-auto rounded-circle user-profile-pic32`}
                alt="profile pic"
                width={40}
                height={40}
                src={comment.user?.profilePicUrl}
                onClick={() => handleUserProfilePicClick(comment.user?._id)}
              />
            ) : (
              <div
                className={`my-auto rounded-circle user-profile-pic-32 comment-profile-pic`}
                onClick={() => handleUserProfilePicClick(comment.user?._id)}
              >
                <span
                  className={`material-symbols-outlined user-profile-pic32`}
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
            <div
              className={`col-auto ms-2 comment-bubble rounded-4 px-3 py-1 d-flex flex-column`}
            >
              <Link
                className="fw-semibold text-decoration-none"
                href={`/users/${comment.user?._id}`}
              >
                <small>{comment.user?.name}</small>
              </Link>
              <div className="">{comment.content}</div>
            </div>
          </div>
        );
      })}
    </ul>
  );
}
