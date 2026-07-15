function Product(props) {
  return (
    <section className="product-page">
      <div className="product-card">
        <h3>Product name is {props.pName}</h3>
        <button>{props.price}</button>
      </div>
    </section>
  );
}

export default Product;
