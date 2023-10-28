const apiUrl: string = "https://fakestoreapi.com/products";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
  count: number;
  quantity: number;
}

fetch(apiUrl)
  .then((response: Response) => response.json())
  .then((data: Product[]) => {
    const categories = extractCategories(data);
    // displayCategory(categories, "");
    displayAllProducts();
  })
  .catch((error: any) => {
    console.error("Error fetching data:", error);
  });

function displaySingleProduct(product: Product): void {
  const productContainer = document.getElementById("product-container");
  if (!productContainer) return;

  productContainer.innerHTML = "";

  fetch("product.html")
    .then((response) => response.text())
    .then((html) => {
      productContainer.innerHTML = html;

      const productTitleElements = document.querySelectorAll("#productTitle");
      productTitleElements.forEach((element) => {
        element.innerHTML = product.title;
      });

      const productCategoryElement = document.getElementById("productCategory");
      if (productCategoryElement) {
        productCategoryElement.innerHTML = `Category: ${product.category}`;
      }

      const productPriceElements = document.querySelectorAll("#productPrice");
      productPriceElements.forEach((element) => {
        element.innerHTML = `$${product.price}`;
      });

      const productDescriptionElements = document.querySelectorAll(
        "#productDescription"
      );
      productDescriptionElements.forEach((element) => {
        element.innerHTML = product.description;
      });

      const productRatingElement = document.getElementById("productRating");
      if (productRatingElement) {
        productRatingElement.innerText = `${product.rating.rate} (${product.rating.count} reviews)`;
      }

      const productImageElements = document.querySelectorAll("#productImage");
      productImageElements.forEach((element) => {
        element.setAttribute("src", product.image);
        element.setAttribute("alt", product.title);
      });
    })
    .catch((error) => {
      console.error("Error fetching product.html:", error);
    });
}

let currentCart: Product[] = JSON.parse(
  localStorage.getItem("cartItems") || "[]"
);

