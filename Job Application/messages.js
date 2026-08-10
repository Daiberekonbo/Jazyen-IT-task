/* ============================================================
   MESSAGES PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const conversationItems = document.getElementById("conversationItems");
const conversationSearch = document.getElementById("conversationSearch");
const chatMessages = document.getElementById("chatMessages");
const chatHeader = document.getElementById("chatHeader");
const chatAvatar = document.getElementById("chatAvatar");
const chatName = document.getElementById("chatName");
const chatStatus = document.getElementById("chatStatus");
const chatInputArea = document.getElementById("chatInputArea");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

/* SECTION 2: VARIABLES */
// LATER BACKEND: This will be fetched from GET /api/conversations
// Each conversation has: id, name, avatar, online, unread, messages[]
// Each message has: text, sentByMe (true/false), time
const defaultConversations = [
    {
        id: 1,
        name: "Facebook Recruiter",
        avatar: "FB",
        online: true,
        unread: 2,
        messages: [
            { text: "Hi! Thanks for applying to Frontend Developer at Facebook.", sentByMe: false, time: "10:30 AM" },
            { text: "We'd love to schedule an interview with you.", sentByMe: false, time: "10:31 AM" },
            { text: "That sounds great! I'm available this week.", sentByMe: true, time: "10:45 AM" },
            { text: "Perfect. How about Thursday at 2 PM?", sentByMe: false, time: "11:00 AM" }
        ]
    },
    {
        id: 2,
        name: "Google Hiring Team",
        avatar: "GG",
        online: false,
        unread: 0,
        messages: [
            { text: "Your application for Backend Engineer has been received.", sentByMe: false, time: "Yesterday" },
            { text: "We'll review your profile and get back to you soon.", sentByMe: false, time: "Yesterday" },
            { text: "Thank you! Looking forward to hearing from you.", sentByMe: true, time: "Yesterday" }
        ]
    },
    {
        id: 3,
        name: "Netflix Talent",
        avatar: "NF",
        online: true,
        unread: 1,
        messages: [
            { text: "We noticed you're a great fit for our React Developer role!", sentByMe: false, time: "2 days ago" },
            { text: "Would you be interested in a quick call this week?", sentByMe: false, time: "2 days ago" }
        ]
    },
    {
        id: 4,
        name: "Amazon HR",
        avatar: "AM",
        online: false,
        unread: 0,
        messages: [
            { text: "Your application for Full Stack Developer is under review.", sentByMe: false, time: "3 days ago" },
            { text: "We'll update you on the next steps.", sentByMe: false, time: "3 days ago" }
        ]
    }
];

// Load conversations from localStorage, or use defaults
let conversations = JSON.parse(localStorage.getItem("conversations")) || defaultConversations;

// Currently selected conversation ID
let activeConversationId = null;

/* SECTION 3: HELPER FUNCTIONS */

// Creates HTML for a single conversation item in the list
function createConversationHTML(conv) {
    const lastMessage = conv.messages[conv.messages.length - 1];
    const lastMessageText = lastMessage ? lastMessage.text : "No messages yet";
    const unreadBadge = conv.unread > 0
        ? `<span class="unread-count">${conv.unread}</span>`
        : "";
    const onlineDot = conv.online ? '<span class="online-dot"></span>' : "";

    return `
        <div class="conversation-item ${conv.id === activeConversationId ? 'active' : ''}" data-id="${conv.id}">
            <div class="conversation-avatar">
                ${conv.avatar}
                ${onlineDot}
            </div>
            <div class="conversation-info">
                <h4>${conv.name}</h4>
                <p>${lastMessageText}</p>
            </div>
            <div class="conversation-meta">
                <small>${lastMessage ? lastMessage.time : ""}</small>
                ${unreadBadge}
            </div>
        </div>
    `;
}

// Creates HTML for a single message bubble
function createMessageHTML(message) {
    const messageClass = message.sentByMe ? "sent" : "received";
    return `
        <div class="message ${messageClass}">
            ${message.text}
            <small>${message.time}</small>
        </div>
    `;
}

// Renders the conversation list
function renderConversations() {
    const searchTerm = conversationSearch.value.toLowerCase().trim();

    let filtered = conversations;
    if (searchTerm) {
        filtered = conversations.filter(function(conv) {
            return conv.name.toLowerCase().includes(searchTerm);
        });
    }

    if (filtered.length === 0) {
        conversationItems.innerHTML = '<div class="chat-placeholder"><p>No conversations found</p></div>';
        return;
    }

    conversationItems.innerHTML = filtered.map(function(conv) {
        return createConversationHTML(conv);
    }).join("");
}

// Renders the chat area for a selected conversation
function renderChat(conv) {
    // Update chat header
    chatAvatar.textContent = conv.avatar;
    chatName.textContent = conv.name;
    chatStatus.textContent = conv.online ? "Online" : "Offline";
    chatStatus.className = "online-status" + (conv.online ? " online" : "");

    // Show input area
    chatInputArea.style.display = "flex";

    // Render messages
    chatMessages.innerHTML = conv.messages.map(function(message) {
        return createMessageHTML(message);
    }).join("");

    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Selects a conversation
function selectConversation(convId) {
    activeConversationId = convId;

    // Find the conversation
    const conv = conversations.find(function(c) {
        return c.id === convId;
    });

    if (conv) {
        // Clear unread count when opening
        conv.unread = 0;
        localStorage.setItem("conversations", JSON.stringify(conversations));

        renderConversations();
        renderChat(conv);
    }
}

// Sends a message in the active conversation
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || activeConversationId === null) return;

    // Find the active conversation
    const conv = conversations.find(function(c) {
        return c.id === activeConversationId;
    });

    if (conv) {
        // Get current time
        const now = new Date();
        const timeString = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

        // Add the message
        conv.messages.push({
            text: text,
            sentByMe: true,
            time: timeString
        });

        // Save to localStorage
        localStorage.setItem("conversations", JSON.stringify(conversations));

        // Clear input
        messageInput.value = "";

        // Re-render
        renderConversations();
        renderChat(conv);
    }
}

/* SECTION 4: EVENT LISTENERS */

// Search conversations as user types
conversationSearch.addEventListener("input", renderConversations);

// Event delegation for conversation items
conversationItems.addEventListener("click", function(event) {
    const item = event.target.closest(".conversation-item");
    if (item) {
        const convId = parseInt(item.dataset.id);
        selectConversation(convId);
    }
});

// Send message on button click
sendBtn.addEventListener("click", sendMessage);

// Send message on Enter key
messageInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

/* ------------------------------------------------
   FUNCTION: handleSignOut()
   Signs the user out by clearing session data
   ------------------------------------------------ */
function handleSignOut() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("rememberMe");
    window.location.href = "LandingPage2.html";
}

// Attach sign-out handler to all "Sign Out" links
document.querySelectorAll('a[href="LandingPage2.html"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        handleSignOut();
    });
});

/* SECTION 5: MAIN LOGIC */
function initMessages() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    renderConversations();
    console.log("Messages initialized with", conversations.length, "conversations");
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initMessages);