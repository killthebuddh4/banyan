import { useParams } from "next/navigation.js";

export const useGroupAddressParam = () => {
  const params = useParams();
  const address = params.address;

  if (typeof address !== "string") {
    return null;
  }

  return address;
};
