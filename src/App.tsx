import { Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import '@ionic/react/css/core.css'
import { HomePage } from './pages/home'
import { WorkoutsPage } from './pages/workouts'
import { ExercisesPage } from './pages/exercises'
import { SettingsPage } from './pages/settings'

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={HomePage} exact={true} />
          <Route path="/workouts" component={WorkoutsPage} exact={true} />
          <Route path="/exercises" component={ExercisesPage} exact={true} />
          <Route path="/settings" component={SettingsPage} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
