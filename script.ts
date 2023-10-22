const apiUrl: string = "https://fakestoreapi.com/products";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
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

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>

    `;
     const addToCartButton = document.createElement("button");
     addToCartButton.textContent = "Add to Cart";
     addToCartButton.addEventListener("click", () => addToCart(product.id));

    productDiv.addEventListener("click", () => displaySingleProduct(product));

    productContainer.appendChild(productDiv);
  });
}
function addToCart(productId: number): void {
  console.log(`Product with ID ${productId} added to the cart.`);
}


function viewMore(description: string, rating: number, count: number): void {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  modalContent.innerHTML = `
    <span class="close-button" onclick="closeModal()">&times;</span>
    <p>Description: ${description}</p>
    <p>Rating: ${rating} (${count} reviews)</p>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.remove();
  }
}
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

function displayCategory(categories: string[], selectedCategory: string): void {
  const navUl = document.getElementById("nav-ul");
  if (navUl) {
    const ul = navUl.querySelector("ul");
    if (ul) {
      categories.forEach((category) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "javascript:void(0)";
        a.onclick = () => displayCategory(categories, category);
        a.textContent = category;
        li.appendChild(a);
        ul.appendChild(li);
      });
    }
  }
}

fetch(apiUrl)
  .then((response: Response) => response.json())
  .then((data: Product[]) => {
    const categories = extractCategories(data);
    displayCategory(categories, ""); // Initially, no category is selected
    displayAllProducts(data);
  })
  .catch((error: any) => {
    console.error("Error fetching data:", error);
  });