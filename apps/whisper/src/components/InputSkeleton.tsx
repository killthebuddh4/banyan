export const InputSkeleton = () => {
  return (
    <form className="input">
      <input type="text" value={""} onChange={(e) => null} />
      <button type="submit">Send</button>
    </form>
  );
};
