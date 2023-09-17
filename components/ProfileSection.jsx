"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../styles/profile.css";
import ProfileEditModal from "./ProfileEditModal";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileSection({ edit, stringData }) {
  const { data: session, status } = useSession();
  const [userData, getUserData] = useState({});
  const [friendRequestStatus, setFriendRequestStatus] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick(accepted) {
    setIsLoading(true);
    let res;
    if (accepted) {
      res = await fetch(
        `/api/users/${session.user.userId}/accept-request/${userData._id}`,
        {
          method: "POST",
        },
      );
      setFriendRequestStatus("friends");
    } else {
      res = await fetch(
        `/api/users/${session.user.userId}/decline-request/${userData._id}`,
        {
          method: "POST",
        },
      );
    }
    if (res.status === 200) {
      location.reload();
    } else {
      console.log("somethign went wrong");
      setError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (userData === undefined || Object.keys(userData).length === 0) {
      getUserData(JSON.parse(stringData));
    }
    if (userData.friendRequestsReceived?.includes(session?.user.userId)) {
      setFriendRequestStatus("sent");
    } else if (userData.friends?.includes(session?.user.userId)) {
      setFriendRequestStatus("friends");
    }
    // this user has sent you a FR
    else if (userData.friendRequestsSent?.includes(session?.user.userId)) {
      setFriendRequestStatus("received");
    }
  }, [stringData, userData, session]);

  async function handleUnfriendClick() {
    setIsLoading(true);
    const res = await fetch(
      `/api/users/${session.user.userId}/unfriend/${userData._id}`,
      {
        method: "POST",
      },
    );
    if (res.status === 200) {
      setFriendRequestStatus("none");
      location.reload();
    } else {
      setError(true);
    }
    setIsLoading(false);
  }

  async function handleSendFriendRequest() {
    const status = friendRequestStatus;
    setFriendRequestStatus("loading");
    // send the request
    if (status === "none" || status === "error") {
      const res = await fetch(
        `/api/users/${session.user.userId}/send-request/${userData._id}`,
        {
          method: "POST",
        },
      );
      if (res.status === 200) {
        console.log("success");
        setFriendRequestStatus("sent");
      } else {
        console.log("failed");
        setFriendRequestStatus("error");
      }
    }
    // cancel request
    else {
      const res = await fetch(
        `/api/users/${session.user.userId}/cancel-request/${userData._id}`,
        {
          method: "POST",
        },
      );
      if (res.status === 200) {
        console.log("success");
        setFriendRequestStatus("none");
      } else {
        console.log("failed");
        setFriendRequestStatus("error");
      }
    }
  }

  return (
    <div className={`mx-auto row profile-card`}>
      {userData.profilePicUrl ? (
        <div
          className={`col m-2 p-0 user-profile-pic-div`}
          data-bs-toggle={edit ? "modal" : ""}
          data-bs-target={edit ? "#profileEditModal" : ""}
        >
          <Image
            className={`rounded-circle profile-user-profile-pic`}
            src={userData.profilePicUrl}
            alt="profile pic"
            width={40}
            height={40}
          />
        </div>
      ) : (
        <div className={`col m-2 p-0 rounded-circle user-profile-pic-div`}>
          <span className={`user-profile-pic-icon material-symbols-outlined`}>
            <svg
              className="profile-user-profile-pic post-card"
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
      <div className="col my-auto">
        <h1 className="mb-0">
          <strong>{userData.name}</strong>
        </h1>
        <div>{`@${userData.username}`}</div>
        <div className="text-secondary">
          {userData.friends?.length > 1 || userData.friends?.length === 0
            ? `${userData.friends?.length} friends`
            : `${userData.friends?.length} friend`}
        </div>
      </div>
      {!edit && friendRequestStatus !== "received" && (
        <div className="col mt-auto">
          {friendRequestStatus !== "friends" && (
            <button
              type="button"
              className="btn btn-primary d-flex text-nowrap py-1 px-2 ms-auto"
              onClick={handleSendFriendRequest}
            >
              <span className="material-symbols-outlined"></span>
              {friendRequestStatus === "sent" ? (
                "Pending"
              ) : friendRequestStatus === "none" ||
                friendRequestStatus === "error" ? (
                "Send Friend Request"
              ) : (
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
          )}
        </div>
      )}
      {friendRequestStatus === "received" && (
        <div className="d-flex justify-content-end gap-3">
          <button
            className="btn btn-danger px-3 py-1"
            onClick={() => handleClick(false)}
          >
            Decline
          </button>
          <button
            className="btn btn-success px-3 py-1"
            onClick={() => handleClick(true)}
          >
            Accept
          </button>
        </div>
      )}
      {friendRequestStatus === "friends" && (
        <div className="col mt-auto">
          <button
            className="btn btn-danger d-flex text-nowrap py-1 px-2 ms-auto"
            data-bs-toggle="modal"
            data-bs-target="#newPostModal"
          >
            Unfriend
          </button>
        </div>
      )}
      {friendRequestStatus === "error" && (
        <div className="alert alert-danger px-3 py-2" role="alert">
          Error. Please try again later.
        </div>
      )}
      {edit && <ProfileEditModal userData={userData} />}

      <div
        className="modal fade"
        id="newPostModal"
        tabIndex="-1"
        aria-labelledby="newPostModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <form className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newPostModalLabel">
                Unfriend {userData.name}?
              </h1>
              <button
                type="button"
                className="btn-close pointer-cursor"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="d-flex p-3 gap-3">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button className="btn btn-success" onClick={handleUnfriendClick}>
                {!isLoading && "Yes"}
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
            {error && (
              <div className="alert alert-danger px-3 py-2 mx-3" role="alert">
                Something went wrong
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
