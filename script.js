// Function to fetch data from the API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to update the navbar with fetched data
async function updateNavbar() {
  const apiUrl = "https://api.example.com/navbar"; // Replace with your API endpoint
  const navbarData = await fetchData(apiUrl);
  const storeName = document.getElementById("storeName");
  const navList = document.getElementById("navList");

  if (navbarData) {
    storeName.textContent = navbarData.storeName;
    navList.innerHTML = "";
    navbarData.navItems.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.link;
      a.textContent = item.title;
      li.appendChild(a);
      navList.appendChild(li);
    });
  }
}

// Call the function to update the navbar
updateNavbar();
