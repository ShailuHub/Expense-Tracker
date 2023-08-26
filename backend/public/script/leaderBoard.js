const button = document.getElementById("button");
const mainList = document.getElementById("position");

displayData();

async function displayData() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/leaderboardList",
      {
        headers: { Authorization: token },
      }
    );

    response.data.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("main_content_list", "bg-secondary");
      listItem.style.boxShadow = "10px 10px 10px rgba(0, 0, 0, 0.4)";
      listItem.innerHTML = `<div class="row d-flex justify-content-center align-items-center">
      <div class="col-4">${item.idx}</div>
      <div class="col-4">${item.username}</div>
      <div class="col-4">${item.totalExpense}</div>
    </div>`;
      position.appendChild(listItem);
    });
  } catch (error) {
    console.log(error);
  }
}
