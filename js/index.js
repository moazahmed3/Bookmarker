var inputNameSite = document.getElementById("inputNameSite");
var inputUrlSite = document.getElementById("inputUrlSite");
var tableBody = document.getElementById("tableBody");

var RegExpNameSite = /^[A-Z][A-Za-z0-9 ]{2,}$/;
var RegExpUrlSite =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

var sitesArr = [];

if (localStorage.getItem("sitesArr") != null) {
  sitesArr = JSON.parse(localStorage.getItem("sitesArr"));
  displaySite();
}

function isValidInput(name, site) {
  return RegExpNameSite.test(name) && RegExpUrlSite.test(site);
}

function validNameSite() {
  if (RegExpNameSite.test(inputNameSite.value)) {
    inputNameSite.classList.add("is-valid");
    inputNameSite.classList.remove("is-invalid");
  } else {
    inputNameSite.classList.remove("is-valid");
    inputNameSite.classList.add("is-invalid");
  }
}
function validUlrSite() {
  if (RegExpUrlSite.test(inputUrlSite.value)) {
    inputUrlSite.classList.add("is-valid");
    inputUrlSite.classList.remove("is-invalid");
  } else {
    inputUrlSite.classList.remove("is-valid");
    inputUrlSite.classList.add("is-invalid");
  }
}
function addSite() {
  if (isValidInput(inputNameSite.value, inputUrlSite.value)) {
    var site = {
      nameSite: inputNameSite.value,
      urlSite: inputUrlSite.value,
    };
    sitesArr.push(site);
    localStorage.setItem("sitesArr", JSON.stringify(sitesArr));
    displaySite();
    clearInput();
    ClearValidation();
  } else {
    Swal.fire({
      title: `<h1 class="text-danger">Error validation</h1>`,
      html: `
          <ul class="list-unstyled text-start mt-3">
            <li class="mb-3 d-flex align-items-center">
              <i class="fa-solid fa-circle-right me-2 text-danger"></i>
              <span class="d-block text-dark fw-bolder">Site name must start with a capital letter and be at least 3 characters long.</span>
            </li>
            <li class="mb-3 d-flex align-items-center">
              <i class="fa-solid fa-circle-right me-2 text-danger"></i>
              <span class="d-block text-dark fw-bolder">Site URL must be valid. Example: https://example.com</span>
            </li>
          </ul>
        `,
      icon: "error",
    });
  }
}

function formatURL(url) {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

function displaySite() {
  var trs = "";
  for (var i = 0; i < sitesArr.length; i++) {
    trs += `
        <tr>
          <td>${i + 1}</td>
          <td>${sitesArr[i].nameSite}</td>
          <td>
            <a href="${formatURL(
              sitesArr[i].urlSite
            )}" target="_blank" class="btn btn-warning text-white">
              <i class="fa-solid fa-eye pe-2"></i>
              Visit
            </a>
          </td>
          <td>
            <button class="btn btn-danger" onClick="showDialogDelete(${i})">
              <i class="fa-solid fa-trash pe-2"></i>
              Delete
            </button>
          </td>
        </tr>
      `;
  }
  tableBody.innerHTML = trs;
}

function clearInput() {
  inputNameSite.value = "";
  inputUrlSite.value = "";
}

function ClearValidation() {
  console.log("done");

  inputNameSite.classList.remove("is-invalid");
  inputNameSite.classList.remove("is-valid");
  inputUrlSite.classList.remove("is-invalid");
  inputUrlSite.classList.remove("is-valid");
}

function deleteSite(indexSite) {
  sitesArr.splice(indexSite, 1);
  localStorage.setItem("sitesArr", JSON.stringify(sitesArr));
  displaySite();
}

function showDialogDelete(indexSite) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mx-2",
      cancelButton: "btn btn-danger mx-2",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        deleteSite(indexSite);
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your Site has been deleted.",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary Site is safe :)",
          icon: "error",
        });
      }
    });
}