function displayAllProducts(): void {
  var apiUrl = `https://fakestoreapi.com/products`;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const products = data;

      console.log("products are ", products);

      const productContainer = document.getElementById("product-container");
      if (!productContainer) return;

      productContainer.innerHTML = "";
      if (!products || products.length === 0) {
        productContainer.innerHTML = "No products to display.";
        return;
      }
      updateCartCount(currentCart.length);
      products.forEach((product: Product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.title;

        productImage.addEventListener("click", () =>
          displaySingleProduct(product)
        );

        const productTitle = document.createElement("h3");
        productTitle.textContent = product.title;

        const productCategory = document.createElement("p");
        productCategory.textContent = `Category: ${product.category}`;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Price: $${product.price}`;

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.addEventListener("click", () => addToCart(product.id));

        productDiv.appendChild(productImage);
        productDiv.appendChild(productTitle);
        productDiv.appendChild(productCategory);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(addToCartButton);

        productContainer.appendChild(productDiv);
      });
    });
}

const cartCountElement = document.getElementById("cart-count");

const addToCart = (product_id: number) => {
  console.log(product_id);

  const CATEGORY_PRODUCT_API = `https://fakestoreapi.com/products/${product_id}`;

  fetch(CATEGORY_PRODUCT_API)
    .then((response) => response.json())
    .then((json: Product) => {
      let found = false;
      for (let i = 0; i < currentCart.length; i++) {
        if (currentCart[i].id === json.id) {
          found = true;
          break;
        }
      }

      if (found) {
        currentCart = currentCart.map((item) =>
          item.id === json.id ? { ...item, count: (item.count || 1) + 1 } : item
        );
      } else {
        currentCart.push({ ...json, count: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(currentCart));

      console.log("Updated cart items:", currentCart);
      updateCartCount(currentCart.length);
    });
};

const updateCartCount = (count: number) => {
  if (cartCountElement) {
    cartCountElement.innerText = count.toString();
  }
};

let categories: string[] = [];

function extractCategories(products: Product[]): string[] {
  const categories: string[] = [];
  products.forEach((product) => {
    if (categories.indexOf(product.category) === -1) {
      categories.push(product.category);
    }
  });
  return categories;
}

function displayCategoryProducts(category: string) {
  var apiUrl = `https://fakestoreapi.com/products/category/${category}`;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const products = data;
      console.log("products are ", products);
      var productContainer = document.getElementById("product-container");
      if (!productContainer) return;
      productContainer.innerHTML = "";
      if (!products || products.length === 0) {
        productContainer.innerHTML = "No products to display.";
        return;
      }
      products.forEach(function (product: Product) {
        var productDiv = document.createElement("div");
        productDiv.classList.add("product");
        var productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.title;
        productImage.addEventListener("click", function () {
          return displaySingleProduct(product);
        });
        var productTitle = document.createElement("h3");
        productTitle.textContent = product.title;
        var productCategory = document.createElement("p");
        productCategory.textContent = "Category: ".concat(product.category);
        var productPrice = document.createElement("p");
        productPrice.textContent = `Price: $"${product.price}`;
        var addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.addEventListener("click", function () {
          return addToCart(product.id);
        });
        productDiv.appendChild(productImage);
        productDiv.appendChild(productTitle);
        productDiv.appendChild(productCategory);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(addToCartButton);
        if (productContainer) {
          productContainer.appendChild(productDiv);
        }
      });
    });
}

function displayCategory(category: string): void {
  fetch(apiUrl)
    .then((response: Response) => response.json())
    .then((data: Product[]) => {
      const filteredProducts = data.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      displayAllProducts();
    })
    .catch((error: any) => {
      console.error("Error fetching data:", error);
    });
}

const displayCart = () => {
  const productContainer = document.getElementById("product-container");
  const cartContainer = document.getElementById("cart-container");
  if (productContainer && cartContainer) {
    fetch("./cart.html")
      .then((response) => response.text())
      .then((html) => {
        productContainer.innerHTML = html;
      })
      .catch((error) => {
        console.error("Error fetching cart.html:", error);
      });
  }
};

const cartContainer = document.getElementById("cart-container") as HTMLElement;
if (cartContainer) {
  cartContainer.addEventListener("click", displayCart);
}
const my_table = document.querySelector("tbody") as HTMLElement;
const my_cart = localStorage.getItem("cartItems") || "[]";
const cartItems: Product[] = JSON.parse(my_cart);

let totalPrice = 0;

cartItems.forEach((element: Product) => {
  const tr = document.createElement("tr");
  const tdProduct = document.createElement("td");

  const divImage = document.createElement("div");
  const productImage = document.createElement("img");
  productImage.src = element.image;
  productImage.alt = element.title;
  divImage.appendChild(productImage);

  const divTitle = document.createElement("div");
  const titleText = document.createTextNode(element.title);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";

  divTitle.appendChild(titleText);

  tdProduct.appendChild(divImage);
  tdProduct.appendChild(divTitle);
  tdProduct.appendChild(removeButton);

  removeButton.addEventListener("click", () => {
    // const index = cartItems.findIndex((item) => item.id === element.id);
    const index = cartItems.indexOf(element);
    if (index > -1) {
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      tr.remove();
    }
  });

  tr.appendChild(tdProduct);

  const tdQty = document.createElement("td");

  const minusButton = document.createElement("button");
  minusButton.innerText = "-";
  minusButton.addEventListener("click", () => {
    if (element.count > 0) {
      element.count--;
      qtyText.nodeValue = `${element.count}`;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  });

  const qtyText = document.createTextNode(`${element.count}`);
  tdQty.appendChild(minusButton);
  tdQty.appendChild(qtyText);

  const plusButton = document.createElement("button");
  plusButton.textContent = "+";
  plusButton.addEventListener("click", () => {
    element.count++;
    qtyText.nodeValue = `${element.count}`;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  });
  tdQty.appendChild(plusButton);

  tr.appendChild(tdQty);

  

 totalPrice += element.price * element.count;

  my_table.appendChild(tr);
//  console.log(totalPrice);


});

const totalPriceText = document.createTextNode(`Total: $${totalPrice}`);
const totalPriceElement = document.getElementById("total") as HTMLElement;
if (totalPriceElement) {
  totalPriceElement.appendChild(totalPriceText);
}




