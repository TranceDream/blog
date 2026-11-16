export function syncDialogScrollLock() {
  document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
}

export function openDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return;
  document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((other) => {
    if (other !== dialog) other.close();
  });
  if (!dialog.open) dialog.showModal();
  syncDialogScrollLock();
}

export function closeDialog(dialog: HTMLDialogElement | null) {
  dialog?.close();
  syncDialogScrollLock();
}
