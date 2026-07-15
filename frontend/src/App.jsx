import { useEffect, useMemo, useState } from "react";
import GoogleOauth from "./Components/GoogleOauth";
import "./App.css";

const products = [
  {
    id: "doms-fine-art",
    title: "Fine Art Kit",
    brand: "DOMS",
    price: 499,
    image: "https://domsindia.com/wp-content/uploads/2025/06/FINE-ART.webp",
    description: "Fine art set for painting, colouring and creative projects.",
  },
  {
    id: "doms-pencil-accessories",
    title: "Pencils & Accessories",
    brand: "DOMS",
    price: 120,
    image: "https://domsindia.com/wp-content/uploads/2025/06/1-1-scaled.webp",
    description: "DOMS pencils and school accessories for daily classwork.",
  },
  {
    id: "doms-drawing-colouring",
    title: "Drawing & Colouring Set",
    brand: "DOMS",
    price: 260,
    image: "https://domsindia.com/wp-content/uploads/2025/06/2-1-scaled.webp",
    description: "Colouring supplies for charts, diagrams and art files.",
  },
  {
    id: "doms-math-instruments",
    title: "Mathematical Drawing Instruments",
    brand: "DOMS",
    price: 180,
    image: "https://domsindia.com/wp-content/uploads/2025/06/3-scaled.webp",
    description: "Geometry and mathematical tools for school exams.",
  },
  {
    id: "doms-paper-stationery",
    title: "Paper Stationery Pack",
    brand: "DOMS",
    price: 240,
    image: "https://domsindia.com/wp-content/uploads/2025/06/4-scaled.webp",
    description: "DOMS paper stationery for notes, projects and assignments.",
  },
  {
    id: "doms-school-kit",
    title: "School Essentials Kit",
    brand: "DOMS",
    price: 350,
    image: "https://domsindia.com/wp-content/uploads/2025/06/5-scaled.webp",
    description: "Useful DOMS school kit with writing and colouring material.",
  },
  {
    id: "doms-notebooks",
    title: "Notebook & Paper Bundle",
    brand: "DOMS",
    price: 320,
    image: "https://domsindia.com/wp-content/uploads/2025/06/6-scaled.webp",
    description: "Paper and notebook bundle for homework and records.",
  },
  {
    id: "doms-brushes",
    title: "Brushes & Paint Set",
    brand: "DOMS",
    price: 285,
    image: "https://domsindia.com/wp-content/uploads/2025/06/7-scaled.webp",
    description: "Brushes and paint supplies for practical art classes.",
  },
  {
    id: "doms-pen-writing",
    title: "Pens & Writing Instruments",
    brand: "DOMS",
    price: 199,
    image: "https://domsindia.com/wp-content/uploads/2025/06/8-scaled.webp",
    description: "Pens and writing tools for school and office use.",
  },
  {
    id: "doms-project-file",
    title: "Project File Material",
    brand: "DOMS",
    price: 150,
    image: "https://domsindia.com/wp-content/uploads/2025/06/9-scaled.webp",
    description: "Sheets and project material for submissions and files.",
  },
  {
    id: "doms-markers",
    title: "Markers & Highlighters",
    brand: "DOMS",
    price: 175,
    image: "https://domsindia.com/wp-content/uploads/2025/06/10-scaled.webp",
    description: "Marker pens and highlighters for revision and presentation.",
  },
  {
    id: "doms-gifting",
    title: "Gifting Stationery Pack",
    brand: "DOMS",
    price: 449,
    image: "https://domsindia.com/wp-content/uploads/2025/06/11-scaled.webp",
    description: "Gift-ready stationery pack for students and creative users.",
  },
];

