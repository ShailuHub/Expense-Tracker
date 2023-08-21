const form = document.getElementById("form");
const email = document.getElementById("email");

form.addEventListener("submit", postEmail);

async function postEmail(event) {
  event.preventDefault();
  const detail = {
    email: email.value,
  };
  try {
    await axios.post("http://localhost:3000/password/forgotPassword", detail);
    console.log("posted");
  } catch (error) {
    console.log(error);
  }
}
