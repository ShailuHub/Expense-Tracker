const messageItem = document.getElementById("content-item");
const okBtn = document.getElementById("ok-btn");
console.log(okBtn);

showMessage();
okBtn.addEventListener("click", takeMeTo);

async function showMessage() {
  try {
    const getResponse = await axios.get(
      `http://localhost:3000/pop-up/resetMsg`
    );
    console.log(getResponse.data);
    await display(getResponse.data);
  } catch (error) {
    console.log(error);
  }
}

async function display(data) {
  const item = document.createElement("div");
  item.innerHTML = `
  <h2>${data.heading}</h2>
  <p>${data.message}</p>
  `;
  messageItem.appendChild(item);
}

function takeMeTo(event) {
  event.preventDefault();
  window.location.href = "/user/login";
}