const offers = [
  {
    id: "offer-pencil",
    title: "Pencil Accessories Combo",
    brand: "DOMS Offer",
    price: 199,
    description: "Pencils and accessories combo for daily classwork.",
    freeItem: "Free DOMS Sharpener",
  },
  {
    id: "offer-colouring",
    title: "Drawing & Colouring Combo",
    brand: "DOMS Offer",
    price: 299,
    description: "Colouring set for charts, diagrams and project files.",
    freeItem: "Free DOMS Drawing Sheet Pack",
  },
  {
    id: "offer-math",
    title: "Math Instruments Combo",
    brand: "DOMS Offer",
    price: 249,
    description: "Geometry tools and writing instruments for exam work.",
    freeItem: "Free DOMS Eraser",
  },
  {
    id: "offer-paper",
    title: "Paper Stationery Combo",
    brand: "DOMS Offer",
    price: 279,
    description: "Paper stationery bundle for notes and assignments.",
    freeItem: "Free DOMS Label Sheet",
  },
  {
    id: "offer-marker",
    title: "Marker Pens Combo",
    brand: "DOMS Offer",
    price: 229,
    description: "Markers and highlighters for revision and presentation.",
    freeItem: "Free DOMS Sticky Notes",
  },
  {
    id: "offer-art",
    title: "Fine Art Combo",
    brand: "DOMS Offer",
    price: 399,
    description: "Fine art supplies for painting and creative projects.",
    freeItem: "Free DOMS Brush",
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminData, setAdminData] = useState({
    summary: null,
    products: [],
    orders: [],
    users: [],
  });
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminReload, setAdminReload] = useState(0);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart],
  );

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(""), 2400);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (page !== "admin" || !adminUnlocked) return undefined;

    let active = true;

    async function loadAdminData() {
      setAdminLoading(true);
      try {
        const adminHeaders = { "x-admin-password": adminPassword };
        const [summaryResponse, productsResponse, ordersResponse, usersResponse] =
          await Promise.all([
            fetch("/api/admin/summary", { headers: adminHeaders }),
            fetch("/api/admin/products", { headers: adminHeaders }),
            fetch("/api/admin/orders", { headers: adminHeaders }),
            fetch("/api/admin/users", { headers: adminHeaders }),
          ]);

        if ([summaryResponse, productsResponse, ordersResponse, usersResponse].some(
          (response) => response.status === 401,
        )) {
          throw new Error("ADMIN_LOCKED");
        }

        const [summary, productsData, ordersData, usersData] = await Promise.all([
          summaryResponse.json(),
          productsResponse.json(),
          ordersResponse.json(),
          usersResponse.json(),
        ]);

        if (active) {
          setAdminData({
            summary,
            products: productsData,
            orders: ordersData,
            users: usersData,
          });
        }
      } catch (error) {
        if (!active) return;
        if (error.message === "ADMIN_LOCKED") {
          setAdminUnlocked(false);
          setMessage("Wrong admin password.");
          return;
        }
        setMessage("Admin data did not load. Check backend and MySQL.");
      } finally {
        if (active) setAdminLoading(false);
      }
    }

    loadAdminData();
    return () => {
      active = false;
    };
  }, [page, adminUnlocked, adminPassword, adminReload]);

  const addCartItem = (item, note) => {
    const sameItemCount = cart.filter(
      (cartItem) => cartItem.id === item.id && !cartItem.isFree,
    ).length;

    if (sameItemCount >= 3) {
      setMessage(`Maximum 3 ${item.title} allowed in one order`);
      return;
    }

    const cartId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setCart((items) => [...items, { ...item, cartId }]);
    setMessage(note || `${item.title} added to cart`);
  };

  const addOffer = (offer) => {
    if (cart.some((item) => item.id === offer.id)) {
      setMessage(`${offer.title} is already in cart`);
      return;
    }
    const paidItem = {
      id: offer.id,
      title: offer.title,
      brand: offer.brand,
      price: offer.price,
      description: offer.description,
    };
    const freeItem = {
      id: `${offer.id}-free`,
      title: offer.freeItem,
      brand: "Free",
      price: 0,
      description: `Included with ${offer.title}`,
      isFree: true,
    };

    setCart((items) => [
      ...items,
      { ...paidItem, cartId: `${offer.id}-${Date.now()}` },
      { ...freeItem, cartId: `${offer.id}-free-${Date.now()}` },
    ]);
    setMessage(`${offer.title} added with ${offer.freeItem}`);
  };

  const removeFromCart = (cartId) => {
    setCart((items) => {
      const target = items.find((item) => item.cartId === cartId);
      if (target) setMessage(`${target.title} removed from cart`);
      return items.filter((item) => item.cartId !== cartId);
    });
  };

  const saveUser = async (profile) => {
    setUser(profile);
    setMessage(`Welcome ${profile.name}`);

    try {
      await fetch("/api/auth/google-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
    } catch {
      setMessage("Signed in successfully.");
    }
  };

  const saveOrder = async (
    paymentMode,
    razorpayOrderId,
    status = "pending-payment",
  ) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total,
        paymentMode,
        razorpayOrderId,
        status,
      }),
    });
    return response.json();
  };

  const updateOrder = async (orderId, updates) => {
    if (!orderId) return null;
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  };

  const saveCheckoutOrder = async (
    paymentMode = "manual-checkout",
    razorpayOrderId = `manual_${Date.now()}`,
  ) => {
    await saveOrder(paymentMode, razorpayOrderId, "placed");
    setCart([]);
    setPaying(false);
    setMessage("Order placed successfully.");
  };

  const completePayment = async () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    if (!user) {
      setMessage("Please sign in with Google before payment.");
      return;
    }

    setPaying(true);
    try {
      const orderResponse = await fetch("/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await orderResponse.json();
      const savedOrder = await saveOrder(
        order.demo || order.fallback ? "razorpay-direct" : "razorpay",
        order.id,
        "pending-payment",
      );

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        await updateOrder(savedOrder._id, {
          status: "placed-without-gateway",
          paymentMode: "manual-checkout",
        });
        setCart([]);
        setPaying(false);
        setMessage("Order saved. Payment can be completed later.");
        return;
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Stationery Hub",
        description: "DOMS stationery order payment",
        order_id: order.demo || order.fallback ? undefined : order.id,
        prefill: {
          name: user?.name || "Student",
          email: user?.email || "",
        },
        theme: { color: "#7b2ff7" },
        handler: async (paymentResponse) => {
          await updateOrder(savedOrder._id, {
            status: "paid",
            razorpayPaymentId:
              paymentResponse?.razorpay_payment_id || "test_payment",
          });
          setCart([]);
          setPaying(false);
          setMessage("Payment successful. Your order has been saved.");
        },
        modal: {
          ondismiss: async () => {
            await updateOrder(savedOrder._id, { status: "payment-cancelled" });
            setPaying(false);
            setMessage("Payment cancelled. Order is still saved.");
          },
        },
      });

      checkout.on("payment.failed", async () => {
        await updateOrder(savedOrder._id, { status: "payment-failed" });
        setPaying(false);
        setMessage("Payment failed. Order is still saved.");
      });

      checkout.open();
    } catch {
      await saveCheckoutOrder("manual-checkout");
    }
  };

  const unlockAdmin = (event) => {
    event.preventDefault();
    if (!adminPassword.trim()) {
      setMessage("Enter admin password.");
      return;
    }
    setAdminUnlocked(true);
    setAdminReload((value) => value + 1);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-block">
          <h1>Stationery Hub</h1>
          <p>School, art and office essentials in one bright store</p>
        </div>
        <div className="auth-box">
          <GoogleOauth
            onLogin={saveUser}
            user={user}
            onLogout={() => setUser(null)}
          />
          <button className="cart-chip" onClick={() => setPage("cart")}>
            Cart {cart.length}
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {["home", "products", "cart", "offers", "admin", "contact"].map(
          (item) => (
            <button
              className={page === item ? "active" : ""}
              onClick={() => setPage(item)}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>

      {message && <p className="toast">{message}</p>}

      <main>
        {page === "home" && (
          <section className="hero panel">
            <div className="hero-copy">
              <p className="eyebrow">Fresh supplies for school and work</p>
              <h2>Everything for notes, projects, exams and creative work.</h2>
              <p>
                Explore DOMS notebooks, pens, colours, files, art tools and combo
                offers in one bright stationery store.
              </p>
              <button onClick={() => setPage("products")}>Shop Products</button>
            </div>
            <img
              src="/stationery-hero.png"
              alt="DOMS stationery collection"
            />
          </section>
        )}

        {page === "products" && (
          <section className="panel">
            <h2>Products</h2>
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.image} alt={product.title} />
                  <span>{product.brand}</span>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="price-row">
                    <strong>Rs. {product.price}</strong>
                    <button onClick={() => addCartItem(product)}>Add</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === "cart" && (
          <section className="panel cart-panel">
            <h2>Cart</h2>
            {cart.length === 0 ? (
              <p className="empty-cart">
                Your cart is empty. Add products to continue.
              </p>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div
                      className={
                        item.isFree ? "cart-item free-item" : "cart-item"
                      }
                      key={item.cartId}
                    >
                      <div>
                        <span>{item.title}</span>
                        <small>{item.brand}</small>
                      </div>
                      <strong>
                        {item.price === 0 ? "Free" : `Rs. ${item.price}`}
                      </strong>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.cartId)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <strong>Rs. {total}</strong>
                </div>
                {!user && (
                  <p className="checkout-note">
                    Sign in with Google to continue payment.
                  </p>
                )}
                <button
                  className="pay-button"
                  onClick={completePayment}
                  disabled={paying || !user}
                >
                  {paying
                    ? "Placing Order..."
                    : user
                      ? "Place Order"
                      : "Sign in to Pay"}
                </button>
              </>
            )}
          </section>
        )}

        {page === "offers" && (
          <section className="panel">
            <h2>Offers</h2>
            <div className="offer-grid">
              {offers.map((offer) => (
                <article className="offer-card" key={offer.id}>
                  <span>{offer.brand}</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <strong>Rs. {offer.price}</strong>
                  <small>Includes {offer.freeItem}</small>
                  <button onClick={() => addOffer(offer)}>Add Offer</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === "contact" && (
          <section className="panel">
            <h2>Contact</h2>
            <form className="contact-form">
              <input placeholder="Name" />
              <input placeholder="Email" />
              <textarea placeholder="Message" />
              <button type="button">Send Message</button>
            </form>
          </section>
        )}

        {page === "admin" && !adminUnlocked && (
          <section className="panel admin-login-panel">
            <form className="admin-login" onSubmit={unlockAdmin}>
              <h2>Admin Login</h2>
              <p>Enter password to view orders, products and sales tables.</p>
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
              />
              <button type="submit">Open Admin Panel</button>
            </form>
          </section>
        )}

        {page === "admin" && adminUnlocked && (
          <section className="panel admin-panel">
            <div className="admin-heading">
              <div>
                <h2>Admin Panel</h2>
                <p>MySQL data entry, orders, sold items and users.</p>
              </div>
              <div className="admin-actions">
                <button onClick={() => setAdminReload((value) => value + 1)}>
                  {adminLoading ? "Loading..." : "Refresh"}
                </button>
                <button
                  className="logout-admin"
                  onClick={() => {
                    setAdminUnlocked(false);
                    setAdminPassword("");
                  }}
                >
                  Lock
                </button>
              </div>
            </div>

            {adminData.summary && (
              <div className="summary-grid">
                <div>
                  <span>Total Orders</span>
                  <strong>{adminData.summary.totalOrders}</strong>
                </div>
                <div>
                  <span>Total Sales</span>
                  <strong>
                    Rs. {Number(adminData.summary.totalSales).toFixed(0)}
                  </strong>
                </div>
                <div>
                  <span>Items Sold</span>
                  <strong>{adminData.summary.soldItems}</strong>
                </div>
                <div>
                  <span>Users</span>
                  <strong>{adminData.summary.totalUsers}</strong>
                </div>
              </div>
            )}

            <h3>Products and Sold Data</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.title}</td>
                      <td>{product.brand}</td>
                      <td>Rs. {Number(product.price).toFixed(0)}</td>
                      <td>{product.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Orders</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.items || "No items"}</td>
                      <td>Rs. {Number(order.total).toFixed(0)}</td>
                      <td>{order.paymentMode}</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Users</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Provider</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.users.map((adminUser) => (
                    <tr key={adminUser.id}>
                      <td>{adminUser.id}</td>
                      <td>{adminUser.name}</td>
                      <td>{adminUser.email}</td>
                      <td>{adminUser.provider}</td>
                      <td>{new Date(adminUser.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
