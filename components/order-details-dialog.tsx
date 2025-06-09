"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/app/dashboard/columns";
import { ORDER_STATUS } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CreditCard, MapPin } from "lucide-react";
import Image from "next/image";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const statusInfo = ORDER_STATUS[order.paymentStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30">
        <div className="bg-white/90 backdrop-blur-xl p-6 md:p-10 flex flex-col gap-6 relative">
          <DialogHeader className="flex flex-row items-center justify-between mb-2">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <span
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusInfo.color}`}
              >
                <span className="flex items-center justify-center w-4 h-4">
                  <statusInfo.icon size={16} />
                </span>
                {statusInfo.label}
              </span>
              <span className="text-gray-400 font-mono text-xs ml-2">
                {formatDate(order.createdAt)}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Liste produits */}
          <div className="space-y-4">
            <div className="font-semibold text-black/80 mb-1 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Produits commandés
            </div>
            <div className="flex flex-col gap-2">
              {order.products.map((prod, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {prod.image && (
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover w-12 h-12 border border-gray-100"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-black/90 text-sm line-clamp-1">
                      {prod.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      x{prod.quantity}
                    </div>
                  </div>
                  {prod.price && (
                    <div className="text-xs text-black/80 font-semibold">
                      {formatCurrency(prod.price)}
                    </div>
                  )}
                  {prod.price && (
                    <div className="text-xs text-gray-400 font-semibold ml-2">
                      {formatCurrency(prod.price * prod.quantity)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-xs text-gray-600">
                Commande n°{" "}
                <span className="font-semibold text-black/80">
                  {order.orderNumber}
                </span>
              </span>
              <span className="text-xs text-gray-600">
                Total :{" "}
                <span className="font-semibold text-black/80">
                  {formatCurrency(order.totalPrice)}
                </span>
              </span>
              <span className="text-xs text-gray-600">
                Articles :{" "}
                <span className="font-semibold text-black/80">
                  {order.products.length}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap gap-4 items-center mt-2">
              <span className="flex items-center gap-2 text-xs text-gray-600">
                <CreditCard size={14} className="text-blue-500" />{" "}
                <span className="font-medium">Paiement :</span>{" "}
                <span className="font-semibold text-black/70">
                  {order.paymentMethod === "cash-on-delivery" ||
                  order.paymentMethod === "payment_on_delivery"
                    ? "Paiement à la livraison"
                    : order.paymentMethod || "-"}
                </span>
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-600">
                <span className="font-medium">Livraison :</span>{" "}
                <span className="font-semibold text-black/70">
                  {formatCurrency(order.shipping || 0)}
                </span>
              </span>
            </div>
          </div>

          {/* Bloc adresse de livraison */}
          <div className="flex flex-col gap-1 bg-white rounded-xl p-4 mt-3 border border-gray-100 shadow-sm">
            <div className="font-semibold text-black/80 mb-1 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" /> Adresse de
              livraison
            </div>
            <div className="flex flex-col gap-1 text-xs text-gray-700">
              {order.shippingDetails.fullname && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nom :</span>{" "}
                  <span>{order.shippingDetails.fullname}</span>
                </div>
              )}
              {order.shippingDetails.address && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Adresse :</span>{" "}
                  <span>{order.shippingDetails.address}</span>
                </div>
              )}
              {order.shippingDetails.city && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ville :</span>{" "}
                  <span>{order.shippingDetails.city}</span>
                </div>
              )}
              {order.shippingDetails.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Téléphone :</span>{" "}
                  <span>{order.shippingDetails.phone}</span>
                </div>
              )}
              {order.shippingDetails.zip && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Code postal :</span>{" "}
                  <span>{order.shippingDetails.zip}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Adresse de livraison</h3>
              <div className="mt-2 text-sm">
                <p>{order.shippingDetails.address}</p>
                <p>{order.shippingDetails.city}</p>
                <p>{order.shippingDetails.zip}</p>
                <p className="text-gray-500">{order.shippingDetails.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Zone de livraison</h3>
              <div className="mt-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#FFCD00]" />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Zone de livraison :</p>
                        <p className="whitespace-pre-line">{order.shippingZone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut de la commande</h3>
              <div className="mt-2">
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusInfo.color}`}
                >
                  <span className="flex items-center justify-center w-4 h-4">
                    <statusInfo.icon size={16} />
                  </span>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
