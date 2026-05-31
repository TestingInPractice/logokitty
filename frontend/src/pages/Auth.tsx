import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { db } from '../api/db'

export default function Auth() {
  const n = useNavigate(); const setUser = useStore(s => s.setUser); const setPage = useStore(s => s.setPage)
  const [name,setName] = useState(''); const [cn,setCn] = useState(''); const [age,setAge] = useState('3')
  const [catN,setCatN] = useState(''); const [catC,setCatC] = useState('orange')

  const handleCreate = () => {
    if (!cn.trim()) return
    const user = { id:crypto.randomUUID(), name:name.trim()||'Родитель', createdAt:Date.now() }
    setUser(user); db.setUser(user)
    const child = { id:crypto.randomUUID(), userId:user.id, name:cn.trim(), age:parseInt(age)||3, level:1, exp:0, foodBalance:50, goldBalance:0, lastDailyRewardAt:null, createdAt:Date.now() }
    db.setChildren([child]); useStore.getState().setChildren([child]); useStore.getState().setActiveChildId(child.id)
    const cat = { id:crypto.randomUUID(), childId:child.id, name:catN.trim()||'Коксик', color:catC, equippedItems:[] }
    db.saveCat(cat); useStore.getState().setCat(cat); setPage('feed'); n('/feed')
  }

  return <div className="page">
    <div className="text-center" style={{paddingTop:40}}>
      <div style={{fontSize:64,marginBottom:8}}>🐱</div>
      <div className="text-xl">Логокотик</div>
      <div className="text-muted mt-8">Логопедическое приложение для детей 2–8 лет</div>
    </div>
    <div className="card mt-16"><div className="col gap-16">
      <div><label style={{fontWeight:600,fontSize:14,display:'block',marginBottom:6}}>Ваше имя</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Мама / Папа"
          style={{width:'100%',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'2px solid #f0e8e0',fontSize:16,outline:'none'}}/></div>
      <div><label style={{fontWeight:600,fontSize:14,display:'block',marginBottom:6}}>Имя ребёнка</label>
        <input value={cn} onChange={e=>setCn(e.target.value)} placeholder="Малыш"
          style={{width:'100%',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'2px solid #f0e8e0',fontSize:16,outline:'none'}}/></div>
      <div><label style={{fontWeight:600,fontSize:14,display:'block',marginBottom:6}}>Возраст</label>
        <input type="number" min="2" max="8" value={age} onChange={e=>setAge(e.target.value)}
          style={{width:'100%',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'2px solid #f0e8e0',fontSize:16,outline:'none'}}/></div>
      <button className="btn btn-outline" onClick={()=>{setName('Анна');setCn('Миша');setAge('3');setCatN('Барсик')}}>
        🧪 Заполнить тестовыми данными
      </button>
    </div></div>
    <div className="card mt-16">
      <div className="text-center mb-8" style={{fontWeight:600}}>Создай котика</div>
      <div className="text-center mb-8" style={{fontSize:60}}>{catC==='orange'?'🟠':catC==='gray'?'🔘':catC==='white'?'⚪':catC==='black'?'⚫':'🟤'}</div>
      <input value={catN} onChange={e=>setCatN(e.target.value)} placeholder="Имя котика"
        style={{width:'100%',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'2px solid #f0e8e0',fontSize:16,outline:'none',marginBottom:8,textAlign:'center'}}/>
      <div className="flex gap-8 justify-center" style={{flexWrap:'wrap'}}>
        {['orange','gray','white','black','brown'].map(c =>
          <button key={c} onClick={()=>setCatC(c)}
            style={{width:36,height:36,borderRadius:'50%',border:catC===c?'3px solid var(--orange)':'3px solid transparent',
              background:c==='orange'?'#FF9E5E':c==='gray'?'#A0A0A0':c==='white'?'#F5F5F5':c==='black'?'#333':'#8B6914'}}/>)}
      </div>
    </div>
    <button className="btn btn-primary mt-16" onClick={handleCreate}>Начать заниматься!</button>
  </div>
}
