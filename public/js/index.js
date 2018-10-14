const socket = io();

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = $("#message-template").html();
  let html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    time: formattedTime
  });

  $("#messages").append(html);
});

socket.on("newLocationMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = $("#location-message-template").html();
  let html = Mustache.render(template, {
    from: message.from,
    time: formattedTime,
    url: message.url
  });

  $("#messages").append(html);
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
