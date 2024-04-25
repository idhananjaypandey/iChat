const socket = io('http://localhost:8000');

const form = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container");
const audio = new Audio('ting.mp3');

// Append message to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);
    if (position === 'left') {
        audio.play();
    }
}

// Handle form submission (sending messages)
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting and reloading the page
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = ''; // Clear the input field
    }
});

// Ask the user for their name to join the chat
const userName = prompt("Enter your name to join the chat");
if (userName) {
    socket.emit('new-user-joined', userName);
}

// Listen for user-joined event
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'left');
});

// Listen for received messages
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Listen for user-left event
socket.on('left', (name) => {
    append(`${name} left the chat`, 'left');
});
