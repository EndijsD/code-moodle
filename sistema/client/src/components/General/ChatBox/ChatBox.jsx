import {
  ChatContainer,
  Message,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useEffect, useState } from 'react';
import url from '../../../../url';
import axios from 'axios';
import moment from 'moment';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const ChatBox = ({ subID }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const auth = useAuthUser();

  useEffect(() => {
    if (subID)
      axios.get(url + 'custom/comments/' + subID).then((response) => {
        setComments(response.data);
      });
  }, [subID]);

  const handleSend = () => {
    if (subID) {
      axios
        .post(url + 'komentari', {
          komentars: message,
          ir_students: auth.userType == 1 ? 0 : 1,
          datums: moment().format('YYYY-MM-DD HH:mm:ss'),
          iesniegumi_id: subID,
        })
        .then((res) => {
          if (res.statusText == 'OK') {
            setMessage('');
            setComments([
              ...comments,
              {
                komentars: message,
                ir_students: auth.userType == 1 ? 0 : 1,
                datums: moment().format('YYYY-MM-DD HH:mm:ss'),
              },
            ]);
          }
        });
    }
  };

  return (
    <ChatContainer
      style={{
        height: 300,
        maxWidth: 700,
      }}
    >
      <MessageList
        style={{
          background: '#f0f0f0',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      >
        {comments.map((comment, i) => (
          <Message
            key={i}
            model={{
              message: comment.komentars,
              direction:
                auth.userType == 1
                  ? comment.ir_students == 1
                    ? 0
                    : 1
                  : comment.ir_students,
              position: 'single',
            }}
            children={
              <Message.Header
                sender={auth.userType == 1 ? comment.sutitajs : 'Skolotājs'}
              />
            }
          />
        ))}
      </MessageList>
      <MessageInput
        value={message}
        onChange={(val) => setMessage(val)}
        style={{
          background: '#f0f0f0',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
        }}
        placeholder="Ziņa..."
        attachButton={false}
        onSend={handleSend}
      />
    </ChatContainer>
  );
};

export default ChatBox;
