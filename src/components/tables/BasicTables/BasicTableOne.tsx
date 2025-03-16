import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function BasicTableOne() {
  // Define the table phtoURL using the interface
  interface UsersList {
    uid: string;
    photoURL?: string;
    name?: string;
    date?: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
  }

  // Define the table data using the interface
  const [users, setUsers] = useState<UsersList[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const userCollection = collection(db, "user");
      const usersSnapshot = await getDocs(userCollection);
      const usersList = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          photoURL: data.photoURL || "Foto no disponible",
          name: data.name || "Nombre no disponible",
          date: data.date || "Fecha no disponible",
          email: data.email || "Correo no disponible",
          phone: data.phone || "Sin teléfono",
          address: data.address || "Sin dirección",
          gender: data.gender || "Sin género",
        } as UsersList;
      });
      setUsers(usersList);
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Usuario
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Correo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Dirección
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Número de teléfono
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Genero
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((order) => (
                <TableRow key={order.uid}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        {order.photoURL ? (
                          <img
                            width={40}
                            height={40}
                            src={order.photoURL}
                            alt={order.name || "Usuario"}
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-600">
                            ?
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.name || "Nombre no disponible"}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.date || "Fecha no disponible"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.email || "Correo no disponible"}</TableCell>
                  <TableCell>
                    {order.address || "Dirección no disponible"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      color={
                        order.phone === "Active"
                          ? "success"
                          : order.phone === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.phone || "Estado desconocido"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.gender || "Género no disponible"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
