import StockDisplay from './StockDisplay'
import RevealDeck from './RevealDeck'

function App() {
  const mode = new URLSearchParams(window.location.search).get('mode')

  return mode === 'reveal' ? <RevealDeck /> : <StockDisplay />
}

export default App
