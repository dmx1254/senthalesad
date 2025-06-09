"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ORDER_STATUS, OrderStatus } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import { toast } from "sonner";

export interface Product {
  name: string;
  description: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingDetails {
  fullname: string;
  address: string;
  city: string;
  phone: string;
  zip: string;
}

export type Order = {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: OrderStatus;
  createdAt: string;
  products: Product[];
  paymentMethod: string;
  shipping: number;
  shippingZone: string;
  shippingDetails: ShippingDetails;
  userId: {
    firstname: string;
    lastname: string;
    email: string;
  };
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du statut");
    }

    const updatedOrder = await response.json();
    toast.success("Statut mis à jour avec succès", {
      style: {
        color: "#10B981",
      },
      position: "top-right",
    });
    
    // Dispatch un événement personnalisé avec la commande mise à jour
    const event = new CustomEvent("orderStatusUpdated", { detail: updatedOrder });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    toast.error("Erreur lors de la mise à jour du statut", {
      style: {
        color: "#EF4444",
      },
      position: "top-right",
    });
    return false;
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Numéro de commande",
  },
  {
    accessorKey: "userId",
    header: "Client",
    cell: ({ row }) => {
      const user = row.original.userId;
      return `${user.firstname} ${user.lastname}`;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      return formatCurrency(amount);
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.original.paymentStatus as OrderStatus;
      const statusInfo = ORDER_STATUS[status];

      if (!statusInfo) {
        console.error(`Invalid status: ${status}`);
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            Statut inconnu
          </Badge>
        );
      }

      const Icon = statusInfo.icon;
      return (
        <Badge className={statusInfo.color}>
          <Icon className="mr-1 h-4 w-4" />
          {statusInfo.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return formatDate(row.getValue("createdAt"));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent("viewOrder", { detail: order });
              window.dispatchEvent(event);
            }}
          >
            <Eye size={28} className="text-orange-500 transition-all duration-300 hover:text-orange-600" />
            <span className="sr-only">Voir la commande</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal size={28} className="text-blue-500 transition-all duration-300 hover:text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(ORDER_STATUS).map(([status, info]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() =>
                    updateOrderStatus(order._id, status as OrderStatus)
                  }
                >
                  <info.icon className="mr-2 h-4 w-4" />
                  {info.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
