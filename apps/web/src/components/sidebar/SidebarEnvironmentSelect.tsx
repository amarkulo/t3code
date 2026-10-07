/**
 * The sidebar's environment scope: a row above search that narrows the list
 * to one environment's threads and projects. "All environments" heads the
 * list so the way back is one click, and the trigger shows the machine glyph
 * thread rows use, so the active scope reads without opening it.
 */
import type { EnvironmentId, EnvironmentMachineKind } from "@t3tools/contracts";
import { LayersIcon } from "lucide-react";

import { EnvironmentMachineIcon } from "../EnvironmentMachineIcon";
import type { SidebarEnvironmentScopeOption } from "../Sidebar.logic";
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ALL_ENVIRONMENTS_VALUE = "all";

export function SidebarEnvironmentSelect({
  options,
  selected,
  machineById,
  onChange,
}: {
  options: readonly SidebarEnvironmentScopeOption[];
  selected: SidebarEnvironmentScopeOption | null;
  machineById: ReadonlyMap<EnvironmentId, EnvironmentMachineKind>;
  onChange: (environmentId: EnvironmentId | null) => void;
}) {
  return (
    <Select
      value={selected?.environmentId ?? ALL_ENVIRONMENTS_VALUE}
      onValueChange={(next) => {
        onChange(options.find((option) => option.environmentId === next)?.environmentId ?? null);
      }}
    >
      <SelectTrigger variant="ghost" size="sm" className="w-full" aria-label="Environment">
        <SelectValue>
          {selected ? (
            <EnvironmentScopeLabel
              option={selected}
              machine={machineById.get(selected.environmentId)}
            />
          ) : (
            <AllEnvironmentsLabel />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={false}>
        <SelectGroup>
          <SelectGroupLabel>Environment</SelectGroupLabel>
          <SelectItem hideIndicator value={ALL_ENVIRONMENTS_VALUE}>
            <AllEnvironmentsLabel />
          </SelectItem>
          {options.map((option) => (
            <SelectItem hideIndicator key={option.environmentId} value={option.environmentId}>
              <EnvironmentScopeLabel
                option={option}
                machine={machineById.get(option.environmentId)}
              />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectPopup>
    </Select>
  );
}

function AllEnvironmentsLabel() {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <LayersIcon className="size-4" />
      <span className="truncate">All environments</span>
    </span>
  );
}

function EnvironmentScopeLabel({
  option,
  machine,
}: {
  option: SidebarEnvironmentScopeOption;
  machine: EnvironmentMachineKind | undefined;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <EnvironmentMachineIcon kind={machine ?? "server"} className="size-4" />
      <span className="truncate">{option.label}</span>
      {option.offline ? <span className="shrink-0 text-muted-foreground">Offline</span> : null}
    </span>
  );
}
