const contacts = {
  mara: { name: "Mara Chen", shortName: "Mara", initials: "MC", status: "En ligne", avatar: "avatar-mara" },
  lea: { name: "Léa Bernard", shortName: "Léa", initials: "LB", status: "En ligne", avatar: "avatar-lea" },
  thomas: { name: "Thomas Dubois", shortName: "Thomas", initials: "TD", status: "Vu récemment", avatar: "avatar-thomas" },
  ines: { name: "Inès Moreau", shortName: "Inès", initials: "IM", status: "Vu récemment", avatar: "avatar-ines" }
};

const initialMessages = {
  mara: [
    { from: "contact", text: "Hello Alex ! J’ai enfin visité le nouvel espace rue des Archives.", time: "10:36" },
    { from: "contact", text: "On devrait vraiment y organiser notre prochaine rencontre ✨", time: "10:36" },
    { from: "you", text: "Oh oui, je voulais justement le voir ! L’espace est comment ?", time: "10:39" },
    { from: "contact", text: "Tu as vu le nouveau studio ? La lumière est incroyable.", time: "10:42" }
  ],
  lea: [{ from: "contact", text: "Je t’envoie le dossier dans la matinée !", time: "09:18" }],
  thomas: [{ from: "contact", text: "Parfait, on se retrouve là-bas vers 19 h.", time: "Hier" }],
  ines: [{ from: "contact", text: "Merci encore pour tes recommandations ✨", time: "Mar." }]
};

function readMessages(contactId) {
  try {
    const saved = localStorage.getItem(`cercle-messages-${contactId}`);
    return saved ? JSON.parse(saved) : initialMessages[contactId];
  } catch {
    return initialMessages[contactId];
  }
}

function renderConversation(contactId, contact) {
  const stream = document.querySelector("#message-stream");
  if (!stream) return;

  const name = document.querySelector("#contact-name");
  const status = document.querySelector("#contact-status");
  const avatar = document.querySelector("#contact-avatar");
  if (name) name.textContent = contact.name;
  if (status) status.textContent = contact.status;
  if (avatar) {
    avatar.textContent = contact.initials;
    avatar.className = `avatar ${contact.avatar}`;
  }

  stream.replaceChildren();
  const divider = document.createElement("div");
  divider.className = "day-divider";
  const dividerLabel = document.createElement("span");
  dividerLabel.textContent = "Aujourd’hui";
  divider.append(dividerLabel);
  stream.append(divider);

  readMessages(contactId).forEach((message) => {
    const group = document.createElement("div");
    group.className = `message-group ${message.from === "you" ? "sent-group" : "received-group"}`;
    const content = document.createElement("div");
    const meta = document.createElement("div");
    meta.className = `message-meta ${message.from === "you" ? "sent-meta" : ""}`;
    const sender = document.createElement("strong");
    sender.textContent = message.from === "you" ? "Vous" : contact.shortName;
    const time = document.createElement("time");
    time.textContent = message.time;
    if (message.from === "you") meta.append(time, sender);
    else meta.append(sender, time);
    const bubble = document.createElement("div");
    bubble.className = `bubble ${message.from === "you" ? "sent" : "received"}`;
    bubble.textContent = message.text;
    content.append(meta, bubble);

    if (message.from !== "you") {
      const miniAvatar = document.createElement("span");
      miniAvatar.className = `mini-avatar ${contact.avatar}`;
      miniAvatar.textContent = contact.initials;
      group.append(miniAvatar, content);
    } else {
      group.append(content);
    }
    stream.append(group);
  });
  stream.scrollTop = stream.scrollHeight;
}

const params = new URLSearchParams(window.location.search);
const contactId = contacts[params.get("contact")] ? params.get("contact") : "mara";
const contact = contacts[contactId];
renderConversation(contactId, contact);

const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
if (messageForm && messageInput) {
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const messages = readMessages(contactId);
    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    messages.push({ from: "you", text, time });
    try {
      localStorage.setItem(`cercle-messages-${contactId}`, JSON.stringify(messages));
    } catch {
      // Keep the message visible for this visit when browser storage is unavailable.
    }
    messageInput.value = "";
    renderConversation(contactId, contact);
    messageInput.focus();
  });

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      messageForm.requestSubmit();
    }
  });
}

const searchInput = document.querySelector("#conversation-search");
if (searchInput) {
  const rows = [...document.querySelectorAll(".conversation-row")];
  const noResults = document.querySelector("#no-results");
  let currentFilter = "all";

  function updateInbox() {
    const query = searchInput.value.trim().toLocaleLowerCase("fr");
    let visibleCount = 0;
    rows.forEach((row) => {
      const matchesQuery = row.textContent.toLocaleLowerCase("fr").includes(query);
      const matchesFilter = currentFilter === "all" || row.dataset.unread === "true";
      row.hidden = !(matchesQuery && matchesFilter);
      if (!row.hidden) visibleCount += 1;
    });
    noResults.hidden = visibleCount > 0;
  }

  searchInput.addEventListener("input", updateInbox);
  document.querySelectorAll("[data-inbox-filter]").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentFilter = tab.dataset.inboxFilter;
      document.querySelectorAll("[data-inbox-filter]").forEach((otherTab) => {
        const selected = otherTab === tab;
        otherTab.classList.toggle("active", selected);
        otherTab.setAttribute("aria-selected", String(selected));
      });
      updateInbox();
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
    }
  });
}