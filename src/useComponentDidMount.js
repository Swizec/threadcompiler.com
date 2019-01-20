import { useEffect, useState } from 'react'

export default function useComponentDidMount(onMounted) {
  const [mounted, setMounted] = useState(false)
  useEffect(
    () => {
      setMounted(true)

      onMounted()
    },
    [mounted]
  )
}
