import './Button.scss'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false 
}) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
