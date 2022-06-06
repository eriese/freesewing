import Page from 'site/components/wrappers/page.js'
import useApp from 'site/hooks/useApp.js'
import Popout from 'shared/components/popout.js'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import designs from 'shared/config/designs.json'
import Design from 'site/components/design.js'

// Don't bother with utilities
delete designs.utilities

const DesignsPage = (props) => {
  const app = useApp()
  const { t } = useTranslation()

  const allDesigns = [
    ...designs.accessories,
    ...designs.blocks,
    ...designs.garments,
  ]

  return (
    <Page app={app} title={t('designs')}>
      <div className="flex flex-row flex-wrap gap-4">
        {allDesigns.map(design => <Design key={design} design={design} />)}
      </div>
    </Page>
  )
}

export default DesignsPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    }
  }
}

