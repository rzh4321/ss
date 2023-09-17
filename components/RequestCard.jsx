import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RequestCard({ user, session }) {
  const router = useRouter();
  const [requestStatus, setRequestStatus] = useState("received");

  async function handleClick(accepted) {
    setRequestStatus("loading");
    let res;
    if (accepted) {
      res = await fetch(
        `/api/users/${session.user.userId}/accept-request/${user._id}`,
        {
          method: "POST",
        },
      );
    } else {
      // TODO: handle decline. define api. also, if user has sent u a FR, display the accept/decline in their profile
      res = await fetch(
        `/api/users/${session.user.userId}/decline-request/${user._id}`,
        {
          method: "POST",
        },
      );
    }
    if (res.status === 200) {
      location.reload();
    } else {
      console.log("somethign went wrong");
      setRequestStatus("error");
    }
  }

  const handleClickProfilePic = () => {
    router.push(`/users/${user._id}`);
  };

  return (
    <li className="row mt-3 justify-content-center">
      <div className={`card shadow-sm p-3`}>
        <div className="d-flex d-row align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            {user.profilePicUrl ? (
              <Image
                className={`my-auto rounded-circle user-profile-pic`}
                src={user.profilePicUrl}
                onClick={handleClickProfilePic}
                height={40}
                width={40}
                alt="profile pic"
              />
            ) : (
              <div
                className={`my-auto rounded-circle user-profile-pic`}
                onClick={handleClickProfilePic}
              >
                <span
                  className={`request-icon user-profile-pic-icon material-symbols-outlined`}
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
            <div>
              <Link
                href={`/users/${user._id}`}
                className="p-0 mb-0 text-decoration-none"
              >
                <strong>{user.name}</strong>
              </Link>
            </div>
          </div>
          {(() => {
            switch (requestStatus) {
              case "received":
                return (
                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-danger ms-auto px-3 py-1"
                      onClick={() => handleClick(false)}
                    >
                      Decline
                    </button>
                    <button
                      className="btn btn-success ms-auto px-3 py-1"
                      onClick={() => handleClick(true)}
                    >
                      Accept
                    </button>
                  </div>
                );
              case "loading":
                return (
                  <button className="btn btn-outline-primary disabled ms-auto px-3 py-1">
                    <div>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </button>
                );
              default:
                return (
                  <button className="btn btn-outline-primary ms-auto px-3 py-1">
                    Error, try again
                  </button>
                );
            }
          })()}
        </div>
      </div>
    </li>
  );
}
