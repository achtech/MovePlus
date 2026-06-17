import { AbstractControl, FormGroup } from '@angular/forms';

export const FORM_SAVE_ERROR =
  'Impossible d\'enregistrer. Vérifiez les données et réessayez.';

/** Returns true when a control was touched and is invalid. */
export function isFieldInvalid(form: FormGroup, fieldName: string): boolean {
  const control = form.get(fieldName);
  return !!(control && control.invalid && control.touched);
}

/** Short inline message for a single invalid field (under the input). */
export function getFieldErrorMessage(
  form: FormGroup,
  fieldName: string,
  label: string
): string | null {
  const control = form.get(fieldName);
  if (!control?.invalid || !control.touched) {
    return null;
  }
  return describeControlErrors(control, label);
}

/** Extracts a readable message from an HTTP error response. */
export function getApiErrorMessage(err: unknown, fallback = FORM_SAVE_ERROR): string {
  const body = (err as { error?: unknown })?.error;

  if (typeof body === 'string' && body.trim()) {
    try {
      const parsed = JSON.parse(body) as { message?: string };
      if (typeof parsed?.message === 'string' && parsed.message.trim()) {
        return parsed.message.trim();
      }
    } catch {
      return body.trim();
    }
  }

  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }
  }

  if (body && typeof body === 'object' && 'error' in body) {
    const error = (body as { error: unknown }).error;
    if (typeof error === 'string' && error.trim() && error !== 'Internal Server Error') {
      return error.trim();
    }
  }

  const status = (err as { status?: number })?.status;
  if (status === 0) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
  }
  if (status === 403) {
    return 'Vous n\'avez pas les droits pour effectuer cette action.';
  }

  return fallback;
}

/** Marks controls touched and returns a detailed message when the form is invalid. */
export function getFormValidationMessage(
  form: FormGroup,
  fieldLabels: Record<string, string>
): string | null {
  if (form.valid) {
    return null;
  }

  form.markAllAsTouched();

  const issues: string[] = [];
  const seen = new Set<string>();

  for (const [key, label] of Object.entries(fieldLabels)) {
    const control = form.get(key);
    if (!control?.invalid || seen.has(key)) {
      continue;
    }
    const detail = describeControlErrors(control, label);
    if (detail) {
      issues.push(detail);
      seen.add(key);
    }
  }

  for (const key of Object.keys(form.controls)) {
    if (seen.has(key)) {
      continue;
    }
    const control = form.get(key);
    if (!control?.invalid) {
      continue;
    }
    const label = fieldLabels[key] ?? key;
    const detail = describeControlErrors(control, label);
    if (detail) {
      issues.push(detail);
      seen.add(key);
    }
  }

  if (issues.length === 0) {
    return 'Veuillez corriger les erreurs du formulaire.';
  }
  if (issues.length === 1) {
    return issues[0];
  }
  return `Veuillez corriger les champs suivants : ${issues.join(' ; ')}.`;
}

function describeControlErrors(control: AbstractControl, label: string): string | null {
  if (!control.invalid) {
    return null;
  }

  const errors = control.errors;
  if (!errors) {
    return `${capitalize(label)} : valeur invalide.`;
  }

  if (errors['required']) {
    return `${capitalize(label)} : champ obligatoire.`;
  }
  if (errors['email']) {
    return `${capitalize(label)} : adresse email invalide.`;
  }
  if (errors['minlength']) {
    const min = errors['minlength'].requiredLength;
    return `${capitalize(label)} : minimum ${min} caractère${min > 1 ? 's' : ''}.`;
  }
  if (errors['maxlength']) {
    const max = errors['maxlength'].requiredLength;
    return `${capitalize(label)} : maximum ${max} caractère${max > 1 ? 's' : ''}.`;
  }
  if (errors['min']) {
    return `${capitalize(label)} : valeur minimum ${errors['min'].min}.`;
  }
  if (errors['max']) {
    return `${capitalize(label)} : valeur maximum ${errors['max'].max}.`;
  }
  if (errors['pattern']) {
    return `${capitalize(label)} : format invalide.`;
  }
  if (errors['passwordMismatch']) {
    return `${capitalize(label)} : ne correspond pas au mot de passe.`;
  }
  if (errors['futureDate']) {
    return `${capitalize(label)} : la date ne peut pas être dans le futur.`;
  }

  return `${capitalize(label)} : valeur invalide.`;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}
