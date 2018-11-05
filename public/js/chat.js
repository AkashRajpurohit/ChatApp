const socket = io();

let messageTextbox = $("[name=message]");
let feedback = $("#feedback");

function scrollToBottom() {
  // Selectors
  let messages = $("#messages");
  let newMessage = messages.children("li:last-child");
  // Heights
  let clientHeight = messages.prop("clientHeight");
  let scrollTop = messages.prop("scrollTop");
  let scrollHeight = messages.prop("scrollHeight");
  let newMessageHeight = newMessage.innerHeight();
  let prevMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + prevMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  let params = $.deparam(window.location.search);
  params.room = params.room.toLowerCase();

  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("updateUserList", function(users) {
  const ol = $("<ol></ol>");

  users.forEach(function(user) {
    ol.append($("<li></li>").text(user));
  });

  $("#users").html(ol);
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
  feedback.html("");
  scrollToBottom();
});

socket.on("selfMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = $("#self-message-template").html();
  let html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    time: formattedTime
  });

  $("#messages").append(html);
  feedback.html("");
  scrollToBottom();
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
  feedback.html("");
  scrollToBottom();
});

socket.on("selfLocationMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = $("#self-location-message-template").html();
  let html = Mustache.render(template, {
    from: message.from,
    time: formattedTime,
    url: message.url
  });

  $("#messages").append(html);
  feedback.html("");
  scrollToBottom();
});

socket.on("isTypingMessage", function(message) {
  feedback.html(`<p><em>${message.from} is typing...</em></p>`);
});

socket.on("doneTypingMessage", function(message) {
  feedback.html("");
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
