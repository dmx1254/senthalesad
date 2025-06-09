"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "./columns";
import { OrdersTable } from "@/components/orders-table";
import { ORDER_STATUS } from "@/lib/constants";
import {
  PackageCheck,
  Clock3,
  LoaderCircle,
  PackageX,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderDetailsDialog } from "@/components/order-details-dialog";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        status: statusFilter,
      });

      const response = await fetch(`/api/orders?${params}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des commandes");
      const data = await response.json();
      
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handleViewOrder = (event: CustomEvent<Order>) => {
      setSelectedOrder(event.detail);
      setIsDetailsOpen(true);
    };

    const handleOrderStatusUpdated = (event: CustomEvent<Order>) => {
      const updatedOrder = event.detail;
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    };

    window.addEventListener("viewOrder", handleViewOrder as EventListener);
    window.addEventListener("orderStatusUpdated", handleOrderStatusUpdated as EventListener);
    
    return () => {
      window.removeEventListener("viewOrder", handleViewOrder as EventListener);
      window.removeEventListener("orderStatusUpdated", handleOrderStatusUpdated as EventListener);
    };
  }, []);

  const stats = {
    total: orders.length,
    delivered: orders.filter((order) => order.paymentStatus === "delivered").length,
    pending: orders.filter((order) => order.paymentStatus === "pending").length,
    processing: orders.filter((order) => order.paymentStatus === "processing").length,
    cancelled: orders.filter((order) => order.paymentStatus === "cancelled").length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalPrice, 0),
  };

  const statCards = [
    {
      title: "Total Commandes",
      value: stats.total,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Commandes Livrées",
      value: stats.delivered,
      icon: PackageCheck,
      color: "bg-green-500",
    },
    {
      title: "En Attente",
      value: stats.pending,
      icon: Clock3,
      color: "bg-yellow-500",
    },
    {
      title: "En Traitement",
      value: stats.processing,
      icon: LoaderCircle,
      color: "bg-purple-500",
    },
    {
      title: "Annulées",
      value: stats.cancelled,
      icon: PackageX,
      color: "bg-red-500",
    },
    {
      title: "Montant Total",
      value: formatCurrency(Number(stats.totalAmount)),
      icon: ShoppingCart,
      color: "bg-indigo-500",
    },
  ];

  const renderStatCard = (stat: typeof statCards[0], index: number) => {
    const Icon = stat.icon;
    return (
      <Card key={index} className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {stat.title}
          </CardTitle>
          <div className={`${stat.color} p-2 rounded-full`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map(renderStatCard)}
        </div>

        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Commandes récentes</CardTitle>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {Object.entries(ORDER_STATUS).map(
                      ([status, info]) => (
                        <SelectItem key={status} value={status}>
                          {info.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[400px] w-full" />
              </div>
            ) : (
              <OrdersTable
                columns={columns}
                data={orders}
                pagination={pagination}
                onPageChange={(page) => fetchOrders(page)}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
