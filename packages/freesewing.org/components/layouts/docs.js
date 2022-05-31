import { useRouter } from 'next/router'
import Link from 'next/link'
// Shared components
import Aside from 'shared/components/navigation/aside'
import ThemePicker from 'shared/components/theme-picker'
import Breadcrumbs from 'shared/components/breadcrumbs.js'
import { getCrumbs } from 'shared/utils.js'

const DefaultLayout = ({ app, title=false, crumbs=false, children=[] }) => {
  const router = useRouter()
  const slug = router.asPath.slice(1)
  const breadcrumbs = crumbs
    ? crumbs
    : getCrumbs(app, slug, title)

  return (
    <div className="m-auto flex flex-row justify-center">
      <Aside app={app} slug={slug} before={<ThemePicker app={app} className="block sm:hidden"/>}/>
      <section className="py-28 md:py-36">
        <div>
          {title && (
            <div className="px-8 xl:pl-8 2xl:pl-16">
              <Breadcrumbs title={title} crumbs={breadcrumbs} />
              {title
                ? <h1>{title}</h1>
                : <h1>{app.getTitle(slug)}</h1>
              }
            </div>
          )}
          {children}
        </div>
      </section>
    </div>
  )
}

export default DefaultLayout
