export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      <span className="visually-hidden"></span>
    </div>
  );
}
