const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");
const form = document.getElementById("form");

form.addEventListener("submit", postResetPassword);

async function postResetPassword(event) {
  const userId = localStorage.getItem("userId");
  console.log(userId);
  event.preventDefault();
  const details = {
    password: password.value,
    confirmPassword: confirmPassword.value,
  };
  try {
    const response = await axios.post(
      `http://localhost:3000/password/resetpassword/${userId}`,
      details
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
