function registerPlugin(plugin) {
  window.enmity.plugins.registerPlugin(plugin);
}

const Messages = window.enmity.modules.common.Messages;
const React = window.enmity.modules.common.React;
const Users = window.enmity.modules.common.Users;
const Dispatcher = window.enmity.modules.common.Dispatcher;

function createPatcher(name) {
  return window.enmity.patcher.create(name);
}

const pluginInfo = {
  name: "PingOnKeyword",
  version: "1.0.0",
  description: "Pings a user when specific keywords are mentioned",
  authors: [{ name: "dev", id: "1234567890" }],
  color: "#00ff00"
};

const patcher = createPatcher("PingOnKeyword");

const keywords = [
  { keyword: "username1", userId: "1234567890" },
  { keyword: "username2", userId: "0987654321" }
];

const PingOnKeywordPlugin = {
  ...pluginInfo,
  onStart() {
    patcher.before(Messages, "sendMessage", (thisArg, args) => {
      const messageContent = args[1].content.toLowerCase();
      const matchingKeyword = keywords.find(kw => messageContent.includes(kw.keyword.toLowerCase()));
      if (matchingKeyword) {
        const user = Users.getUser(matchingKeyword.userId);
        if (user) {
          Messages.sendMessage(args[0], { content: `@${user.username}#${user.discriminator} ${args[1].content}` });
        }
      }
    });

    patcher.before(Messages, "sendBotMessage", (thisArg, args) => {
      const messageContent = args[1].content.toLowerCase();
      const matchingKeyword = keywords.find(kw => messageContent.includes(kw.keyword.toLowerCase()));
      if (matchingKeyword) {
        const user = Users.getUser(matchingKeyword.userId);
        if (user) {
          Messages.sendBotMessage(args[0], { content: `@${user.username}#${user.discriminator} ${args[1].content}` });
        }
      }
    });
  },
  onStop() {
    patcher.unpatchAll();
  },
  getSettingsPanel({ settings }) {
    return React.createElement("div", null, "No settings for this plugin.");
  }
};

registerPlugin(PingOnKeywordPlugin);
