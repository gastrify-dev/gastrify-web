import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/shared/actions/get-user";

interface Props {
  id?: string;
  identificationNumber?: string;
}

export const useUser = ({ id, identificationNumber }: Props) => {
  if (!id && !identificationNumber)
    throw new Error(
      "Either id or identification number is required in useUser",
    );

  return useQuery({
    queryKey: ["user", "details", id ?? identificationNumber],
    queryFn: async () => {
      const { data, error } = await getUser({ id, identificationNumber });

      if (error) throw new Error(error.message);

      return data;
    },
  });
};
