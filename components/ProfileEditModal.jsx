import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../styles/profile.css";
import { useEffect, useRef, useState } from "react";

export default function ProfileEditModal({ userData }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isContentError, setIsContentError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [duplicateImages, setDuplicateImages] = useState(false);
  const [imageInput, setImageInput] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSaveChanges = async () => {
    if (
      name.trim().length === 0 &&
      profileUrl.trim().length === 0 &&
      !imageInput
    ) {
      setIsContentError(true);
      return;
    }
    if (profileUrl.trim().length > 0 && imageInput) {
      setDuplicateImages(true);
      return;
    }
    setIsLoading(true);
    setFileError(false);
    setDuplicateImages(false);
    setIsSuccess(false);
    setIsContentError(false);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePicUrl", profileUrl);
    if (imageInput) {
      formData.append("image", imageInput);
    }
    const res = await fetch(`/api/users/${session.user.userId}/profile`, {
      method: "PUT",
      body: formData,
    });
    switch (res.status) {
      case 200:
        setIsLoading(false);
        setIsError(false);
        setIsContentError(false);
        setFileError(false);
        setDuplicateImages(false);
        setIsSuccess(true);
        setTimeout(() => {
          location.reload();
          setIsSuccess(false);
        }, 500);
        break;
      default:
        setIsLoading(false);
        setIsContentError(false);
        setFileError(false);
        setDuplicateImages(false);
        setIsError(true);
        setIsSuccess(false);
    }
  };

  return (
    <div className="col mt-auto">
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-outline-primary d-flex text-nowrap py-1 px-2 ms-auto"
        data-bs-toggle="modal"
        data-bs-target="#profileEditModal"
      >
        <span className="material-symbols-outlined">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="like-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </span>
        Edit
      </button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="profileEditModal"
        tabIndex="-1"
        aria-labelledby="profileEditModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="profileEditModal">
                Edit profile
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form className="modal-body">
              <div className="mb-3">
                <label htmlFor="nameFormControlInput" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nameFormControlInput"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="profilePicUrlFormControlInput"
                  className="form-label"
                >
                  Profile picture url
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="profilePicUrlFormControlInput"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
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
              {isContentError && (
                <div className="alert alert-danger px-3 py-2" role="alert">
                  All fields cannot be empty
                </div>
              )}
              {isError && (
                <div className="alert alert-danger px-3 py-2" role="alert">
                  Something went wrong
                </div>
              )}
              {duplicateImages && (
                <div className="alert alert-danger px-3 py-2" role="alert">
                  Cannot have both a profile image URL and an uploaded image
                </div>
              )}
              {fileError && (
                <div className="alert alert-danger px-3 py-2 mx-3" role="alert">
                  {fileError}
                </div>
              )}
              {isSuccess && (
                <div className="alert alert-success px-3 py-2" role="alert">
                  Profile updated
                </div>
              )}
            </form>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={fileError}
              >
                {!isLoading && "Save changes"}
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
          </div>
        </div>
      </div>
    </div>
  );
}
