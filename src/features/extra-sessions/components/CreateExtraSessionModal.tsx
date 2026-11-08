"use client";

import {
  ExtraSessionModal,
  type ExtraSessionModalProps,
} from "./ExtraSessionModal";

export type CreateExtraSessionModalProps = Omit<ExtraSessionModalProps, "session">;

export function CreateExtraSessionModal(props: CreateExtraSessionModalProps) {
  return <ExtraSessionModal {...props} />;
}
