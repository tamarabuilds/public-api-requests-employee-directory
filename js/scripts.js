/*************************************************************************************
 * Employee directory generated from random "employees" with Random User API data.
 * Treehouse Fullstack Javascript course unit 5 project
 * ***********************************************************************************
 */

// Variables for DOM manipulation
const gallery = document.querySelector('#gallery');
const search = document.querySelector('.search-container');
let modalContainer;
let closeButton;
let users = [];

/**
 * 'getUsers' will fetch data for 12 users from the Random User API.
 *  Only including users with English-speaking nationalities to enable search functionality.
 */
async function getUsers(){
    try{
        const response = await fetch(`https://randomuser.me/api/?results=12&nat=us,gb,nz,ie,au`);

        if(!response.ok) throw new Error(`Something went wrong`);
        users = await response.json();
        users = users.results
        displayUsers(users);
                                         //////////////////////////// Should I be using .then and .catch blocks or just try/catch so it mimicks more sychronous code?

    } catch(error){
        throw Error(`Error with getting users:`, error)
    }
};

/***
 * 'displayUsers' will create a card for each user displaying their photo, name, email and location.
 * 
 * @param {array} users - details for the random users with name, email, picture, and location.
 */
function displayUsers(users){
    // Clearing HTML before inserting users 
    gallery.innerHTML = '';

    users.map( user => {
        const div = document.createElement('div');
        gallery.appendChild(div);
        const html = `
            <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
            </div>
        `
        div.insertAdjacentHTML("afterbegin",html);
        console.log(user)
    })
};

/***
 * 'showSearch' enables the search bar to appear on the page.
 */
function showSearch(){
    const html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `
    search.insertAdjacentHTML('afterbegin', html);
};




/***
 * 'formatCell' formats mixed array of numbers & characters into (xxx) xxx-xxxx formatting.
 * if length of raw numbers is not 10, default formatting is [2 nums]-[2 nums]-[2 until end nums], xx-xx-xxx.
 *      For example, 123456, would format to: 12-34-56
 *      For example, 1234567890, would format to (123) 456-7890
 * 
 * Got help in capture groups from: https://javascript.info/regexp-groups.
 * 
 * @param {array} cellRaw - cell number with mix of numbers, spaces and characters such as (),-
 * @returns {string} formatted cell number 
 */
function formatCell(cellRaw){
    // To catch various input formatting
    cellRaw = Array(...cellRaw)
    let cellNums = cellRaw.filter( number => Number.isInteger(parseInt(number,10)))
    const regex = /^([0-9]{3})([0-9]{3})([0-9]{4})$/
    cellNums = cellNums.join('');
    if (regex.test(cellNums)){
        return (cellNums.replace(regex, `($1) $2-$3`))
    } else {
                    // CHALLENGE FOR LATER: Try to make this phone formatting more dynamic
                    // const group = Math.floor(nums.length/3);
                    // const regexGeneral = `/([0-9]{${group}})([0-9]{${group}})([0-9]{${group},})/`
        const regexGeneral = /^([0-9]{2})([0-9]{2})([0-9]{2,})$/
        return cellNums.replace(regexGeneral, `$1-$2-$3`)
    }
}

/**
 * 'formatBirthday' takes in standardized time and returns user's date of birth in MM/DD/YYYY format
 * 
 * @param {string} dateRaw - raw date in standardized time in string formatting
 * @returns {string} date of birth in MM/DD/YYYY format
 */
function formatBirthday(dateRaw){
    const date = new Date(dateRaw);
    const [month, day, year] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear(),
    ];
    return `${(month + 1 <= 9 ? '0'+ (month+1): (month+1))}/${day <= 9 ? '0' + day : day}/${year}`
};

/***
 * 'displayUserModal' provides details on the selected user on a modal
 * @param {object} user - user details to show additional infomation on their modal
 */
function displayUserModal(user){
    // formatting user cell into (xxx) xxx-xxxx or xx-xx-xxxxn
    const cellFormatted = formatCell(user.cell.split(''))
    // formatting user birthday into MM/DD/YYYY
    const birthdayformatted = formatBirthday(user.dob.date);
    const fullLocation = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`

    const html = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}, ${user.location.state}</p>
                    <hr>
                    <p class="modal-text">${cellFormatted}</p>
                    <p class="modal-text">${fullLocation}</p>
                    <p class="modal-text">Birthday: ${birthdayformatted}</p>
                </div>
            </div>
        </div>
    `
    console.log(user)                                                       /// REMOVE BEFORE SUBMISSION
    
    gallery.insertAdjacentHTML('afterend', html);
};

/**
 * 'closeModal' will close the modal overlay
 */
const closeModal = () => modalContainer.style.display = 'none';


/***
 * @event - Listens for selecting a card, updates modal with selected user details, calls display overlay
 */
gallery.addEventListener('click', (e)=> {
    const userCard = e.target.closest('.card');
    // ensuring only a card is selected, otherwise do nothing on the click event
    if (!userCard) return;

    // getting the user details for the selected card
    const name = userCard.querySelector('#name').innerText;
    const user = users.find( (user) => {
        const fullName = `${user.name.first} ${user.name.last}`;
        if (fullName === name) return user;
    });
    displayUserModal(user);
});

/**
 * @event - Listens for search and updates display cards real time
 */
search.addEventListener('keyup', (e)=> {
    const filteredList = [];
    const input = e.target.value.toLowerCase();

    users.forEach( user => {
        const fullName = user.name.first.toLowerCase() + user.name.last.toLowerCase();
        if (fullName.includes(input)) {
            filteredList.push(user);
        }

        if (filteredList.length > 0) {
            displayUsers(filteredList);
        } else {
            gallery.innerHTML = `<h2>Sorry, no results found</h2>`
        }
    });
});

/**
 * @event - listener will close the modal if user clicks on button-close
 */
document.addEventListener('click', (e)=> {
   const closeButton = e.target.closest('#modal-close-btn');
   if (closeButton) {
        modalContainer = document.querySelector('.modal-container');
        closeModal();
    }
});



/// CHALLENGE FOR LATER: closing outside of modal
//     const isModal = e.target.closest('.modal')
//     if (!isModal) {
    //        modalContainer = document.querySelector('.modal-container');
    //         closeModal();
    //    }
    // document.addEventListener('click', (e)=>{
    //     if (modalContainer){
    //         modalContainer.addEventListener('click', (e)=> {
    //             console.log(`here`)
    //         });
    
    //     }
    

// })






// Initalize page
getUsers();
showSearch();