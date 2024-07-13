import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from "../components/layout"

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/feed')
  }, [router])

  return (
    <Layout>
      <h1>Redirecting to Feed...</h1>
    </Layout>
  )
}