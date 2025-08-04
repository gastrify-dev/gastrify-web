"use client";

import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { getPatients } from "@/features/healthProfile/actions/get-patients";
import { Button } from "@/shared/components/ui/button";

export default function PatientsTable() {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["patiens-list"],
    queryFn: async () => {
      const { data: users, error } = await getPatients();

      if (error) return Promise.reject(error);

      return users;
    },
  });

  const handleViewProfile = (identificationNumber: string) => {
    router.push(`/profile/${identificationNumber}`); // Redirige a la ruta del perfil
  };

  return (
    <div className="overflow-x-auto border-2 border-gray-900 shadow-md sm:rounded-lg">
      <Table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <TableHeader className="bg-gray-100 dark:bg-black">
          <TableRow>
            <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Identification Number
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((user) => (
            <TableRow
              key={user.id}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:hover:bg-gray-800"
            >
              <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {user.name}
              </TableCell>
              <TableCell className="px-6 py-4 text-gray-900 dark:text-white">
                {user.identificationNumber}
              </TableCell>
              <TableCell className="px-6 py-4 text-gray-900 dark:text-white">
                {user.email}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <Button
                  type="button"
                  onClick={() => {
                    handleViewProfile(user.identificationNumber);
                  }}
                  className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Health Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
