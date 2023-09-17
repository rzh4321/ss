"use client";

import "../styles/homefeed.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import Link from "next/link";
import NewPostCard from "./NewPostCard";
import FeedList from "./FeedList";

// feedType: 'all' || 'home' || 'profile' || 'user'
export default function HomeFeed({ feedType, postsData }) {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [endOfFeed, setEndOfFeed] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [authuserData, setAuthuserData] = useState({});

  // Fetch authuser from session.user.userId and pass along the authuserData
  useEffect(() => {
    async function fetchAuthuser() {
      const res = await fetch(`/api/users/${session.user.userId}`);
      const data = await res.json();
      setAuthuserData(data.user);
    }
    if (status === "loading") return;
    // no need to check for session, already did in navbar
    fetchAuthuser();
  }, [session, status]);

  // Fetch posts according to the home feedType
  useEffect(() => {
    async function fetchAuthuserPostsAndSetPosts() {
      const res = await fetch(`/api/users/${session.user.userId}/posts`);
      const data = await res.json();
      if (data.posts.length < 10) {
        setEndOfFeed(true);
      }
      setPosts(data.posts);
      setPostsLoading(false);
    }

    async function fetchFeedPostsAndSetPosts() {
      const res = await fetch(`/api/users/${session.user.userId}/feed-posts`);
      const data = await res.json();
      if (data.posts.length < 10) {
        console.log("less than 10 posts so endoffeed is true");
        setEndOfFeed(true);
      }
      setPosts(data.posts);
      setPostsLoading(false);
    }

    async function fetchAllPostsAndSetPosts() {
      // Fetch 10 of all posts starting from the most recent one
      const res = await fetch(`/api/posts`);
      const data = await res.json();
      // less than 10 posts returned means we already reached end of feed
      if (data.posts.length < 10) {
        setEndOfFeed(true);
      }
      setPosts(data.posts);
      setPostsLoading(false);
    }

    function setUserPosts() {
      if (posts.length < 10) {
        setEndOfFeed(true);
      }
      setPostsLoading(false);
      setPosts(postsData);
    }

    if (status === "loading") return;

    switch (feedType) {
      case "home":
        fetchFeedPostsAndSetPosts();
        break;
      case "profile":
        fetchAuthuserPostsAndSetPosts();
        break;
      case "all":
        fetchAllPostsAndSetPosts();
        break;
      case "user":
        setUserPosts();
        break;
    }
  }, [session, feedType, status]);

  return (
    <div className="container mt-4">
      <div className="d-flex p-2">
        <Link
          className="my-feed text-decoration-none w-50 d-flex align-items-center justify-content-center"
          href="/home"
        >
          {(feedType === "all" || feedType === "home") && (
            <div className="fs-4 text-primary">
              <strong>My Feed</strong>
            </div>
          )}
        </Link>
        <Link
          className="all-posts text-decoration-none w-50 d-flex align-items-center justify-content-center"
          href="/all"
        >
          {(feedType === "all" || feedType === "home") && (
            <div className="fs-4 text-primary">
              <strong>All</strong>
            </div>
          )}
        </Link>
      </div>
      {(feedType === "all" || feedType === "home") && (
        <div className="border-top mb-4"></div>
      )}
      {feedType !== "user" && <NewPostCard authuserData={authuserData} />}
      {feedType === "profile" && (
        <h3 className={`mx-auto mt-4 mb-0 feed-card`}>Your posts</h3>
      )}
      <FeedList
        posts={posts}
        setPosts={setPosts}
        postsLoading={postsLoading}
        authuserData={authuserData}
        feedType={feedType}
        endOfFeed={endOfFeed}
      />
    </div>
  );
}
