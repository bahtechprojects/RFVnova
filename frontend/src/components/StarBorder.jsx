import './StarBorder.css'

export default function StarBorder({
  as: Component = 'div',
  children,
  className = '',
  color = '#8b5cf6',
  speed = '6s',
  style = {},
  ...props
}) {
  return (
    <Component className={`star-border-container ${className}`} style={style} {...props}>
      <div
        className="star-border-glow"
        style={{
          '--star-color': color,
          '--star-speed': speed,
        }}
      />
      <div className="star-border-content">
        {children}
      </div>
    </Component>
  )
}
