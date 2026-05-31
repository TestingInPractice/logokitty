import { useNavigate } from 'react-router-dom'

export default function Feed() {
  const n = useNavigate()
  return (
    <div className="page">
      <h2>Лента</h2>
      <button className="btn btn-primary" onClick={() => n('/child')}>К ребёнку</button>
    </div>
  )
}
