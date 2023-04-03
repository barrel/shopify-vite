import { useState } from 'react'
import Header from '@/components/Header'

function App () {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header />
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
