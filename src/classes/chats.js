const debounce = require('debounce');

const chatRegistry = {
  chats: {},
  
  register(message) {
    if (!(message.chat.id in this.chats)) {
      this.chats[message.chat.id] = {
        messages: [],
        albumDebounce: debounce(done => done(), 1000)
      };
    }
    this.chats[message.chat.id].messages.push(message);
  },
  
  handleAlbum(message, callback = () => {})  {
    if (message.media_group_id && this.isAlbumInChat(message)) {
      this.chats[message.chat.id].albumDebounce(() => {
        this.cleanupChatAlbum(message);
        callback();
      });
    }
  },
  
  isAlbumInChat(message) {
    return this.chats[message.chat.id].messages.some((storedMessage) => {
      return storedMessage.media_group_id === message.media_group_id;
    });
  },
  
  cleanupChatAlbum(message) {
    this.chats[message.chat.id].messages = this.chats[message.chat.id].messages.filter((storedMessage) => {
      return storedMessage.media_group_id !== message.media_group_id;
    });
  }
};

module.exports = chatRegistry;