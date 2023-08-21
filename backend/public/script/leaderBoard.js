const button = document.getElementById("button");
const mainList = document.getElementById("position");
//button.addEventListener("click", displayData);

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
      listItem.classList.add("main_content_list");
      listItem.style.backgroundColor = " rgb(12, 5, 139)";
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
