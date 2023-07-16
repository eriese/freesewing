import { HeadInfo } from 'shared/components/docs/docs-page.mjs'
import { PageLink } from 'shared/components/page-link.mjs'
import { Lightbox } from 'shared/components/lightbox.mjs'
import { ImageWrapper } from 'shared/components/wrappers/img.mjs'
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { Author } from './author.mjs'
import { TimeAgo } from 'shared/components/mdx/meta.mjs'
import { useTranslation } from 'next-i18next'
import { Toc } from 'shared/components/mdx/toc.mjs'
import { PrevNext } from 'shared/components/prev-next.mjs'

export const ns = ['common', 'posts', ...pageNs]

export const PostPageWrapper = ({ page, slug, locale, frontmatter, mdxContent }) => {
  const { t } = useTranslation(ns)
  return (
    <PageWrapper title={frontmatter.title} {...page}>
      <HeadInfo {...{ frontmatter, locale, slug, site: 'org' }} />
      <article className="mb-12 px-8 max-w-7xl">
        <div className="flex flex-row justify-between text-sm mb-1 mt-2">
          <div>
            <TimeAgo date={frontmatter.date} t={t} /> [{frontmatter.date}]
          </div>
          <div>
            {frontmatter.designs?.map((design) => (
              <PageLink
                href={`/showcase/designs/${design}`}
                txt={design}
                key={design}
                className="px-2 capitalize"
              />
            ))}
          </div>
          <div>
            By{' '}
            <a href="#maker" className="text-secondary hover:text-secondary-focus">
              {frontmatter.author || frontmatter.maker || 'FIXME: No displayname'}
            </a>
          </div>
        </div>
        <figure>
          <Lightbox>
            <ImageWrapper>
              <img src={frontmatter.image} alt={frontmatter.caption} className="shadow m-auto" />
            </ImageWrapper>
            <figcaption
              className="text-center mb-8 prose m-auto"
              dangerouslySetInnerHTML={{ __html: frontmatter.caption }}
            />
          </Lightbox>
        </figure>
        <div className="flex flex-row-reverse flex-wrap xl:flex-nowrap justify-end">
          {frontmatter.toc && frontmatter.toc.length > 0 && (
            <div className="mb-8 w-full xl:w-80 2xl:w-96 xl:pl-8 2xl:pl-16">
              <Toc toc={frontmatter.toc} wrap />
            </div>
          )}
          <div>
            <div className="strapi prose lg:prose-lg mb-12 m-auto">{mdxContent}</div>
            <div className="max-w-prose text-lg lg:text-xl">
              <Author author={frontmatter.author || frontmatter.maker} />
            </div>
          </div>
        </div>
      </article>
      <PrevNext slug={slug} />
    </PageWrapper>
  )
}
