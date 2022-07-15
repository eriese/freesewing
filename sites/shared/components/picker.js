import {forwardRef} from 'react'
import { Menu } from '@headlessui/react'
import Link from 'next/link'

/** an accessible dropdown menu for use by picker components */
export const Picker = ({Icon, className, title, ariaLabel, iconOnly=false, children, end}) => {

	return (<Menu as="div" className={`dropdown w-auto ${end ? 'dropdown-end' : ''}`}>
		<Menu.Button className={iconOnly
			? `btn btn-sm`
			: `m-0 btn btn-neutral flex flex-row gap-2
			hover:bg-neutral-content hover:border-neutral-content hover:text-neutral
			`}
			aria-label={ariaLabel}>
			<Icon />
			{!iconOnly && <span>{title}</span>}
		</Menu.Button>
		<Menu.Items as="ul" className={`p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 ${className}`}>
		 {children}
		</Menu.Items>
	</Menu>)
}

/** get the menu item's class based on whether it's active */
const itemClass = (active) => "btn btn-ghost " + (active ? 'bg-base-200' : '')

/**
 * a menu item that has a link in it
 *
 * Expected Props:
 ** href: the href for the link
 ** locale?: the locale the link links to
 * */
export const PickerLink = (props) => {
	return (<li role="menuitem">
		<Menu.Item>
			{({active}) => (<ForwardLink active={active} {...props}></ForwardLink>)}
		</Menu.Item>
	</li>)
}

/**
 * Necessary to have keyboard enter 'click' events passed to the link */
const ForwardLink = forwardRef(({href, locale, active, children, ...rest}, ref) => (
	<Link href={href} locale={locale}>
  	<a className={itemClass(active)} {...rest} role={undefined} ref={ref}>
  		<span className="text-base-content">
    		{children}
  		</span>
  	</a>
	</Link>
))

/** a menu item that is a button */
export const PickerButton = ({onClick, children}) => {
	return (<Menu.Item as="li" onClick={onClick}>
    {({ active }) => (
      <button className={itemClass(active)}>
      	<span className="text-base-content">
      		{children}
      	</span>
      </button>
    )}
  </Menu.Item>)
}
