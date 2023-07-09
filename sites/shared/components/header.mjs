import Link from 'next/link'

export const colors = [
  'rainbow-red',
  'rainbow-orange',
  'rainbow-yellow',
  'rainbow-lime',
  'rainbow-green',
  'rainbow-teal',
  'rainbow-cyan',
  'rainbow-blue',
  'rainbow-indigo',
  'rainbow-violet',
  'rainbow-purple',
]

export const NavButton = ({
  href,
  label,
  color,
  children,
  onClick = false,
  extraClasses = '',
  active = false,
}) => {
  const className =
    'border-0 px-1 xl:px-4 text-base py-3 lg:py-4 text-center flex flex-col items-center 2xl:w-36 ' +
    `hover:bg-${color} text-${color} hover:text-neutral grow lg:grow-0 relative ${extraClasses} ${
      active ? 'font-heavy' : ''
    }`
  const span = <span className="font-bold hidden lg:block">{label}</span>

  return onClick ? (
    <button {...{ onClick, className }} title={label}>
      {children}
      {span}
    </button>
  ) : (
    <Link {...{ href, className }} title={label}>
      {children}
      {span}
    </Link>
  )
}

export const NavSpacer = () => (
  <div className="hidden xl:block text-base lg:text-4xl font-thin opacity-30 px-0.5 lg:px-2">|</div>
)
