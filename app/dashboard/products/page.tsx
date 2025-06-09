"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { columns, Product } from "./columns";
import { ProductsTable } from "@/components/products-table";
import { categories } from "@/lib/data";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [productUpdated, setProductUpdated] = useState<Product | null>(null);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        category: selectedCategory,
        subCategory: selectedSubCategory,
      });

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des produits");
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la récupération des produits", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (productUpdated) {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productUpdated._id ? productUpdated : product
        )
      );
    }
  }, [productUpdated]);

  // Ajouter un écouteur d'événement pour le rafraîchissement
  useEffect(() => {
    const handleProductUpdated = (event: CustomEvent<Product>) => {
      setProductUpdated(event.detail);
    };

    window.addEventListener("productUpdated", handleProductUpdated as EventListener);
    return () => {
      window.removeEventListener("productUpdated", handleProductUpdated as EventListener);
    };
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubCategory("all");
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategory(value);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.slug === selectedCategory
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Link href="/dashboard/products/new">
          <Button className="bg-[#FFCD00] hover:bg-[#FFCD00]/80 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Liste des produits</CardTitle>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-[300px]"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSubCategory}
                onValueChange={handleSubCategoryChange}
                disabled={!selectedCategoryData}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Toutes les sous-catégories
                  </SelectItem>
                  {selectedCategoryData?.subcat?.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.slug}>
                      {subcat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="h-12 px-4 flex items-center border-b">
                  <div className="flex items-center gap-4 w-full">
                    <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-[100px] flex-shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-[100px] flex-shrink-0" />
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  </div>
                </div>
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="h-16 px-4 flex items-center border-b last:border-0">
                    <div className="flex items-center gap-4 w-full">
                      <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-[100px] flex-shrink-0" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-[100px] flex-shrink-0" />
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ProductsTable
              columns={columns}
              data={products}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
