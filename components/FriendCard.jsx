import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function FriendCard({ user }) {
  const router = useRouter();

  const handleClickProfilePic = () => {
    router.push(`/users/${user._id}`);
  };

  return (
    <li className="row mt-3 justify-content-center">
      <div className={`card shadow-sm p-3`}>
        <div className="d-flex d-row align-items-center gap-2">
          {user.profilePicUrl ? (
            <Image
              className={`my-auto rounded-circle user-profile-pic`}
              height={40}
              width={40}
              alt="profile-pic"
              onClick={handleClickProfilePic}
              src={user.profilePicUrl}
            />
          ) : (
            <div
              className={`my-auto rounded-circle user-profile-pic user-profile-pic`}
              onClick={handleClickProfilePic}
            >
              <span
                className={`user-profile-pic-icon material-symbols-outlined`}
              >
                <svg
                  className="request-icon user-profile-pic post-card"
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
      </div>
    </li>
  );
}
