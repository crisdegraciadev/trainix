import { useState } from 'react';
import { LogoIcon } from '../icons';
import { Flash, Home, LogoutCurve, Setting2, Weight } from 'iconsax-react';

type Tabs = 'dashboard' | 'workouts' | 'exercises' | 'settings' | 'logout';

type SidebarItemProps = {
  Icon: React.ComponentType;
  text: string;
  activeTab: Tabs;
  currentTab: Tabs;
  handleClick: () => void;
};

function SidebarItem({ Icon, text, activeTab, currentTab, handleClick }: SidebarItemProps) {
  return (
    <li
      className={`cursor-pointer flex py-7 ${activeTab === currentTab ? 'text-white' : 'text-violet'}`}
      onClick={handleClick}
    >
      <Icon />
      <span className="ml-4">{text}</span>
    </li>
  );
}

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tabs>('dashboard');

  return (
    <div className="h-full bg-blue w-72  flex flex-col items-center justify-between">
      <div className="mt-12 flex">
        <LogoIcon />
        <span className="text-white text-xl not-italic font-bold ml-4">Trainix</span>
      </div>
      <ul className="pb-64">
        <SidebarItem
          Icon={Home}
          text="Dashboard"
          activeTab={activeTab}
          currentTab="dashboard"
          handleClick={() => setActiveTab('dashboard')}
        />

        <SidebarItem
          Icon={Flash}
          text="Workouts"
          activeTab={activeTab}
          currentTab="workouts"
          handleClick={() => setActiveTab('workouts')}
        />

        <SidebarItem
          Icon={Weight}
          text="Exercises"
          activeTab={activeTab}
          currentTab="exercises"
          handleClick={() => setActiveTab('exercises')}
        />
      </ul>
      <ul className="mb-12">
        <SidebarItem
          Icon={Setting2}
          text="Workouts"
          activeTab={activeTab}
          currentTab="settings"
          handleClick={() => setActiveTab('settings')}
        />
        <SidebarItem
          Icon={LogoutCurve}
          text="Workouts"
          activeTab={activeTab}
          currentTab="logout"
          handleClick={() => setActiveTab('logout')}
        />
      </ul>
    </div>
  );
}
