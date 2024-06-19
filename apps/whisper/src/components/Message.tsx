export const Message = (props: { outbound: boolean; text: string }) => {
  return (
    <div className={`message ${props.outbound ? "outbound" : undefined}`}>
      {props.text}
    </div>
  );
};
