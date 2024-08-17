import { useQuery } from "react-query";
import { getCurrentUser } from "../../services/authServices";

export const useUser = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return { user, isLoading };
};
