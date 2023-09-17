"use client";

import { useState, useEffect } from "react";
import CardLogin from "../../components/CardLogin";
import CardSignup from "../../components/CardSignup";
import HomeBanner from "../../components/HomeBanner";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../../styles/Home.css";

const SignIn = () => {
  const [signupCard, setSignupCard] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      console.log("detected ur already logged in, redirecting to home page");
      return router.push("/home");
    }
  }, [router, session]);

  return (
    <>
      <div className="container-fluid py-5">
        <div className="container-sm">
          <div className="row align-items-center justify-content-center gx-5">
            <div className="col-sm-6">
              <HomeBanner />
            </div>
            <div className="col-sm">
              {signupCard ? (
                <CardSignup switchToSignup={setSignupCard} />
              ) : (
                <CardLogin switchToSignup={setSignupCard} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
