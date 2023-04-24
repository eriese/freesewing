import { useRouter } from 'next/router'
import { AsideNavigation } from 'shared/components/navigation/aside.mjs'
import { useApp } from 'shared/hooks/app-context.mjs'

export const BareLayout = ({ children = [] }) => {
  const router = useRouter()
  const slug = router.asPath.slice(1)
  const app = useApp()
  return (
    <>
      <AsideNavigation app={app} slug={slug} mobileOnly />
      {children}
    </>
  )
}
