import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Order from "@/lib/models/order";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectDB } from "@/lib/db/dbase";
import { ORDER_STATUS } from "@/lib/constants";

await connectDB();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: orderId } = await params;
  console.log(orderId);
  const session = await getServerSession(options);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { status } = await request.json();

    if (!status || !Object.keys(ORDER_STATUS).includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: status },
      { new: true }
    ).populate("userId", "firstname lastname email");

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "delivered") {
      const message = `Bonjour ${order.shippingDetails.fullname}, Merci d'avoir passé commande chez Senthales.`;
      await fetch("https://api.axiomtext.com/api/sms/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
        },
        body: JSON.stringify({
          to: order.shippingDetails.phone,
          message: message,
          signature: "SENTHALES",
        }),
      });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
