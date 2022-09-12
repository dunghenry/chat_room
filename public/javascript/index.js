const socket = io("http://localhost:4000");
const btn = document.getElementById("btn");
const room = document.getElementById("room");
const list_room = document.getElementById("rooms");
const current_room = document.getElementById("current-room");
const chatMsg = document.getElementById("chatMsg");
const btnSend = document.getElementById("btnSend");
const listMsg = document.querySelector(".listMsg");

socket.on("send-rooms", (rooms) => {
  let html = "";
  rooms.forEach((room) => {
    html += `<li>${room}</li>`;
  });
  list_room.innerHTML = html;
});

socket.on("send-chat-me", (msg) => {
  let div = document.createElement('div');
  div.className = 'msgMe';
  div.innerText = msg;
  listMsg.appendChild(div);
});

socket.on('send-chat-user-group', (msg) =>{
  console.log(msg);
  let div = document.createElement('div');
  div.className = 'msgUserOther';
  let pChild = document.createElement('p');
  pChild.className = 'msg';
  pChild.textContent = msg;
  div.appendChild(pChild);
  listMsg.appendChild(div);
})
socket.on("send-current-room", (currentRoom) => {
  current_room.innerText = currentRoom;
});
btn.onclick = function () {
  if (room.value) {
    socket.emit("create-room", room.value);
  }
};
btnSend.onclick = function () {
  if (chatMsg.value) {
    socket.emit("user-chat", chatMsg.value);
  }
};
