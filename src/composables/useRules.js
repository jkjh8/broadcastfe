import { api } from 'boot/axios'

export const required = (v) => !!v || '필수 입력 항목 입니다.'
export const chkEmail = (v) => /.+@.+\..+/.test(v) || '올바른 형식이 아닙니다'
export const chkLength = (v) => v.length >= 8 || '최소 8자 이상 입력하세요'
export const chkEmailUsed = async (v) => {
  const r = await api.get(`/auth/checkEmail?email=${v}`)
  if (r && r.data.status) {
    return '이미 사용중인 이메일 입니다.'
  }
  return true
}
export const chkIpaddr = (v) =>
  /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm.test(
    v
  ) || 'IPv4 형식이 아닙니다'
export const chkInt = (v) => v > 0 || '0 보다 큰 숫자를 입력하세요'
export const chkDeviceIndex = async (v) => {
  const r = await api.get(`/devices/exists?index=${v}`)
  if (r && r.data.result) {
    return '이미 사용중인 아이디 입니다.'
  }
  return true
}
