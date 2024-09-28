const chatbotButton = document.getElementById("chatbot-button");
const chatContainer = document.getElementById("chat-container");
const closeButton = document.getElementById("close-button");
const chatLog = document.getElementById("chat-log");
const sugge1 = document.getElementById("suggest1");
const sugge2 = document.getElementById("suggest2");


chatbotButton.addEventListener("click", function () {
  chatContainer.style.right = "0";
  chatbotButton.style.display = "none";
  localStorage.setItem("chatOpen", "true"); 
});

closeButton.addEventListener("click", function () {
  chatContainer.style.right = "-500px";
  chatbotButton.style.display = "block";
  localStorage.setItem("chatOpen", "false"); 
});

function sendMessage() {
  const messageInput = document.getElementById("message");
  const message = messageInput.value;

  const userTemplate = document
    .querySelector(".you-answer-template")
    .cloneNode(true);
  const botTemplate = document
    .querySelector(".bot-answer-template")
    .cloneNode(true);
  const loadimageTemplate = document
    .querySelector(".loading-icon-template")
    .cloneNode(true);
  loadimageTemplate.classList.remove("loading-icon-template");
  loadimageTemplate.classList.add("load-icon");
  loadimageTemplate.removeAttribute("style")
  userTemplate.classList.remove("you-answer-template");
  userTemplate.classList.add("you-answer");

  botTemplate.classList.remove("bot-answer-template");
  botTemplate.classList.add("bot-answer");
  userTemplate.removeAttribute("style");
  botTemplate.removeAttribute("style");

  

  userTemplate.querySelector(".up").textContent = message;

  const chatLog = document.getElementById("chat-log");
  chatLog.appendChild(userTemplate);


  chatLog.appendChild(loadimageTemplate);

  $.ajax({
    url: "/sol/", 
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ message: message }),
    success: function (data) {

      botTemplate.querySelector(".bp").textContent = data.bot_response;

      chatLog.appendChild(botTemplate);
      const loadIcons = document.querySelectorAll('.load-icon');
      loadIcons.forEach(icon => {
        icon.remove();
        });

      messageInput.value = "";
      console.log(chatLog.lastChild);
      scrollIntoBottom();

      const s1 = document.getElementById("suggestion1");
      if (data.sugg1 != "") {
        s1.textContent = data.sugg1;
        sugge1.style.display = "block";
      } else {
        sugge1.style.display = "none";
      }

      const s2 = document.getElementById("suggestion2");
      if (data.sugg2 != "") {
        s2.textContent = data.sugg2;
        sugge2.style.display = "block";
      } else {
        sugge2.style.display = "none";
      }

    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
  scrollIntoBottom();
}

const sendButton = document.getElementById("send-button");
sendButton.addEventListener("click", function () {
  sendMessage();
});

const messageInput = document.getElementById("message");
messageInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

const scrollIntoBottom = () => {
  chatLog.scrollTo(0, chatLog.scrollHeight);
};



const suggestionButton1 = document.getElementById("suggest1");
suggestionButton1.addEventListener("click", function () {
  const message = suggestionButton1.textContent;

  const userTemplate = document
    .querySelector(".you-answer-template")
    .cloneNode(true);
  const botTemplate = document
    .querySelector(".bot-answer-template")
    .cloneNode(true);
  const loadimageTemplate = document
    .querySelector(".loading-icon-template")
    .cloneNode(true);
  loadimageTemplate.classList.remove("loading-icon-template");
  loadimageTemplate.classList.add("load-icon");
  loadimageTemplate.removeAttribute("style")  

  userTemplate.classList.remove("you-answer-template");
  userTemplate.classList.add("you-answer");

  botTemplate.classList.remove("bot-answer-template");
  botTemplate.classList.add("bot-answer");
  userTemplate.removeAttribute("style");
  botTemplate.removeAttribute("style");


  userTemplate.querySelector(".up").textContent = message;

  const chatLog = document.getElementById("chat-log");
  chatLog.appendChild(userTemplate);
  
  chatLog.appendChild(loadimageTemplate);

  $.ajax({
    url: "/sol/", 
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ message: message }),
    success: function (data) {

      const loadIcons = document.querySelectorAll('.load-icon');
      loadIcons.forEach(icon => {
        icon.remove();
      });
      botTemplate.querySelector(".bp").textContent = data.bot_response;

      chatLog.appendChild(botTemplate);

      messageInput.value = "";
      console.log(chatLog.lastChild);
      scrollIntoBottom();
      const s1 = document.getElementById("suggestion1");
      if (data.sugg1 != "") {
        s1.textContent = data.sugg1;
        sugge1.style.display = "block";
      } else {
        sugge1.style.display = "none";
      }

      const s2 = document.getElementById("suggestion2");
      if (data.sugg2 != "") {
        s2.textContent = data.sugg2;
        sugge2.style.display = "block";
      } else {
        sugge2.style.display = "none";
      }

     
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
  scrollIntoBottom();
});

const suggestionButton2 = document.getElementById("suggest2");
suggestionButton2.addEventListener("click", function () {
  const message = suggestionButton2.textContent;

  const userTemplate = document
    .querySelector(".you-answer-template")
    .cloneNode(true);
  const botTemplate = document
    .querySelector(".bot-answer-template")
    .cloneNode(true);
  const loadimageTemplate = document
    .querySelector(".loading-icon-template")
    .cloneNode(true);
  loadimageTemplate.classList.remove("loading-icon-template");
  loadimageTemplate.classList.add("load-icon");
  loadimageTemplate.removeAttribute("style")

  userTemplate.classList.remove("you-answer-template");
  userTemplate.classList.add("you-answer");

  botTemplate.classList.remove("bot-answer-template");
  botTemplate.classList.add("bot-answer");
  userTemplate.removeAttribute("style");
  botTemplate.removeAttribute("style");

  userTemplate.querySelector(".up").textContent = message;

  const chatLog = document.getElementById("chat-log");
  chatLog.appendChild(userTemplate);

  chatLog.appendChild(loadimageTemplate);

  $.ajax({
    url: "/sol/", 
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ message: message }),
    success: function (data) {
      const loadIcons = document.querySelectorAll('.load-icon');
      loadIcons.forEach(icon => {
        icon.remove();
      });
      botTemplate.querySelector(".bp").textContent = data.bot_response;

      chatLog.appendChild(botTemplate);

      messageInput.value = "";
      console.log(chatLog.lastChild);
      scrollIntoBottom();
      const s1 = document.getElementById("suggestion1");
      if (data.sugg1 != "") {
        s1.textContent = data.sugg1;
        sugge1.style.display = "block";
      } else {
        sugge1.style.display = "none";
      }

      const s2 = document.getElementById("suggestion2");
      if (data.sugg2 != "") {
        s2.textContent = data.sugg2;
        sugge2.style.display = "block";
      } else {
        sugge2.style.display = "none";
      }

    
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
  scrollIntoBottom();
});
