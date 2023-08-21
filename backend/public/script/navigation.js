const toggleBtn = document.getElementById("toggle-btn");
const crossBtn = document.getElementById("cross-btn");
const toggleMenu = document.getElementById("toggle-menu");
const expenseLeaderBoard_lg = document.getElementById("expenseLeaderBoard-lg");
const expenseLeaderBoard_sm = document.getElementById("expenseLeaderBoard-sm");
const expenseHome_lg = document.getElementById("expenseHome-lg");
const expenseHome_sm = document.getElementById("expenseHome-sm");
// const expenseContent = document.getElementById("expense-content");

//Navigation bar controllers
expenseLeaderBoard_lg.addEventListener("click", showLeaderBoard);
expenseLeaderBoard_sm.addEventListener("click", showLeaderBoard);
expenseHome_lg.addEventListener("click", showHome);
// expenseHome_sm.addEventListener("click", showHome);

toggleBtn.addEventListener("click", () => {
  toggleBtn.style.display = "none";
  crossBtn.style.display = "block";
  toggleMenu.style.display = "block";
});

crossBtn.addEventListener("click", () => {
  toggleBtn.style.display = "block";
  crossBtn.style.display = "none";
  toggleMenu.style.display = "none";
});

async function showLeaderBoard(event, navigationCallback) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/premium", {
      headers: { Authorization: token },
    });

    if (response.data.success === "success") {
      console.log("Hello");
      window.location.href = "/premium/leaderboard";
    } else {
      console.log("Not authorized");
    }
  } catch (error) {
    console.log(error);
  }
}

async function showHome(event) {
  event.preventDefault();
  window.location.href = "/expense/addexpense";
}
