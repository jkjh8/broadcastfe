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
      caption:
        message.caption ??
        '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.',
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
