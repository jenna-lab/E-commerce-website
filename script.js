var apiUrl = "https://fakestoreapi.com/products";
function displaySingleProduct(product) {
    var productContainer = document.getElementById("product-container");
    if (!productContainer)
        return;
    productContainer.innerHTML = "";
    var productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = "\n    <img src=\"".concat(product.image, "\" alt=\"").concat(product.title, "\" />\n    <h3>").concat(product.title, "</h3>\n    <p>Category: ").concat(product.category, "</p>\n    <p>Price: $").concat(product.price, "</p>\n    <p>Description: ").concat(product.description, "</p>\n    <p>Rating: ").concat(product.rating.rate, " (").concat(product.rating.count, " reviews)</p>\n  ");
    productContainer.appendChild(productDiv);
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
        productDiv.innerHTML = "\n      <img src=\"".concat(product.image, "\" alt=\"").concat(product.title, "\" />\n      <h3>").concat(product.title, "</h3>\n      <p>Category: ").concat(product.category, "</p>\n      <p>Price: $").concat(product.price, "</p>\n    ");
        productDiv.addEventListener("click", function () { return displaySingleProduct(product); });
        productContainer.appendChild(productDiv);
    });
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
