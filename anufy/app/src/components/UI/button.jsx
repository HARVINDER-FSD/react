"use client"

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseClasses = "button"
  const variantClasses = {
    primary: "button-primary",
    secondary: "button-secondary",
    outline: "button-outline",
  }
  const sizeClasses = {
    small: "button-small",
    medium: "button-medium",
    large: "button-large",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
