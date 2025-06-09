"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  subCategory: string;
  stock: number;
}

interface EditProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductUpdated: () => void;
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
  onProductUpdated,
}: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price.toString() || "",
    description: product?.description || "",
    category: product?.category || "",
    subCategory: product?.subCategory || "",
    stock: product?.stock.toString() || "",
    image: product?.image || "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour le formulaire quand le produit change
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        stock: product.stock.toString(),
        image: product.image,
      });
      setImagePreview(product.image);
    }
  }, [product]);

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
    if (!product) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
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
        throw new Error("Erreur lors de la modification du produit");
      }

      const updatedProduct = await response.json();

      toast.success("Produit modifié avec succès", {
        style: {
          color: "#22c55e",
        },
        duration: 3000,
        position: "top-right",
      });

      // Déclencher l'événement avec le produit mis à jour
      window.dispatchEvent(
        new CustomEvent("productUpdated", {
          detail: updatedProduct,
        })
      );
      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la modification du produit", {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="w-full">
              <Label htmlFor="category" className="mb-2">
                Catégorie
              </Label>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    subCategory: "",
                  }))
                }
                className="w-full border border-gray-200 shadow-sm p-1.5 rounded-[10px]"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.slug}>
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: e.target.value,
                  }))
                }
                defaultValue={formData.subCategory}
                className="w-full border border-gray-200 shadow-sm p-1.5 rounded-[10px]"
              >
                {categories
                  .find((c) => c.slug === formData.category)
                  ?.subcat?.map((subCategory, index) => (
                    <option key={index} value={subCategory.slug}>
                      {subCategory.title}
                    </option>
                  ))}
              </select>
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
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
