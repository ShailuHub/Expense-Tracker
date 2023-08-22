const form = document.getElementById("form");
const email = document.getElementById("email");

form.addEventListener("submit", postEmail);

async function postEmail(event) {
  event.preventDefault();
  const detail = {
    email: email.value,
  };
  try {
    const postResponse = await axios.post(
      "http://localhost:3000/password/forgotPassword",
      detail
    );
    localStorage.setItem("userId", postResponse.data.userId);
    try {
      await axios.get("http://localhost:3000/pop-up");
      window.location.href = "/pop-up";
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
