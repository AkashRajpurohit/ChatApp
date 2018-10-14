const socket = io();

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  let li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  $("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  let li = $("<li></li>");
  let a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr("href", message.url);

  li.append(a);

  $("#messages").append(li);
});

$("#message-form").on("submit", function(e) {
  e.preventDefault();

  let messageTextbox = $("[name=message]");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val("");
    }
  );
});

let locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported on this browser");
  }

  locationButton.attr("disabled", "disabled").text("Sending...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit(
        "createLocationMessage",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        function() {
          locationButton.removeAttr("disabled").text("Send Location");
        }
      );
    },
    function() {
      locationButton.removeAttr("disabled").text("Send Location");
      alert("Unable to fetch location.");
    }
  );
});
