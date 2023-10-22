document.addEventListener("DOMContentLoaded", function () {
  const apiUrl: string = "https://fakestoreapi.com/products";


  interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: { rate: number; count: number };
    count?: number;
  }

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

        const productCategoryElement =
          document.getElementById("productCategory");
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

  function displayAllProducts(products: Product[]): void {
    const productContainer = document.getElementById("product-container");
    if (!productContainer) return;

    productContainer.innerHTML = "";
    if (!products || products.length === 0) {
      productContainer.innerHTML = "No products to display.";
      return;
    }

    products.forEach((product) => {
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
  }

  const cartCountElement = document.getElementById("cart-count");

  let currentCart: Product[] = JSON.parse(
    localStorage.getItem("cartItems") || "[]"
  );

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
            item.id === json.id
              ? { ...item, count: (item.count || 1) + 1 }
              : item
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

  function displayCategory(category: string): void {
    fetch(apiUrl)
      .then((response: Response) => response.json())
      .then((data: Product[]) => {
        const filteredProducts = data.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
        displayAllProducts(filteredProducts);
      })
      .catch((error: any) => {
        console.error("Error fetching data:", error);
      });
  }



});
