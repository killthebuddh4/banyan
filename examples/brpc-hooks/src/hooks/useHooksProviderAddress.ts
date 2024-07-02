import { useParams } from "next/navigation";

export const useHooksProviderAddress = () => {
  const params = useParams();
  const address = params.address;

  if (typeof address !== "string") {
    throw new Error("No group address provided");
  }

  return address;
};
