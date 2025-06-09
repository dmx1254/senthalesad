"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/utils";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    stock: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du produit");
      }

      toast.success("Produit créé avec succès", {
        style: {
          color: "#22c55e",
        },
        duration: 3000,
        position: "top-right",
      });

      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création du produit", {
        style: {
          color: "#ef4444",
        },
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.slug === formData.category
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Nouveau Produit</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer un nouveau produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image" className="mb-2">
                    Image du produit
                  </Label>
                  <div className="mt-2">
                    <div
                      className="relative h-48 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="Aperçu"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview("");
                              setFormData((prev) => ({ ...prev, image: "" }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Cliquez pour télécharger une image
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="mb-2">
                    Nom du produit
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="mb-2">
                    Prix
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stock" className="mb-2">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, stock: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-full">
                  <Label htmlFor="category" className="mb-2">
                    Catégorie
                  </Label>
                  <select
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                        subCategory: "",
                      }))
                    }
                    className="w-full border border-gray-200 shadow-sm p-1.5 rounded-[10px]"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <Label htmlFor="subCategory" className="mb-2">
                    Sous-catégorie
                  </Label>
                  <select
                    value={formData.subCategory}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        subCategory: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 shadow-sm p-1.5 rounded-[10px]"
                    required
                    disabled={!selectedCategory}
                  >
                    <option value="">Sélectionner une sous-catégorie</option>
                    {selectedCategory?.subcat?.map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.slug}>
                        {subCategory.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/products">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? "Création..." : "Créer le produit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 