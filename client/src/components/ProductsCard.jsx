import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export function CardImage({ product }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video" />
      <img
        src={product.image}
        alt={product.name}
        className="relative z-20 aspect-video w-full object-cover  dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link to={`/product/${product._id}`} className="w-full">
          <Button className="w-full">Detaylar</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
