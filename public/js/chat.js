const socket = io();


//options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    //new message element
    const newMessage = $message.lastElementChild;

    //new message style
    const newMessageStyle = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    //visible height 
    const visibleHeight = $message.offsetHeight;

    //container height
    const containerHeight = $message.scrollHeight;

    const scrollOffset = $message.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}


//messages Hundler
const $message = document.querySelector('.message_rend');

socket.on('message', (message) => {
    const html = Mustache.render(`
    <div class="message">
        <p>
            <span class="message__name">${message.username}</span>
            <span class="message__meta">${moment(message.createdAt).format("h:mm a")}</span>
        </p>
        <p>${message.text}</p>
    </div>
    `);
    $message.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

//Send Message Button Hundler
const sendBtn = document.querySelector(".submit");
const inputMes = document.querySelector(".message");
sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = inputMes.value;
    sendBtn.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', message, (error) => {
        sendBtn.removeAttribute('disabled');
        inputMes.value = '';
        inputMes.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message Deleivered!');
    })

})

//Send Location Button Hundler
const locationBtn = document.querySelector('.location_btn');

locationBtn.addEventListener('click', () => {
    locationBtn.setAttribute('disabled', 'disabled');

    if (!navigator.geolocation) {
        alert('GeoLocation is not supported by Your Broeswer!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);
        locationBtn.removeAttribute('disabled');
        socket.emit('sendLocation', {lat: position.coords.latitude, long: position.coords.longitude} , (message) => {
            //console.log(message)
        });
    })
    autoScroll();
})


socket.emit('join', {username, room}, (error) => {
    if (error) {
        location.href = '/'
        alert(error);
        
    }
});

//sideBar hundler
const roomName = document.querySelector('.room_name');
const roomUsers = document.querySelector('.room_users');

socket.on('roomData', ({ room, users }) => {
    roomName.textContent = room;
    roomUsers.innerHTML = '';
    users.forEach(user => {
        let html = `<p class="users">• ${user.username}</p>`;
        roomUsers.insertAdjacentHTML('beforeend', html);
    });
})