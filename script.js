var apiUrl = "https://fakestoreapi.com/products";
function displaySingleProduct(product) {
    var productContainer = document.getElementById("product-container");
    if (!productContainer)
        return;
    productContainer.innerHTML = "";
    fetch("product.html")
        .then(function (response) { return response.text(); })
        .then(function (html) {
        productContainer.innerHTML = html;
        var productTitleElements = document.querySelectorAll("#productTitle");
        productTitleElements.forEach(function (element) {
            element.innerHTML = product.title;
        });
        var productCategoryElement = document.getElementById("productCategory");
        if (productCategoryElement) {
            productCategoryElement.innerHTML = "Category: ".concat(product.category);
        }
        var productPriceElements = document.querySelectorAll("#productPrice");
        productPriceElements.forEach(function (element) {
            element.innerHTML = "$".concat(product.price);
        });
        var productDescriptionElements = document.querySelectorAll("#productDescription");
        productDescriptionElements.forEach(function (element) {
            element.innerHTML = product.description;
        });
        var productRatingElement = document.getElementById("productRating");
        if (productRatingElement) {
            productRatingElement.innerText = "".concat(product.rating.rate, " (").concat(product.rating.count, " reviews)");
        }
        var productImageElements = document.querySelectorAll("#productImage");
        productImageElements.forEach(function (element) {
            element.setAttribute("src", product.image);
            element.setAttribute("alt", product.title);
        });
    })
        .catch(function (error) {
        console.error("Error fetching product.html:", error);
    });
}
function displayAllProducts(products) {
    var productContainer = document.getElementById("product-container");
    if (!productContainer)
        return;
    productContainer.innerHTML = "";
    if (!products || products.length === 0) {
        productContainer.innerHTML = "No products to display.";
        return;
    }
    products.forEach(function (product) {
        var productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = "\n      <img src=\"".concat(product.image, "\" alt=\"").concat(product.title, "\" />\n      <h3>").concat(product.title, "</h3>\n      <p>Category: ").concat(product.category, "</p>\n      <p>Price: $").concat(product.price, "</p>\n      <button onclick=\"addToCart(").concat(product.id, ")\">Add to Cart</button>\n\n    ");
        var addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.addEventListener("click", function () { return addToCart(product.id); });
        productDiv.addEventListener("click", function () { return displaySingleProduct(product); });
        productContainer.appendChild(productDiv);
    });
}
function addToCart(productId) {
    console.log("Product with ID ".concat(productId, " added to the cart."));
}
function viewMore(description, rating, count) {
    var modal = document.createElement("div");
    modal.classList.add("modal");
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.innerHTML = "\n    <span class=\"close-button\" onclick=\"closeModal()\">&times;</span>\n    <p>Description: ".concat(description, "</p>\n    <p>Rating: ").concat(rating, " (").concat(count, " reviews)</p>\n  ");
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}
function closeModal() {
    var modal = document.querySelector(".modal");
    if (modal) {
        modal.remove();
    }
}
var categories = [];
function extractCategories(products) {
    var categories = [];
    products.forEach(function (product) {
        if (categories.indexOf(product.category) === -1) {
            categories.push(product.category);
        }
    });
    return categories;
}
function displayCategory(categories, selectedCategory) {
    var navUl = document.getElementById("nav-ul");
    if (navUl) {
        var ul_1 = navUl.querySelector("ul");
        if (ul_1) {
            categories.forEach(function (category) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = "javascript:void(0)";
                a.onclick = function () { return displayCategory(categories, category); };
                a.textContent = category;
                li.appendChild(a);
                ul_1.appendChild(li);
            });
        }
    }
}
fetch(apiUrl)
    .then(function (response) { return response.json(); })
    .then(function (data) {
    var categories = extractCategories(data);
    displayCategory(categories, ""); // Initially, no category is selected
    displayAllProducts(data);
})
    .catch(function (error) {
    console.error("Error fetching data:", error);
});
