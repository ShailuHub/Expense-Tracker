const toggleBtn = document.getElementById("toggle-btn");
const crossBtn = document.getElementById("cross-btn");
const toggleMenu = document.getElementById("toggle-menu");
const expenseLeaderBoard_lg = document.getElementById("expenseLeaderBoard-lg");
const expenseLeaderBoard_sm = document.getElementById("expenseLeaderBoard-sm");
const expenseHome_lg = document.getElementById("expenseHome-lg");
const expenseHome_sm = document.getElementById("expenseHome-sm");
const menuBtn = document.querySelectorAll(".nav-menu ul li a");
const premiumFeautures_lg = document.getElementById("premiumFeatures-lg");
const premiumFeautures_sm = document.getElementById("premiumFeatures-sm");
const mainContent = document.getElementById("main-content");
const logOut = document.getElementById("logOut");
// const expenseContent = document.getElementById("expense-content");

//Navigation bar controllers
expenseLeaderBoard_lg.addEventListener("click", showLeaderBoard);
expenseLeaderBoard_sm.addEventListener("click", showLeaderBoard);
premiumFeautures_lg.addEventListener("click", showPremiumFeautes);
premiumFeautures_sm.addEventListener("click", showPremiumFeautes);
expenseHome_sm.addEventListener("click", showHome);
expenseHome_lg.addEventListener("click", showHome);

logOut.addEventListener("click", () => {
  window.location.href = "/user/login";
});

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

async function showLeaderBoard(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/premium", {
      headers: { Authorization: token },
    });
    if (response.data.success === "success") {
      window.location.href = "/premium/leaderboard";
    } else {
      alert("Buy premium");
    }
  } catch (error) {
    console.log(error);
  }
}

async function showHome(event) {
  event.preventDefault();
  window.location.href = "/expense/addexpense";
}

async function showPremiumFeautes() {
  const token = localStorage.getItem("token");
  try {
    const getResponse = await axios.get("http://localhost:3000/premium", {
      headers: { Authorization: token },
    });
    if (getResponse.data.success === "success") {
      window.location.href = "/premium/features";
    } else {
      alert("You are not a preium user");
    }
  } catch (error) {
    console.log(error);
  }
}
