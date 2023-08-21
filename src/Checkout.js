import { useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";

// Instructions:

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.
// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  onAddBtnClick,
  onRemoveBtnClick
}) => {
  const [quantity, setQuantity] = useState(0);

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{quantity}</td>
      <td>${total}</td>
      <td>
        <button
        disabled = {quantity === availableCount}
          onClick={() => {
            setQuantity(quantity+1);
            onAddBtnClick(price);
          }}
          className={styles.actionButton}
        >
          +
        </button>
        <button disabled = {quantity === 0} onClick={() => {
          setQuantity(quantity-1);
          onRemoveBtnClick(price)
        }} className={styles.actionButton}>-</button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleAddBtn = (productPrice) => {
    if (totalPrice + productPrice > 1000) {
      setDiscount( (totalPrice + productPrice)  * 0.1);
    }
    setTotalPrice((prev) => prev + productPrice);
    
  };

  const handleRemoveBtn = (productPrice) => {
    if (totalPrice - productPrice < 1000) {
      setDiscount(0);
    }
    setTotalPrice((prev) => prev - productPrice);
  }

  useEffect(() => {
    const request = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    request();
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <h1>Checkout</h1>
      </header>
      <main>
        {loading ? (
          <LoadingIcon />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th># Available</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <Product
                  onRemoveBtnClick = {handleRemoveBtn}
                  onAddBtnClick={handleAddBtn}
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  availableCount={item.availableCount}
                  price={item.price}
                  orderedQuantity={item.orderedQuantity}
                  total={item.total}
                />
              ))}
            </tbody>
          </table>
        )}
        <h2>Order summary</h2>
        <p>Discount: $ {discount.toFixed(2)} </p>
        <p>Total: $ {totalPrice.toFixed(2)}</p>
      </main>
    </div>
  );
};

export default Checkout;
