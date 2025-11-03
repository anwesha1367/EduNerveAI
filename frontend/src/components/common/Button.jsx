import './Button.css'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false 
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'small' ? 'btn-small' : '',
    fullWidth ? 'btn-full' : ''
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
