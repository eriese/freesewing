import Page from 'site/components/wrappers/page.js'
import useApp from 'site/hooks/useApp.js'
import Link from 'next/link'
import PageLink from 'shared/components/page-link.js'
import { strapiHost } from 'shared/config/freesewing.mjs'
import { strapiImage } from 'shared/utils.js'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const PreviewTile = ({ img, slug, title }) => (
  <div
    style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
    className={`
      rounded-full inline-block border-base-100 shrink-0
      w-42 h-42 -ml-8 border-8
      md:w-56 md:h-56 md:-ml-12
      theme-gradient
    `}
  >
    <Link href={`/showcase/${slug}`}>
      <a className="w-36 h-36 block" title={title} />
    </Link>
  </div>
)

const DesignPosts = ({ design, posts }) => {
  const { t } = useTranslation(['patterns'])
  return (
    <div className="py-8">
      <h2 className="bg-clip-text bg-success m-0">
        <PageLink href={`/showcase/designs/${design}`} txt={t(`${design}.t`)} />
      </h2>
      <div
        className={`
        flex flex-row overflow-visible
        -mr-8 pl-8
        md:-mr-12 md:pl-12
      `}
      >
        {posts.slice(0, 10).map((post) => (
          <PreviewTile
            img={`${strapiHost}${post.image?.sizes?.medium?.url}`}
            slug={post.slug}
            title={post.title}
            key={post.slug}
          />
        ))}
      </div>
    </div>
  )
}
const ShowcaseIndexPage = (props) => {
  const app = useApp()
  const { t } = useTranslation()

  const designs = {}
  for (const post of props.posts) {
    for (const design of post.designs) {
      if (typeof designs[design] === 'undefined') designs[design] = []
      designs[design].push(post)
    }
  }

  return (
    <Page app={app} title={t('showcase')} slug="showcase">
      <div
        className={`
        px-8 2xl:pl-16 overflow-visible overscroll-x-hidden
        max-w-sm
        md:max-w-md
        lg:max-w-lg
        xl:max-w-3xl
        2xl:max-w-7xl
      `}
      >
        {Object.keys(designs)
          .sort()
          .map((design) => (
            <DesignPosts key={design} design={design} posts={designs[design]} />
          ))}
      </div>
    </Page>
  )
}

export default ShowcaseIndexPage

/*
 * getStaticProps() is used to fetch data at build-time.
 *
 * On this page, it is loading the showcase content from strapi.
 *
 * This, in combination with getStaticPaths() below means this
 * page will be used to render/generate all showcase content.
 *
 * To learn more, see: https://nextjs.org/docs/basic-features/data-fetching
 */
export async function getStaticProps({ locale }) {
  const posts = await fetch(
    `${strapiHost}/showcaseposts?_locale=${locale}&_sort=date:DESC&_limit=-1`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err))

  return {
    props: {
      posts: posts.map((post) => {
        const designs = [post.design1]
        if (post.design2 && post.design2.length > 2) designs.push(post.design2)
        if (post.design3 && post.design3.length > 2) designs.push(post.design3)
        return {
          slug: post.slug,
          title: post.title,
          date: post.date,
          maker: post.maker.displayname,
          image: strapiImage(post.image, ['medium']),
          designs,
        }
      }),
      ...(await serverSideTranslations(locale)),
    },
  }
}
