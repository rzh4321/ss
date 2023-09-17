import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import Link from "next/link";
import Image from "next/image";

export default function NewPostCard({ authuserData }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentInput, setContentInput] = useState("");
  const [imageInput, setImageInput] = useState(null);
  const [fileError, setFileError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isContentError, setIsContentError] = useState(false);

  function handleImageChange(e) {
    const selectedFile = e.target.files[0];

    // Check if a file was selected
    if (selectedFile) {
      // Check file type (allow only JPEG and PNG)
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setFileError("Please select a JPEG or PNG image");
        return;
      }

      // Check file size (limit to 16 MB)
      const maxSize = 16 * 1024 * 1024; // 16 MB in bytes
      if (selectedFile.size > maxSize) {
        setFileError("Image size exceeds the 16 MB limit");
        return;
      }
      setFileError();
      setImageInput(selectedFile);
    }
  }

  // Focus on the content input when newPostModal is shown
  useEffect(() => {
    const newPostModal = document.getElementById("newPostModal");
    const formTextarea = document.getElementById("formTextarea");

    newPostModal.addEventListener("shown.bs.modal", () => {
      formTextarea.focus();
    });
  }, []);

  // Create FormData object with the content and the optional image for the new post
  const handleNewPost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("content", contentInput);
    if (imageInput) {
      console.log("u have an image");
      formData.append("image", imageInput);
    }

    const res = await fetch(`/api/users/${session.user.userId}/posts`, {
      method: "POST",
      body: formData,
    });
    //console.log('back from api call to post a post. res is ', res);
    setIsLoading(false);
    if (res.status === 201) {
      setIsContentError(false);
      location.reload();
    } else {
      setIsContentError(true);
    }
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className={`card shadow-sm p-3 feed-card`}>
          <div className="row g-0">
            {authuserData.profilePicUrl ? (
              <Image
                className={`my-auto rounded-circle user-profile-pic`}
                alt="profile pic"
                width={40}
                height={40}
                src={authuserData.profilePicUrl}
              />
            ) : (
              <div className={`my-auto rounded-circle user-profile-pic`}>
                <span
                  className={`user-profile-pic-icon material-symbols-outlined`}
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
            <div className="col ms-2 new-post-text">
              <button
                className={`btn btn-light text-secondary w-100 text-start text-nowrap user-profile-pic`}
                data-bs-toggle="modal"
                data-bs-target="#newPostModal"
              >
                Welcome, {authuserData.name}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* New Post Modal */}
      <div
        className="modal fade"
        id="newPostModal"
        tabIndex="-1"
        aria-labelledby="newPostModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <form
            className="modal-content"
            encType="multipart/form-data"
            onSubmit={handleNewPost}
          >
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newPostModalLabel">
                Create Post
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="">
                <label htmlFor="formTextarea" className="form-label ms-2">
                  Description
                </label>
                <textarea
                  className={`form-control new-post-modal-textarea`}
                  placeholder=""
                  id="formTextarea"
                  required
                  onChange={(e) => setContentInput(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="formImage"
                  className="form-label ms-2"
                >{`Upload Image (JPG/PNG not bigger than 16Mb)`}</label>
                <input
                  className="form-control"
                  type="file"
                  id="formImage"
                  name="formImage"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {fileError && (
              <div className="alert alert-danger px-3 py-2 mx-3" role="alert">
                {fileError}
              </div>
            )}

            {isContentError && (
              <div className="alert alert-danger px-3 py-2 mx-3" role="alert">
                Something went wrong
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={fileError}
              >
                {!isLoading && "Post"}
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
          </form>
        </div>
      </div>
    </>
  );
}
