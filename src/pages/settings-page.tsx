import SettingsCard from "@/components/core/SettingsCard";
import { useSystemState, useSystemUpdateContactInfo } from "@/hooks/useSystem";

export default function SettingsPage() {
  const system = useSystemState();
  const updateContactInfo = useSystemUpdateContactInfo();

  if (system.status == "loaded") {
    return (
      <div className="mx-auto max-w-3xl py-10 space-y-5">
        <SettingsCard
          label="Counter Name"
          value={system.counter.name}
          description="Name of this counter shown in bill reciept"
        />
        <SettingsCard
          label="Contact Info"
          value={system.counter.contactInfo}
          description="Contact info shown in bill receipts"
          onSave={updateContactInfo}
        />
      </div>
    );
  }

  return null;
}
