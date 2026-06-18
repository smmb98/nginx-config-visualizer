import { useAppStore } from '@/store/useAppStore'
import { LandingPage } from '@/components/LandingPage'
import { Workspace } from '@/components/Workspace'

function App() {
  const { isInitialized } = useAppStore()

  return isInitialized ? <Workspace /> : <LandingPage />
}

export default App;
