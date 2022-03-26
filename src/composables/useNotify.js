import { useQuasar } from 'quasar'

export default function () {
  const $q = useQuasar()

  function notifyInfo(message) {
    return $q.notify({
      icon: 'fas fa-circle-info',
      message: message.message,
      caption: message.caption ?? '',
      position: 'top',
      color: 'positive',
      actions: [
        {
          icon: 'close',
          round: true,
          size: 'sm',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }

  function notifyWarn(message) {
    return $q.notify({
      icon: 'fas fa-circle-info',
      message: message.message,
      caption: message.caption ?? '',
      position: 'top',
      color: 'orange',
      actions: [
        {
          icon: 'close',
          round: true,
          size: 'sm',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }

  function notifyError(message) {
    return $q.notify({
      icon: 'fas fa-triangle-exclamation',
      message: message.message,
      caption: message.caption ?? '',
      position: 'top',
      color: 'negative',
      textColor: 'white',
      actions: [
        {
          icon: 'close',
          round: true,
          size: 'sm',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }
  return { notifyInfo, notifyWarn, notifyError }
}
