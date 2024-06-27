export const Message = (props: { outbound: boolean; text: string }) => {
  return (
    <div
      className={`message fadeIn ${props.outbound ? "outbound" : undefined}`}
    >
      {props.text}
    </div>
  );
};
