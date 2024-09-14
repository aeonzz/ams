import { create } from "zustand";

export type DialogType =
  | "commandDialog"
  | "themeCommand"
  | "requestDialog"
  | "jobDialog"
  | "venueDialog"
  | "resourceDialog"
  | "returnableResourceDialog"
  | "supplyResourceDialog"
  | "transportDialog"
  | "settingsDialog"
  | "jobDetailsDialog"
  | "adminCreateVenueDialog"
  | "adminCreateVehicleDialog"
  | "adminUpdateVenueSheet"
  | "adminCreateInventoryItemDialog"
  | "adminUpdateInventoryItemSheet"
  | "adminCreateInventorySubItemDialog"
  | "adminUpdateInventorySubItemDialog"
  | "adminCreateRoleDialog"
  | "adminAssignRoleSheet"
  | "adminAssignSectionDialog"
  | "adminUpdateRoleSheet"
  | "adminDeleteRoleDialog"
  | "adminCreateJobSectionDialog"
  | "adminUpdateJobSectionSheet"
  | "adminCreateUserRoleDialog"
  | null;

export interface DialogState {
  activeDialog: DialogType;
  setActiveDialog: (dialog: DialogType) => void;
  isAnyDialogOpen: () => boolean;
}

export const useDialogManager = create<DialogState>((set, get) => ({
  activeDialog: null,
  setActiveDialog: (dialog) => set({ activeDialog: dialog }),
  isAnyDialogOpen: () => get().activeDialog !== null,
}));
