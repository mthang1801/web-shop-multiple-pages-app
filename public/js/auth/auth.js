// const name = document.querySelector("[name=name]");
// const email = document.querySelector("[name=email]");
// const password = document.querySelector("[name=password]");
// const confirmPassword = document.querySelector("[name=confirmPassword]");

function createEffectInputElement(element) {
  if (element.value) {
    element.parentNode.querySelector("label").classList.add("shrinkLabel");
  } else {
    element.parentNode.querySelector("label").classList.remove("shrinkLabel");
  }
}

// if (name) {
//   name.addEventListener("keyup", () => {
//     createEffectInputElement(name);
//   });
//   name.addEventListener("blur", () => {
//     createEffectInputElement(name);
//   });
// }

// if (email) {
//   email.addEventListener("keyup", () => {
//     createEffectInputElement(email);
//   });
//   email.addEventListener("blur", () => {
//     createEffectInputElement(email);
//   });
// }

// if (password) {
//   password.addEventListener("keyup", () => {
//     createEffectInputElement(password);
//   });
//   password.addEventListener("blur", () => {
//     createEffectInputElement(password);
//   });
// }

// if (confirmPassword) {
//   confirmPassword.addEventListener("keyup", () => {
//     createEffectInputElement(confirmPassword);
//   });
//   confirmPassword.addEventListener("blur", () => {
//     createEffectInputElement(confirmPassword);
//   });
// }
function toggleShrinkLabel(inputName) {
  $(`input[name=${inputName}]`).on("keyup", function () {
    if ($(this).val()) {
      $(this).parent().find("label").addClass("shrinkLabel");
    } else {
      $(this).parent().find("label").removeClass("shrinkLabel");
    }
  });
}
$(document).ready(function () {
  toggleShrinkLabel("name");
  toggleShrinkLabel("email");
  toggleShrinkLabel("password");
  toggleShrinkLabel("confirmPassword");
});
