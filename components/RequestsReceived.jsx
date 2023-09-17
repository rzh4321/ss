import RequestCard from "../components/RequestCard";

export default function RequestsReceived({ requests, session }) {
  return (
    <ul className={`ps-0 mx-auto user-card`}>
      <h1 className="fs-3 mb-0">Friend requests</h1>
      {requests.map((user) => (
        <RequestCard key={user._id} user={user} session={session} />
      ))}
    </ul>
  );
}
