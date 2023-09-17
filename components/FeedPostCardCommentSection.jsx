import NewComment from "./NewComment";
import CommentsList from "./CommentsList";

export default function FeedPostCardCommentSection({
  post,
  comments,
  setComments,
  authuserData,
}) {
  return (
    <div className="mx-3">
      <NewComment
        postid={post._id}
        comments={comments}
        setComments={setComments}
        authuserData={authuserData}
      />
      <CommentsList comments={comments} authuserData={authuserData} />
    </div>
  );
}
