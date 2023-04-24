import { Popout } from 'shared/components/popout.mjs'
import { Highlight } from './highlight.mjs'
import { YouTube } from './youtube.mjs'
import { Figure } from './figure.mjs'
import { ReadMore } from './read-more.mjs'
import { Tab, Tabs } from './tabs.mjs'
import { TabbedExample as Example } from './tabbed-example.mjs'
import { HttpMethod, HttpStatusCode } from './http.mjs'

const FIXME = <p>FIXME</p>
const Comment = (props) => <Popout {...props} comment />
const Fixme = (props) => <Popout {...props} fixme />
const Link = (props) => <Popout {...props} link />
const Note = (props) => <Popout {...props} note />
const Related = (props) => <Popout {...props} related />
const Tip = (props) => <Popout {...props} tip />
const Warning = (props) => <Popout {...props} warning />
const pre = (props) => <Highlight {...props} />
const table = (props) => (
  <table {...props} className="mdx-table table-auto w-full">
    {props.children}
  </table>
)

export const MdxComponents = {
  // Custom components
  Method: HttpMethod,
  StatusCode: HttpStatusCode,
  Comment,
  Fixme,
  Link,
  Note,
  ReadMore,
  Related,
  Tip,
  Warning,
  YouTube,
  pre,
  img: Figure,
  table,
  Tab,
  Tabs,
  Example,
  PatternDocs: FIXME,
  PatternOptions: FIXME,
}
