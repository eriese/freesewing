import { useState } from 'react'
import { DownIcon } from 'shared/components/icons.mjs'
import Link from 'next/link'
// line 17 changes text colour on buttons
// group-hover:bg-primary-focus group-hover:bg-secondary-focus group-hover:bg-accent-focus
// focus:bg-primary-focus focus:bg-secondary-focus focus:bg-accent-focus
const OpenTitleButton = ({
  title,
  toggle,
  color = 'primary',
  openButtons = [],
  bottom = false,
}) => (
  <div
    role="button"
    className={`group
    flex flex-row items-center justify-between w-full max-w-full ${
      bottom ? 'rounded-b-lg' : 'rounded-t-lg'
    } 
      bg-${color} text-${color}-content px-4 py-1 text-lg font-medium`}
    onClick={toggle}
  >
    {
      <DownIcon
        tabIndex="-1"
        className={`rotate-180 w-6 h-6 mr-4 shrink-0 
    group-hover:bg-${color}-focus rounded focus:outline focus:outline-current`}
      />
    }
    {!bottom && title}
    <div className="flex flex-row items-center gap-2 z-5">{openButtons}</div>
  </div>
)

/** hover:bg-primary hover:bg-secondary hover:bg-accent */
/** peer-checked:bg-primary peer-checked:bg-secondary peer-checked:bg-accent */
/** peer-checked:text-primary-content peer-checked:text-secondary-content peer-checked:text-accent-content */
export const Collapse = ({
  title,
  openTitle = false,
  children = [],
  buttons = [],
  top = true,
  bottom = false,
  color = 'primary',
  opened = false,
  toggle = false,
  toggleClasses = '',
  onClick = false,
  openButtons = null,
  className = '',
}) => {
  const [id] = useState(Date.now())
  return (
    <div className={`mb-4`}>
      <input
        id={id}
        type="checkbox"
        className="peer appearance-none h-0 block"
        defaultChecked={opened}
      />
      <label
        htmlFor={id}
        className={`${className}
    ${/** classes used by open and closed states*/ ''}
    text-base-content py-1 px-4 w-full
    flex flex-row gap-4 items-center justify-start cursor-pointer
    ${/** classes used by the closed state */ ''}
    hover:bg-${color} hover:bg-opacity-30 shadow 
    border-l-[5px] border-${color} py-2
    ${/** classes used by the open state */ ''}
    peer-checked:bg-${color} peer-checked:text-${color}-content peer-checked:rounded-t-lg
    peer-checked:shadow-transparent peer-checked:py-1 peer-checked:anything
    ${/** hide it in the open state if there shouldn't be a top */ ''}
    ${top || 'peer-checked:hidden'}`}
      >
        <DownIcon className="shrink-0 h-6 w-6 peer-focus:outline anything:rotate-180" />
        {title}
        {toggle ? <button className={toggleClasses}>{toggle}</button> : buttons}
      </label>
      <div
        className={`p-4 hidden peer-checked:block border-x border-${color} ${
          !bottom && 'border-b rounded-b-lg'
        }`}
      >
        {children}
      </div>
      {bottom && (
        <label
          htmlFor={id}
          className={`bg-${color} text-${color}-content px-4 py-1 text-lg font-medium w-full hidden peer-checked:block rounded-b-lg cursor-pointer`}
        >
          <DownIcon className="shrink-0 h-6 w-6 inline-block rotate-180" />
        </label>
      )}
    </div>
  )
  // const [open, setOpen] = useState(opened)

  // const TitleBtn = ({ bottom }) =>
  //   open ? (
  //     <OpenTitleButton
  //       title={openTitle || title}
  //       toggle={() => setOpen(false)}
  //       {...{ color, openButtons, bottom }}
  //     />
  //   ) : null

  // return open ? (
  //   <div className={`shadow my-4 w-full mx-auto  lg:mx-0`}>
  //     {top ? <TitleBtn /> : null}
  //     <div
  //       className={`p-2 lg:p-4 border-solid border border-${color} ${
  //         !bottom ? 'rounded-b-lg' : ''
  //       } ${!top ? 'rounded-t-lg' : ''}`}
  //     >
  //       {children}
  //     </div>
  //     {bottom ? <TitleBtn bottom /> : null}
  //   </div>
  // ) : (
  //   <div className={`flex flex-row gap-2 my-4 items-center ${className}`}>
  //     <div
  //       className={`shadow border-solid border-l-[6px] border-r-0 border-t-0 border-b-0 border-${color} min-h-12 text-base-content
  //           grow flex flex-row gap-4 py-1 px-4 items-center justify-start hover:cursor-pointer hover:bg-${color} hover:bg-opacity-30`}
  //       onClick={onClick ? onClick : () => setOpen(true)}
  //     >
  //       <span className="shrink-0">
  //         <DownIcon />
  //       </span>{' '}
  //       {title}
  //       {toggle ? (
  //         <button onClick={() => setOpen(true)} className={toggleClasses}>
  //           {toggle}
  //         </button>
  //       ) : (
  //         buttons
  //       )}
  //     </div>
  //   </div>
  // )
}

export const MimicCollapseLink = ({
  title,
  buttons = [],
  color = 'primary',
  href = '/',
  className = '',
}) => (
  <Link className={`flex flex-row gap-2 my-4 items-center ${className}`} href={href}>
    <div
      className={`shadow border-solid border-l-[6px] border-r-0 border-t-0 border-b-0 border-${color} min-h-12
          grow flex flex-row gap-4 py-1 px-4 items-center justify-start hover:cursor-pointer hover:bg-${color} hover:bg-opacity-20`}
    >
      {title}
    </div>
    {buttons}
  </Link>
)

export const useCollapseButton = () => {
  // Shared state
  const [open, setOpen] = useState(false)

  // Method to allow closing the button
  const close = () => setOpen(false)

  // The component
  const CollapseButton = ({
    title,
    openTitle = false,
    children = [],
    className = 'btn btn-lg btn-primary',
    top = true,
    bottom = false,
    color = 'primary',
  }) => {
    const titleBtn = open ? (
      <OpenTitleButton title={openTitle || title} toggle={() => setOpen(false)} color={color} />
    ) : null

    return open ? (
      <div className={`shadow border-solid border rounded-lg border-${color} mb-2 mt-4`}>
        {top ? titleBtn : null}
        <div className="p-4">{children}</div>
        {bottom ? titleBtn : null}
      </div>
    ) : (
      <button className={className} onClick={() => setOpen(true)}>
        {title}
      </button>
    )
  }

  return { CollapseButton, closeCollapseButton: close }
}
