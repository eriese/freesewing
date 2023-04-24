import get from 'lodash.get'
import orderBy from 'lodash.orderby'
import Link from 'next/link'
import { useApp } from 'shared/hooks/app-context.mjs'

// Helper method to filter out the real children
const order = (obj) => orderBy(obj, ['__order', '__title'], ['asc', 'asc'])
const currentChildren = (current) =>
  Object.values(order(current)).filter((entry) => typeof entry === 'object')

export const ReadMore = (props) => {
  // Don't bother if we don't have the navigation tree in app
  const app = useApp()
  const slug = props.slug || app.slug

  const root = get(app.navigation, slug.split('/'))
  const list = []
  for (const page of currentChildren(root)) {
    list.push(
      <li key={page.__slug} className={props.recurse ? 'ont-bold' : ''}>
        <Link
          href={`/${page.__slug}`}
          className={props.recurse ? 'inline-block font-bold pt-3 pb-1' : ''}
        >
          {page.__title}
        </Link>
        {props.recurse && <ReadMore app={app} slug={page.__slug} />}
      </li>
    )
  }
  return <ul>{list}</ul>
}
