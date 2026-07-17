import {BottomBar, BottomBarItem} from "@sytechui/react";

const iconPaths = {
  home: "M3.5 10.8 12 3.7l8.5 7.1v8.5a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7v-8.5ZM9 21v-6h6v6",
  search: "m17 17 4 4m-4-10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
  activity: "M3 12h4l2.3-6 4.2 12 2.3-6H21",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 9c.5-4.2 3.2-6.5 7.5-6.5s7 2.3 7.5 6.5",
};

function Icon({name, selected = false}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={selected ? 2.5 : 1.8}
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

const items = [
  {key: "home", label: "Home"},
  {key: "search", label: "Search"},
  {key: "activity", label: "Activity"},
  {key: "profile", label: "Profile"},
];

export default function App() {
  return (
    <BottomBar aria-label="Primary navigation" defaultSelectedKey="home">
      {items.map((item) => (
        <BottomBarItem
          key={item.key}
          icon={<Icon name={item.key} />}
          selectedIcon={<Icon selected name={item.key} />}
        >
          {item.label}
        </BottomBarItem>
      ))}
    </BottomBar>
  );
}
