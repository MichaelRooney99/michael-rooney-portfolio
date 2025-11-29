import React, { useState, useRef } from "react";
import "./kiosk.css";

const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    price: 8.99,
    category: "Burgers",
    emoji: "🍔",
    desc: "Beef patty, lettuce, tomato",
    customizable: true
  },
  {
    id: 2,
    name: "Bacon Deluxe",
    price: 10.99,
    category: "Burgers",
    emoji: "🥓",
    desc: "Bacon, cheese, special sauce",
    customizable: true
  },
  {
    id: 3,
    name: "Veggie Burger",
    price: 9.49,
    category: "Burgers",
    emoji: "🥬",
    desc: "Plant-based patty, avocado",
    customizable: true
  },
  {
    id: 4,
    name: "Crispy Fries",
    price: 3.99,
    category: "Sides",
    emoji: "🍟",
    desc: "Golden, crispy, salted",
    hasSize: true
  },
  {
    id: 5,
    name: "Onion Rings",
    price: 4.49,
    category: "Sides",
    emoji: "🧅",
    desc: "Beer-battered, crispy",
    hasSize: true
  },
  {
    id: 6,
    name: "Side Salad",
    price: 4.99,
    category: "Sides",
    emoji: "🥗",
    desc: "Fresh greens, vinaigrette"
  },
  {
    id: 7,
    name: "Cola",
    price: 2.49,
    category: "Drinks",
    emoji: "🥤",
    desc: "Refreshing classic",
    hasSize: true
  },
  {
    id: 8,
    name: "Lemonade",
    price: 2.99,
    category: "Drinks",
    emoji: "🍋",
    desc: "Fresh squeezed",
    hasSize: true
  },
  {
    id: 9,
    name: "Milkshake",
    price: 5.49,
    category: "Drinks",
    emoji: "🥛",
    desc: "Choose your flavor",
    hasFlavor: true
  },
  {
    id: 10,
    name: "Brownie",
    price: 3.99,
    category: "Desserts",
    emoji: "🍫",
    desc: "Warm, fudgy, delicious"
  },
  {
    id: 11,
    name: "Ice Cream",
    price: 4.49,
    category: "Desserts",
    emoji: "🍦",
    desc: "Two scoops",
    hasFlavor: true
  }
];

const toppings = [
  { id: "t1", name: "Extra Cheese", price: 1.0, emoji: "🧀" },
  { id: "t2", name: "Bacon", price: 1.5, emoji: "🥓" },
  { id: "t3", name: "Avocado", price: 1.5, emoji: "🥑" },
  { id: "t4", name: "Jalapeños", price: 0.75, emoji: "🌶️" },
  { id: "t5", name: "Fried Egg", price: 1.25, emoji: "🍳" },
  { id: "t6", name: "Mushrooms", price: 1.0, emoji: "🍄" }
];

const sizes = [
  { id: "s1", name: "Small", mult: 1 },
  { id: "s2", name: "Medium", mult: 1.4 },
  { id: "s3", name: "Large", mult: 1.8 }
];

const flavors = [
  { id: "f1", name: "Vanilla" },
  { id: "f2", name: "Chocolate" },
  { id: "f3", name: "Strawberry" }
];

const categories = ["All", "Burgers", "Sides", "Drinks", "Desserts"];

