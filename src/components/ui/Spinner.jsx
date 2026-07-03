export default function Spinner({ className = "" }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-pink-500 ${className}`}
    />
  )
}