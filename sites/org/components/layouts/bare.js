import { useRouter } from 'next/router'
import Aside from 'shared/components/navigation/aside'
import ThemePicker from 'shared/components/theme-picker'

const DefaultLayout = ({ app, children = [] }) => {
  const router = useRouter()
  const slug = router.asPath.slice(1)

  return (
    <>
      <Aside app={app} slug={slug} before={<ThemePicker app={app} />} mobileOnly />
      {children}
    </>
  )
}

export default DefaultLayout
