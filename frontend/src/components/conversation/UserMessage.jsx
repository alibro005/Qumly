
function UserMessage({ question }) {
  return (
    <div className="msg msg--user">
      <div className="msg__label">
        You
      </div>

      <p className="msg__text">
        {question}
      </p>
    </div>
  );
}

export default UserMessage;