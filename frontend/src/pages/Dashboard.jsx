import Product from "./Product.jsx";

export default function Dashboard() {
  const product = [
    {
      productName: "Headphone",
      price: 24995,
    },
  ];

  return (
    <div>
      <Product pName={product[0].productName} price={product[0].price} />
    </div>
  );
}
