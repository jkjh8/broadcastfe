import { ref } from 'vue'

let user = ref(null)
let userSocket = ref(null)

function updateUser(args) {
  user.value = args
}

function getNickName() {
  if (user.value) {
    return user.value.name.substring(0, 1)
  } else {
    return 'N'
  }
}

export { user, userSocket, updateUser, getNickName }