export default function KioskUI() {
  const [cart, setCart] = useState([]);
  const [activeCat, setActiveCat] = useState("All");
  const [screen, setScreen] = useState("menu");
  const [orderNum, setOrderNum] = useState(null);
  const [custItem, setCustItem] = useState(null);
  const [selToppings, setSelToppings] = useState([]);
  const [selSize, setSelSize] = useState("s2");
  const [selFlavor, setSelFlavor] = useState("f1");

  // stable id generator for cart items (avoid impure Date.now())
  const nextId = useRef(0);
  const getNextId = () => {
    nextId.current += 1;
    return `cart-${nextId.current}`;
  };

  const openCustomize = (item) => {
    setCustItem(item);
    setSelToppings([]);
    setSelSize("s2");
    setSelFlavor("f1");
    setScreen("customize");
  };

  const toggleTopping = (t) => {
    if (selToppings.find((x) => x.id === t.id)) {
      setSelToppings(selToppings.filter((x) => x.id !== t.id));
    } else {
      setSelToppings([...selToppings, t]);
    }
  };

  const addCustomized = () => {
    const tPrice = selToppings.reduce((s, t) => s + t.price, 0);
    const sMult = custItem.hasSize
      ? sizes.find((s) => s.id === selSize).mult
      : 1;
    const finalPrice = custItem.price * sMult + tPrice;
    const sizeName = custItem.hasSize
      ? sizes.find((s) => s.id === selSize).name
      : null;
    const flavorName = custItem.hasFlavor
      ? flavors.find((f) => f.id === selFlavor).name
      : null;

    const cartItem = {
      id: getNextId(),
      baseId: custItem.id,
      name: custItem.name,
      emoji: custItem.emoji,
      price: finalPrice,
      qty: 1,
      toppings: selToppings,
      size: sizeName,
      flavor: flavorName
    };

    setCart([...cart, cartItem]);
    setCustItem(null);
    setScreen("menu");
  };

  const addToCart = (item) => {
    if (item.customizable || item.hasSize || item.hasFlavor) {
      openCustomize(item);
    } else {
      const ex = cart.find(
        (c) =>
          c.baseId === item.id && !c.toppings?.length && !c.size && !c.flavor
      );
      if (ex) {
        setCart(
          cart.map((c) => (c.id === ex.id ? { ...c, qty: c.qty + 1 } : c))
        );
      } else {
        setCart([
          ...cart,
          {
            id: getNextId(),
            baseId: item.id,
            name: item.name,
            emoji: item.emoji,
            price: item.price,
            qty: 1,
            toppings: [],
            size: null,
            flavor: null
          }
        ]);
      }
    }
  };

  const removeFromCart = (id) => {
    const ex = cart.find((c) => c.id === id);
    if (ex.qty === 1) {
      setCart(cart.filter((c) => c.id !== id));
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c)));
    }
  };

  const incQty = (id) =>
    setCart(cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const filtered =
    activeCat === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === activeCat);

  const placeOrder = () => {
    setOrderNum(Math.floor(Math.random() * 900) + 100);
    setScreen("confirm");
    setCart([]);
  };

  const startOver = () => {
    setScreen("menu");
    setOrderNum(null);
  };

  // CUSTOMIZE SCREEN
  if (screen === "customize" && custItem) {
    const tPrice = selToppings.reduce((s, t) => s + t.price, 0);
    const sMult = custItem.hasSize
      ? sizes.find((s) => s.id === selSize).mult
      : 1;
    const curPrice = custItem.price * sMult + tPrice;

    return (
      <div className="kiosk-container" role="main">
        <a
          href="https://michaelrooney.dev"
          className="back-to-portfolio"
          aria-label="Back to Portfolio"
        >
          ← Portfolio
        </a>

        <div className="kiosk-content-narrow">
          <button
            onClick={() => setScreen("menu")}
            aria-label="Back to menu"
            className="btn-back"
          >
            ← Back
          </button>

          <div
            className="kiosk-header"
            role="region"
            aria-labelledby="customize-heading"
          >
            <div
              className="customize-icon"
              role="img"
              aria-label={`${custItem.emoji} ${custItem.name}`}
            >
              {custItem.emoji}
            </div>
            <h1 id="customize-heading" className="kiosk-title">
              Customize {custItem.name}
            </h1>
          </div>

          <div className="glass" style={{ padding: "1.5rem" }}>
            {custItem.hasSize && (
              <fieldset className="customize-section">
                <legend>Choose Size</legend>
                <div className="option-grid option-grid-3" role="radiogroup">
                  {sizes.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setSelSize(sz.id)}
                      role="radio"
                      aria-checked={selSize === sz.id}
                      aria-label={`${sz.name} size, $${(
                        custItem.price * sz.mult
                      ).toFixed(2)}`}
                      className={`option-btn ${
                        selSize === sz.id ? "selected" : ""
                      }`}
                    >
                      <div className="option-name">{sz.name}</div>
                      <div className="option-price">
                        ${(custItem.price * sz.mult).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {custItem.hasFlavor && (
              <fieldset className="customize-section">
                <legend>Choose Flavor</legend>
                <div className="option-grid option-grid-3" role="radiogroup">
                  {flavors.map((fl) => (
                    <button
                      key={fl.id}
                      onClick={() => setSelFlavor(fl.id)}
                      role="radio"
                      aria-checked={selFlavor === fl.id}
                      aria-label={`${fl.name} flavor`}
                      className={`option-btn ${
                        selFlavor === fl.id ? "selected" : ""
                      }`}
                    >
                      <div className="option-name">{fl.name}</div>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {custItem.customizable && (
              <fieldset className="customize-section">
                <legend>Add Toppings</legend>
                <div className="option-grid option-grid-auto" role="group">
                  {toppings.map((tp) => (
                    <button
                      key={tp.id}
                      onClick={() => toggleTopping(tp)}
                      role="checkbox"
                      aria-checked={!!selToppings.find((t) => t.id === tp.id)}
                      aria-label={`${tp.name}, add $${tp.price.toFixed(2)}`}
                      className={`option-btn ${
                        selToppings.find((t) => t.id === tp.id)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <div className="option-icon" aria-hidden="true">
                        {tp.emoji}
                      </div>
                      <div className="option-name">{tp.name}</div>
                      <div className="option-price">
                        +${tp.price.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="customize-total">
              <div>
                <div className="total-label">Total</div>
                <div className="total-value" aria-live="polite">
                  ${curPrice.toFixed(2)}
                </div>
              </div>
              <button
                onClick={addCustomized}
                aria-label={`Add to order, total $${curPrice.toFixed(2)}`}
                className="btn-gradient btn-add-to-order"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MENU SCREEN
  if (screen === "menu") {
    return (
      <div className="kiosk-container" role="main">
        <a
          href="https://michaelrooney.dev"
          className="back-to-portfolio"
          aria-label="Back to Portfolio"
        >
          ← Portfolio
        </a>

        <div className="kiosk-content">
          <div className="kiosk-header">
            <h1 className="kiosk-title">QuickBite Kiosk</h1>
            <p className="kiosk-subtitle">Tap items to add to your order</p>
          </div>

          <div className="category-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`category-btn ${activeCat === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="menu-card"
              >
                <div className="menu-icon">{item.emoji}</div>
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-desc">{item.desc}</div>
                <div className="menu-item-price">${item.price.toFixed(2)}</div>
                {(item.customizable || item.hasSize || item.hasFlavor) && (
                  <div className="customizable-badge">✨ Customizable</div>
                )}
              </div>
            ))}
          </div>

          {itemCount > 0 && (
            <div className="cart-bar">
              <div className="cart-info">
                <div className="cart-badge">{itemCount}</div>
                <div className="cart-details">
                  <div className="cart-label">Your Order</div>
                  <div className="cart-price">${subtotal.toFixed(2)}</div>
                </div>
              </div>
              <button
                onClick={() => setScreen("cart")}
                className="btn-gradient btn-view-cart"
              >
                View Cart →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CART SCREEN
  if (screen === "cart") {
    return (
      <div className="kiosk-container" role="main">
        <a
          href="https://michaelrooney.dev"
          className="back-to-portfolio"
          aria-label="Back to Portfolio"
        >
          ← Portfolio
        </a>

        <div className="kiosk-content-narrow">
          <button onClick={() => setScreen("menu")} className="btn-back">
            ← Back to Menu
          </button>

          <div className="kiosk-header">
            <h1 className="kiosk-title">Your Order</h1>
          </div>

          <div className="glass">
            {cart.length === 0 ? (
              <div className="empty-state">
                <div
                  className="empty-icon"
                  role="img"
                  aria-label="Empty cart icon"
                >
                  🛒
                </div>
                <p className="empty-text">Your cart is empty</p>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-left">
                      <span className="cart-item-icon">{item.emoji}</span>
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        {item.size && (
                          <div className="cart-item-options">
                            Size: {item.size}
                          </div>
                        )}
                        {item.flavor && (
                          <div className="cart-item-options">
                            Flavor: {item.flavor}
                          </div>
                        )}
                        {item.toppings?.length > 0 && (
                          <div className="cart-item-options">
                            + {item.toppings.map((t) => t.name).join(", ")}
                          </div>
                        )}
                        <div className="cart-item-unit-price">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        onClick={() => incQty(item.id)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <span className="item-total">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (7.5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="btn-gradient btn-success btn-place-order"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={clearCart}
                    className="btn-back btn-clear-cart"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CONFIRMATION SCREEN
  if (screen === "confirm") {
    return (
      <div
        className="kiosk-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        role="main"
      >
        <a
          href="https://michaelrooney.dev"
          className="back-to-portfolio"
          aria-label="Back to Portfolio"
        >
          ← Portfolio
        </a>

        <div className="glass confirmation-card">
          <div className="confirmation-icon">✅</div>
          <h1 className="confirmation-title">Order Placed!</h1>
          <p className="confirmation-subtitle">Your order number is:</p>
          <div className="order-number">#{orderNum}</div>
          <p className="confirmation-message">
            Your order will be ready shortly.
          </p>
          <button onClick={startOver} className="btn-gradient btn-new-order">
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  return null;
}
