import {
  ChatContainer,
  Message,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import * as S from './style'
import { useGlobalContext } from '../../../context/GlobalProvider'

const ChatBox = ({ subID }) => {
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')
  const { user } = useGlobalContext()

  useEffect(() => {
    if (subID)
      axios.get('custom/comments/' + subID).then((response) => {
        setComments(response.data)
      })
  }, [subID])

  const handleSend = () => {
    if (subID) {
      axios
        .post('komentari', {
          komentars: message,
          ir_students: user.loma == 'students' ? 1 : 0,
          datums: moment().format('YYYY-MM-DD HH:mm:ss'),
          iesniegumi_id: subID,
        })
        .then((res) => {
          if (res.statusText == 'OK') {
            setMessage('')
            setComments([
              ...comments,
              {
                komentars: message,
                ir_students: user.loma == 'students' ? 1 : 0,
                datums: moment().format('YYYY-MM-DD HH:mm:ss'),
              },
            ])
          }
        })
    }
  }

  return (
    <ChatContainer style={S.ChatContainerStyle}>
      <MessageList style={S.MessageStyle}>
        {comments.map((comment, i) => (
          <Message
            key={i}
            model={{
              message: comment.komentars,
              direction:
                user.loma == 'skolotajs'
                  ? comment.ir_students == 1
                    ? 0
                    : 1
                  : comment.ir_students,
              position: 'single',
            }}
            children={
              <Message.Header
                sender={
                  user.loma == 'skolotajs' ? comment.sutitajs : 'Skolotājs'
                }
              />
            }
          />
        ))}
      </MessageList>
      <MessageInput
        value={message}
        onChange={(val) => setMessage(val)}
        style={S.MessageStyle}
        placeholder='Ziņa...'
        attachButton={false}
        onSend={handleSend}
      />
    </ChatContainer>
  )
}

export default ChatBox
