import './StarBorder.css'

export default function StarBorder({
  as: Component = 'div',
  children,
  className = '',
  style = {},
  ...props
}) {
  return (
    <Component className={`star-border-container ${className}`} style={style} {...props}>
      <div className="star-border-content">
        {children}
      </div>
    </Component>
  )
}
