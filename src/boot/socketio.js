import { boot } from 'quasar/wrappers'
import io from 'socket.io-client'

const socket = io(`http://${window.location.hostname}:3000`, {
  reconnectionDelayMax: 5000,
  transports: ['websocket'],
  autoConnect: true,
  withCredentials: true
})

export default boot(({ app }) => {
  app.config.globalProperties.$socketio = socket
})

export { socket }
