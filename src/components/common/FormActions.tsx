import { ModalActions, type ModalActionsProps } from "./ModalActions";

export type FormActionsProps = ModalActionsProps;

export function FormActions(props: FormActionsProps) {
  return <ModalActions {...props} />;
}
