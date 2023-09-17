"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { signIn } from "next-auth/react";

export default function CardLogin({ switchToSignup }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginFailed(false);
    const res = await signIn("credentials", {
      redirect: false,
      username: usernameInput,
      password: passwordInput,
      callbackUrl: "/home",
    });
    console.log("res is ", res);
    if (res && !res.url) {
      setLoginLoading(false);
      setLoginFailed(true);
    }
  };

  const handleSwitchSignup = () => {
    switchToSignup(true);
  };

  const handleVisitorLogin = async () => {
    setLoginLoading(true);
    setLoginFailed(false);
    const res = await fetch(`/api/auth/general-visitor-login`, {
      method: "POST",
    });
    const data = await res.json();
    console.log(
      "we back to handleVisitorLogin function. we called general visitor login api. the res is ",
      data,
    );
    // should return newly created (or existing) user object. Use user object to sign in, but use unhashed pw
    const signInRes = await signIn("credentials", {
      redirect: false,
      username: data.user.username,
      password: data.user.username,
      callbackUrl: "/home",
    });

    console.log("login api returned response. it is ", signInRes);
    if (signInRes && !signInRes.ok) {
      setLoginLoading(false);
      setLoginFailed(true);
    }
  };

  return (
    <div className={`card shadow-sm p-4 card-login`}>
      <form>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            required
            onChange={(e) => setUsernameInput(e.target.value)}
            value={usernameInput}
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="password"
            required
            onChange={(e) => setPasswordInput(e.target.value)}
            value={passwordInput}
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loginLoading}
          onClick={handleLogin}
        >
          {!loginLoading && "Log in"}
          {loginLoading && (
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
        <div className="border-bottom mt-2" />
        <button
          className="btn btn-success mt-3 mb-2 w-100"
          onClick={handleSwitchSignup}
        >
          Create an account
        </button>
        {loginFailed && (
          <div className="py-0 text-danger text-center">
            <small>Log in failed</small>
          </div>
        )}
      </form>
      <div className="border-bottom mt-2 mb-3" />
      <button
        className="btn btn-outline-primary w-100"
        onClick={() => {
          signIn("google", { callbackUrl: "/home" });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 48 48"
          className="google-logo"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
        Log in with Google
      </button>
      <button
        className="btn btn-outline-primary mt-3 w-100"
        onClick={handleVisitorLogin}
      >
        Log in as Visitor
      </button>
    </div>
  );
}
