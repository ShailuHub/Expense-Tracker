const leaderBoard = document.getElementById("leaderBoard");

leaderBoard.addEventListener("click", showLeaderBoard);

async function showLeaderBoard() {
  try {
    window.location.href = this.getAttribute("href");
  } catch (error) {
    console.log(error);
  }
}
