import { IonReactRouter } from '@ionic/react-router'

import { Redirect, Route } from 'react-router'
import {
  homeOutline,
  barbellOutline,
  flashOutline,
  settingsOutline,
} from 'ionicons/icons'
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react'
import { RouterConstants } from '../../constants/router'
import {
  ExercisesPage,
  HomePage,
  SettingsPage,
  WorkoutsPage,
} from '../../pages'

export function Tabs() {
  const { Paths, Names } = RouterConstants.Tabs

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to={Paths.HOME} />

          <Route path={Paths.HOME} render={() => <HomePage />} exact={true} />
          <Route
            path={Paths.WORKOUTS}
            render={() => <WorkoutsPage />}
            exact={true}
          />
          <Route
            path={Paths.EXERCISES}
            render={() => <ExercisesPage />}
            exact={true}
          />
          <Route
            path={Paths.SETTINGS}
            render={() => <SettingsPage />}
            exact={true}
          />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab={Names.HOME} href={Paths.HOME}>
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab={Names.WORKOUTS} href={Paths.WORKOUTS}>
            <IonIcon icon={barbellOutline} />
            <IonLabel>Workouts</IonLabel>
          </IonTabButton>

          <IonTabButton tab={Names.EXERCISES} href={Paths.EXERCISES}>
            <IonIcon icon={flashOutline} />
            <IonLabel>Exercises</IonLabel>
          </IonTabButton>

          <IonTabButton tab={Names.SETTINGS} href={Paths.SETTINGS}>
            <IonIcon icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )
}
