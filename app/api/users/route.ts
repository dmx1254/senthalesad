import { NextResponse } from "next/server";
import User from "@/lib/models/user";
import { connectDB } from "@/lib/db/dbase";

connectDB();

export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Construire la requête de recherche
    const searchQuery = search
      ? {
          $or: [
            { firstname: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Récupérer les utilisateurs avec pagination
    const users = await User.find(searchQuery)
      .select("-password") // Exclure le mot de passe
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le nombre total d'utilisateurs pour la pagination
    const total = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
} 