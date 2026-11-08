"use client";

import {
  ExtraSessionModal,
  type ExtraSessionModalProps,
} from "./ExtraSessionModal";

export type EditExtraSessionModalProps = {
  groupId?: string;
  isOpen: boolean;
  onClose: () => void;
  session: ExtraSessionModalProps["session"];
};

export function EditExtraSessionModal({
  groupId,
  session,
  ...props
}: EditExtraSessionModalProps) {
  return (
    <ExtraSessionModal
      groupId={groupId || session?.groupId || ""}
      session={session}
      {...props}
    />
  );
}
