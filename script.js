const products = [
  {
    name: "Moline Mystery Hoodie",
    category: "APPAREL",
    price: "$49.99",
    emoji: "🧥"
  },
  {
    name: "Totally Official-ish Cap",
    category: "ACCESSORIES",
    price: "$24.99",
    emoji: "🧢"
  },
  {
    name: "School Spirit Backpack",
    category: "GEAR",
    price: "$59.99",
    emoji: "🎒"
  },
  {
    name: "Suspiciously Cool Sticker Pack",
    category: "STICKERS",
    price: "$7.99",
    emoji: "✨"
  },
  {
    name: "Hallway Speedrun Tee",
    category: "APPAREL",
    price: "$29.99",
    emoji: "👕"
  },
  {
    name: "Academic Weapon Mug",
    category: "DESK STUFF",
    price: "$14.99",
    emoji: "☕"
  },
  {
    name: "Emergency Pencil™",
    category: "SCHOOL STUFF",
    price: "$3.99",
    emoji: "✏️"
  },
  {
    name: "Limited Edition Nothing",
    category: "COLLECTIBLE",
    price: "$999.99",
    emoji: "📦"
  }
];

const productsContainer = document.getElementById("products");

productsContainer.innerHTML = products.map((product, index) => `
  <article class="product">

    <div class="product-art">
      ${product.emoji}
    </div>

    <div class="product-info">

      <div class="product-tag">
        ${product.category}
      </div>

      <h3>
        ${product.name}
      </h3>

      <div class="product-price">
        ${product.price}
        <span class="fake-price">
          REAL? NO.
        </span>
      </div>

      <button
        class="add-button"
        onclick="fakeAdd(${index})"
      >
        ADD TO CART
      </button>

    </div>

  </article>
`).join("");

let cartCount = 0;

function fakeAdd(index) {

  cartCount++;

  document.getElementById("cartCount").textContent =
    cartCount;

  showToast(
    `${products[index].name} added. Your imaginary cart is thriving.`
  );
}

function showCart() {

  showToast(
    "Checkout is disabled. This is an unofficial parody storefront."
  );
}

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
}

function redeemCode() {

  const input =
    document.getElementById("discountInput");

  const message =
    document.getElementById("codeMessage");

  const code =
    input.value.trim().toLowerCase();

  if (code === "ttts") {

    message.textContent =
      "Code accepted. Redirecting...";

    message.style.color = "#111";

    /*
      The hidden website is completely separate.

      Expected structure:

      /secret/
        index.html
        css/
        fonts/
        images/
        js/

      GitHub Pages serves the folder normally.
    */

    setTimeout(() => {
      window.location.href = "./secret/";
    }, 500);

    return;
  }

  message.textContent =
    "Invalid code. Humanity survives another coupon.";

  message.style.color = "#d21b52";
}

document
  .getElementById("discountInput")
  .addEventListener("keydown", event => {

    if (event.key === "Enter") {
      redeemCode();
    }

  });
