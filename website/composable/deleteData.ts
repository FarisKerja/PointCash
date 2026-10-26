import { useRouter } from 'vue-router'
export function deleteData() {
  const router = useRouter()
  const isOpen = useState<boolean>('danger:isOpen', () => false)
  const loading = useState<boolean>('danger:loading', () => false)
  const progress = useState<boolean>('danger:progress', () => false)

  const targetId = useState<number | null>('danger:targetId', () => null)
  const targetName = useState<string>('danger:targetName', () => '')
  const targetUrl = useState<string>('danger:targetUrl', () => '')

  function open(id: number, name: string, url: string) {
    targetId.value = id
    targetName.value = name
    targetUrl.value = url
    isOpen.value = true
    loading.value = true
  }
  
  function close() {
    isOpen.value = false
    targetId.value = null
    targetUrl.value = ''
    targetName.value = ''
    loading.value = false
  }

  async function confirm() {
    if (!targetId.value || !targetUrl.value) return
    
    try {
      const url = targetUrl.value
      const id = targetId.value
      await $fetch(`${url}/${id}`, {
        method: 'DELETE',
        server: false
      })
      close()
    } catch (err) {
      console.error(err)
      return false
    } finally {
      console.log('API successfully ran to delete')
    }
  }

  return {
    // state
    isOpen,
    loading,
    targetName,
    progress,

    // actions
    open,
    close,
    confirm,
  }
}
