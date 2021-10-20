import { api } from '../../services/api';
import io from 'socket.io-client';
import styles from './style.module.scss';
import logoImg from '../../assets/logo.svg';
import { useEffect, useState } from 'react';

interface IMessage {
  text: string,
  id: string,
  user: {
    avatar_url: string,
    name: string
  }
}

const messagesQueue: IMessage[] = [];

const socket = io('http://localhost:4000');
socket.on('new_message', (newMessage : IMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    api.get<IMessage[]>('messages/last3').then(response => setMessages(response.data));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean))

        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {
          messages.map((message, index) => {
            return (
              <li className={styles.message} key={index}>
                <p className={styles.messageContent}>{message.text}</p>
                  <div className={styles.messageUser}>
                    <div className={styles.userImage}>
                      <img src={message.user.avatar_url} alt={message.user.name} />
                    </div>
                    <span>{message.user.name}</span>
                  </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}