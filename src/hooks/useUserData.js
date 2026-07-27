import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import defaultState from '../utils/defaultState'

// Sincroniza um único documento Firestore (users/{uid}) com o estado do
// app. Toda a "casa" do usuário fica guardada nesse documento único,
// o que simplifica MUITO a leitura/escrita para o escopo deste app.
export function useUserData(uid) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const ref = doc(db, 'users', uid)
    const unsub = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setData(snap.data())
      } else {
        await setDoc(ref, defaultState)
        setData(defaultState)
      }
      setLoading(false)
    })
    return unsub
  }, [uid])

  async function update(partial) {
    if (!uid) return
    const ref = doc(db, 'users', uid)
    setData((prev) => ({ ...prev, ...partial }))
    await setDoc(ref, partial, { merge: true })
  }

  return { data, update, loading }
}
