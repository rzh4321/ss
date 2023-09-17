"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import RequestsReceived from "../../../components/RequestsReceived";
import FriendsSection from "../../../components/FriendsSection";

import "../../../styles/friends.css";
import { request } from "http";

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    async function setStates() {
      const res = await fetch(`/api/users/${session.user.userId}`);
      const data = await res.json();
      setFriends(data.user.friends);
      setRequestsReceived(data.user.friendRequestsReceived);
    }
    setStates();
  }, [status, session]);

  return (
    <div className="container mt-4">
      <RequestsReceived requests={requestsReceived} session={session} />
      <FriendsSection friends={friends} heading="Friends" />
    </div>
  );
}
