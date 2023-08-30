// Getting references to DOM elements
const button = document.getElementById("button");
const mainList = document.getElementById("position");

// Function to display data
displayData();

async function displayData() {
  // Retrieve token from local storage
  const token = localStorage.getItem("token");
  try {
    // Fetch data from the server
    const response = await axios.get(
      "http://3.109.64.14:3000/premium/leaderboardList",
      {
        headers: { Authorization: token },
      }
    );

    // Iterate through the response data and create list items
    response.data.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("main_content_list", "bg-secondary");
      listItem.style.boxShadow = "10px 10px 10px rgba(0, 0, 0, 0.4)";
      listItem.innerHTML = `<div class="row d-flex justify-content-center align-items-center">
      <div class="col-2 col-sm-2">${item.idx}</div>
      <div class="col-4 col-sm-4">${item.username}</div>
      <div class="col-6 col-sm-6">${item.totalExpense}</div>
    </div>`;
      // Append the created list item to the main list
      position.appendChild(listItem);
    });
  } catch (error) {
    // Log any errors
    console.log(error);
  }
}
