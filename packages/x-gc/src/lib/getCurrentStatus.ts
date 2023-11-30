export const getCurrentStatus = ({
  statuses,
}: {
  statuses: Array<{ status: string }>;
}) => {
  const accepted = statuses.find((s) => s.status === "accepted");
  if (accepted === undefined) {
    // do nothing
  } else {
    return "accepted";
  }

  const declined = statuses.find((s) => s.status === "declined");
  if (declined === undefined) {
    // do nothing
  } else {
    return "declined";
  }

  return "pending";
};
