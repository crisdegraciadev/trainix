import { IonApp, setupIonicReact } from '@ionic/react'
import { Tabs } from './components'

setupIonicReact()

function App() {
  return (
    <IonApp>
      <Tabs></Tabs>
    </IonApp>
  )
}

export default App
