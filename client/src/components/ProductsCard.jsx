import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Utensils } from "lucide-react"; // آیکون برای جذابیت بیشتر

export function CardImage({ product }) {
  return (
    // Ürün Kartı: Cam efekti ve yumuşak köşeler eklendi
    <Card className="group relative mx-auto w-full max-w-sm overflow-hidden border-white/40 bg-white/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 rounded-[2.5rem]">
      
      {/* Ürün Görseli: Köşeler ve hover efekti düzenlendi */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Görsel üzerine hafif bir yeşil degrade (Overlay) */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-black text-green-950">
            {product.name}
          </CardTitle>
          <Utensils size={16} className="text-green-600/50" />
        </div>
        <CardDescription className="text-green-800/70 font-medium line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Link to={`/product/${product._id}`} className="w-full">
          {/* Buton: Park temasına uygun yeşil ve yuvarlak tasarım */}
          <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-md shadow-green-600/20 transition-all active:scale-95">
            Detaylar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}