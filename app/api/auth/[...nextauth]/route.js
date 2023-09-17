import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      name: "credentials",
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: { label: "password", type: "password" },
      },
      // this will be called when we sign in with normal credentials
      async authorize(credentials, req) {
        const res = await fetch(
          `https://social-media-eight-rho.vercel.app/api/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
          },
        );
        // should either return user object + token, or error
        const data = await res.json();

        // If no error and we have user data, return it
        if (res.ok && data.user) {
          return data;
        }
        // Return null if user data could not be retrived
        console.log("cannot log in");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Google login: finding an existing account or creating a new account
      // in the database with the provided name, username and profilePicUrl from google
      if (account.provider === "google") {
        // user object has details from google account, use those details to retrieve or create user object
        // in api call later
        const credentials = {
          name: user.name,
          username: user.email,
          profilePicUrl: user.image,
        };
        const res = await fetch(
          `https://social-media-eight-rho.vercel.app/api/auth/google-login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          },
        );
        // user and token will be returned from api call
        const data = await res.json();
        // save token and id to user object so it can be used to create jwt and session later
        user.id = data.user._id;
        user.token = data.token;
        return true;
      } else if (account.provider === "credentials") {
        // we already have all the necessary data from authorize(), just return true
        return true;
      }
    },
    // transfer user data to token object
    async jwt({ token, user, account }) {
      // console.log("INSIDE JWT FUNCTION");
      // console.log("token jwt", token);
      // console.log("user jwt", user);
      // console.log("account jwt", account);
      if (account?.provider === "google") {
        token.accessToken = user.token;
        token.userId = user.id;
        token.userName = user.name;
        token.userEmail = user.email;
        token.userImage = user.image;
        // console.log("u signed in with google. token is now ", token);
      } else if (account?.provider === "credentials") {
        token.accessToken = user.token;
        token.userId = user.user._id;
        token.userName = user.user.name;
        token.userEmail = user.user.username;
        token.userImage = user.user.profile_pic_url;
        // console.log("u signed in with credentials. token is now ", token);
      }
      return token;
    },
    // transfer token data to session object
    async session({ session, token }) {
      // console.log("IN SESSION FUNCTION");
      // console.log("session is ", session);
      // console.log("token is ", token);
      session.accessToken = token.accessToken;
      session.user.userId = token.userId;
      session.user.name = token.userName;
      session.user.email = token.userEmail;
      session.user.image = token.userImage;
      // session stores user object (name, email, image, userID), accessToken, and expires
      return session;
    },
  },
});

export { handler as GET, handler as POST };
