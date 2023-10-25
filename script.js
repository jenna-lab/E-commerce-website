var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var apiUrl = "https://fakestoreapi.com/products";
fetch(apiUrl)
    .then(function (response) { return response.json(); })
    .then(function (data) {
    var categories = extractCategories(data);
    // displayCategory(categories, "");
    displayAllProducts();
})
    .catch(function (error) {
    console.error("Error fetching data:", error);
});
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
function displayAllProducts() {
    var apiUrl = "https://fakestoreapi.com/products";
    fetch(apiUrl)
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        var products = data;
        console.log("products are ", products);
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
            productPrice.textContent = "Price: $".concat(product.price);
            var addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener("click", function () { return addToCart(product.id); });
            productDiv.appendChild(productImage);
            productDiv.appendChild(productTitle);
            productDiv.appendChild(productCategory);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(addToCartButton);
            productContainer.appendChild(productDiv);
        });
    });
}
var cartCountElement = document.getElementById("cart-count");
var currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
var addToCart = function (product_id) {
    console.log(product_id);
    var CATEGORY_PRODUCT_API = "https://fakestoreapi.com/products/".concat(product_id);
    fetch(CATEGORY_PRODUCT_API)
        .then(function (response) { return response.json(); })
        .then(function (json) {
        var found = false;
        for (var i = 0; i < currentCart.length; i++) {
            if (currentCart[i].id === json.id) {
                found = true;
                break;
            }
        }
        if (found) {
            currentCart = currentCart.map(function (item) {
                return item.id === json.id ? __assign(__assign({}, item), { count: (item.count || 1) + 1 }) : item;
            });
        }
        else {
            currentCart.push(__assign(__assign({}, json), { count: 1 }));
        }
        localStorage.setItem("cartItems", JSON.stringify(currentCart));
        console.log("Updated cart items:", currentCart);
        updateCartCount(currentCart.length);
    });
};
var updateCartCount = function (count) {
    if (cartCountElement) {
        cartCountElement.innerText = count.toString();
    }
};
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
function displayCategoryProducts(category) {
    var apiUrl = "https://fakestoreapi.com/products/category/".concat(category);
    fetch(apiUrl)
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        var products = data;
        console.log("products are ", products);
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
            productPrice.textContent = "Price: $\"".concat(product.price);
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
function displayCategory(category) {
    fetch(apiUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var filteredProducts = data.filter(function (product) { return product.category.toLowerCase() === category.toLowerCase(); });
        displayAllProducts();
    })
        .catch(function (error) {
        console.error("Error fetching data:", error);
    });
}
var displayCart = function () {
    var productContainer = document.getElementById("product-container");
    var cartContainer = document.getElementById("cart-container");
    if (productContainer && cartContainer) {
        fetch("./cart.html")
            .then(function (response) { return response.text(); })
            .then(function (html) {
            productContainer.innerHTML = html;
        })
            .catch(function (error) {
            console.error("Error fetching cart.html:", error);
        });
    }
};
var cartContainer = document.getElementById("cart-container");
if (cartContainer) {
    cartContainer.addEventListener("click", displayCart);
}
var my_table = document.querySelector(".my-table");
my_table.style.border = "5px solid red";
var my_cart = localStorage.getItem("cartItems") || "[]";
var cartItems = JSON.parse(my_cart);
cartItems.forEach(function (element) {
    // console.log(element);
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var img = document.createElement("img");
    img.setAttribute("src", element.image);
    img.setAttribute("alt", element.title);
    td.appendChild(img);
    tr.appendChild(td);
    // console.log(img)
    var tdTitle = document.createElement("td");
    var titleText = document.createTextNode(element.title);
    tdTitle.appendChild(titleText);
    tr.appendChild(tdTitle);
    // console.log(tdTitle);
    var tdPrice = document.createElement("td");
    var priceText = document.createTextNode("$".concat(element.price));
    tdPrice.appendChild(priceText);
    tr.appendChild(tdPrice);
    console.log(tdPrice);
    if (my_table) {
        my_table.appendChild(tr);
        console.log(my_table);
    }
    else {
        console.log("my_table is not defined");
    }
});
if (my_table) {
    console.log(my_table);
}
console.log("cart items i sof type ", typeof cartItems);
