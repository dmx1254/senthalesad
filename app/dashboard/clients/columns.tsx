"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  createdAt: string;
}

interface ClientActionsProps {
  user: User;
  onView: (user: User) => void;
  onDelete: (userId: string) => void;
}

function ClientActions({ user, onView, onDelete }: ClientActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onView(user)}
      >
        <Eye className="h-4 w-4 text-blue-500" />
        <span className="sr-only">Voir les détails</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onDelete(user._id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
        <span className="sr-only">Supprimer</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstname",
    header: "Prénom",
  },
  {
    accessorKey: "lastname",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "city",
    header: "Ville",
  },
  {
    accessorKey: "createdAt",
    header: "Date d'inscription",
    cell: ({ row }) => {
      return formatDate(row.getValue("createdAt"));
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <ClientActions
          user={user}
          onView={(user) => {
            window.dispatchEvent(new CustomEvent("viewUser", { detail: user }));
          }}
          onDelete={(userId) => {
            window.dispatchEvent(new CustomEvent("deleteUser", { detail: userId }));
          }}
        />
      );
    },
  },
]; 