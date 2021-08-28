// API URL
const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = `${BASE_URL}/api/v1/users/`
const SHOW_URL = `${BASE_URL}/api/v1/users/`

const ITEMS_PER_PAGE = 18
const FIRST_PAGE = 1

// Data
const friends = []
let curPage = FIRST_PAGE

// DOM Element
const dataPanel = document.querySelector("#data-panel")
const paginator = document.querySelector("#paginator")
function requestFriends() {
  axios
    .get(INDEX_URL)
    .then((response) => {
      friends.push(...response.data.results)
      renderPaginator(friends.length)
      renderFriendList(getFriendsByPage(1))
    })
    .catch((err) => console.log(err))
}

function renderFriendList(data) {
  let rawHTML = ""
  data.forEach((item, i) => {
    let fadeInAnim = ` 
      opacity: 0;
      animation: fadeIn 0.5s linear;
      animation-delay: ${0.06 * i}s;
      animation-fill-mode: forwards;`

    let nameColor = item.gender === "male" ? "text-primary" : "text-danger"
    let genderIcon = item.gender === "male" ? "fas fa-male" : "fas fa-female"
    rawHTML += `
      <div class="shadow card m-2" style="width: 10rem; ${fadeInAnim}">
        <img class="card-img-top rounded friendAvatar" src=${item.avatar} alt="Card image cap " data-id="${item.id}"
          data-toggle="modal" data-target="#friendProfile">
        <div class="card-body">
          <p class="card-text ${nameColor}"><i class="${genderIcon} mr-2"></i>${item.name}.</p>
        </div>
      </div>
      `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / ITEMS_PER_PAGE)
  let rawHTML = ""

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".friendAvatar")) {
    showFriendModal(event.target.dataset.id)
  }
})

dataPanel.addEventListener("animationend", (event) => {
  if (event.target.matches("#data-panel")) {
    if (event.animationName === "fadeOut") {
      renderFriendList(getFriendsByPage(curPage))
      dataPanel.classList.remove("fadeOut")
    }
  }
})

// listen to paginator
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return

  curPage = Number(event.target.dataset.page)
  dataPanel.classList.add("fadeOut")
})

function showFriendModal(id) {
  console.log(Number(id))
  // get elements
  const modalAvatar = document.querySelector("#modal-profile-avatar")
  const modalProfileWrapper = document.querySelector("#modal-profile-wrapper")
  const modalName = document.querySelector("#modal-profile-name")
  const modalEmail = document.querySelector("#modal-profile-email")
  const modalGender = document.querySelector("#modal-profile-gender")
  const modalAge = document.querySelector("#modal-profile-age")
  const modalRegion = document.querySelector("#modal-profile-region")
  const modalBirthday = document.querySelector("#modal-profile-birthday")
  modalProfileWrapper.classList.add("invisible")

  // send request to show api
  axios.get(SHOW_URL + id).then((response) => {
    console.log(response.data)
    const data = response.data

    // insert data into modal ui
    modalAvatar.src = data.avatar
    modalName.innerText = `${data.name} ${data.surname}`
    modalEmail.innerText = data.email
    modalGender.innerText = data.gender
    modalAge.innerText = data.age
    modalRegion.innerText = data.region
    modalBirthday.innerText = data.birthday
    modalProfileWrapper.classList.remove("invisible")
  })
}

function getFriendsByPage(page) {
  const data = friends
  const startIndex = (page - 1) * ITEMS_PER_PAGE

  return data.slice(startIndex, startIndex + ITEMS_PER_PAGE)
}

requestFriends()
