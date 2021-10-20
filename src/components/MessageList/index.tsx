import { api } from '../../services/api';
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

export function MessageList() {

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    api.get<IMessage[]>('messages/last3').then(response => setMessages(response.data));
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {
          messages.map(message => {
            return (
              <li className={styles.message} key={message.id}>
                <p className={styles.messageContent}>{message.text}</p>
                  <div className={styles.messageUser}>
                    <div className={styles.userImage}>
                      <img src={message.user.avatar_url} alt={message.user.name} />
                    </div>
                    <span>{message.user.name}</span>
                  </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}