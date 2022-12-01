import { useRouter } from 'next/router'
// Shared components
import Aside from 'shared/components/navigation/aside'
import ThemePicker from 'shared/components/theme-picker'
import Breadcrumbs from 'shared/components/breadcrumbs.js'

const DefaultLayout = ({ app, title = false, crumbs = false, children = [] }) => {
  const router = useRouter()
  const slug = router.asPath.slice(1)
  const breadcrumbs = crumbs ? crumbs : null //FIXME getCrumbs(app, slug, title)

  return (
    <div className="m-auto flex flex-row justify-center">
      <Aside app={app} slug={slug} before={<ThemePicker app={app} className="block sm:hidden" />} />
      <section className="py-28 md:py-36 max-w-7xl px-6 xl:pl-8 2xl:pl-16">
        <div>
          {title && (
            <>
              <Breadcrumbs title={title} crumbs={breadcrumbs} />
              <h1>{title}</h1>
            </>
          )}
          {children}
        </div>
      </section>
    </div>
  )
}

export default DefaultLayout
