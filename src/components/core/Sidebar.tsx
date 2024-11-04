import logo from "@/assets/logo.png";
import SidebarButton from "./SidebarButton";
import { useCounterState } from "@/hooks/useCounter";

export default function Sidebar() {
  const counter = useCounterState();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-80 border-r border-primary-950 flex flex-col bg-white">
      <div className="flex items-center justify-center">
        <img className="h-[140px]" src={logo} alt="logo" />
      </div>
      <div className="flex-1 p-5 flex flex-col items-stretch space-y-5 overflow-y-scroll">
        {counter.status == "loaded" ? (
          counter.services.map((service) => (
            <SidebarButton
              key={service.id}
              label={service.title}
              href={`/app/initial-bill/${service.id}`}
            />
          ))
        ) : (
          <div>Hello</div>
        )}
      </div>
    </aside>
  );
}
