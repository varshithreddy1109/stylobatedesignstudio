"use client";

import { ChangeEvent, useRef, useState } from "react";
import Button from "@/components/ui/Button";

const labelClass = "font-mono text-[11px] uppercase tracking-widest2 text-stone";
const inputClass =
  "border-b border-hairline bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-ink placeholder:text-stone/60";

interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

export function TextField({
  label,
  name,
  type = "text",
  defaultValue,
  value,
  onChange,
  placeholder,
  required,
  hint,
  error,
}: TextFieldProps) {
  const isControlled = value !== undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        {...(isControlled ? { value, onChange } : { defaultValue })}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        className={inputClass}
      />
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="text-xs text-charcoal/50">{hint}</span>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  rows = 4,
  hint,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={`resize-none ${inputClass}`}
      />
      {hint && <span className="text-xs text-charcoal/50">{hint}</span>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}

export function SelectField({ label, name, options, defaultValue }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className={`${inputClass} appearance-none`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  hint?: string;
  defaultChecked?: boolean;
  name?: string;
}

export function ToggleField({ label, hint, defaultChecked = false, name }: ToggleFieldProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-6 border border-hairline px-5 py-4">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint && <p className="mt-1 text-xs text-charcoal/60">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((prev) => !prev)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 ${
          checked ? "border-brass bg-brass" : "border-hairline bg-charcoal/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform duration-300 ease-studio ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
      {name && <input type="hidden" name={name} value={checked ? "true" : "false"} />}
    </div>
  );
}

interface RatingFieldProps {
  label: string;
  name?: string;
  defaultValue?: number;
}

export function RatingField({ label, name, defaultValue = 5 }: RatingFieldProps) {
  const [rating, setRating] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-6 w-6 transition-colors duration-200 ${
                star <= rating ? "fill-brass text-brass" : "fill-transparent text-hairline"
              }`}
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path
                d="M12 3.5l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.7l-5.2 2.8 1-5.75-4.2-4.1 5.8-.85L12 3.5Z"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
        {name && <input type="hidden" name={name} value={rating} />}
      </div>
    </div>
  );
}

export interface GalleryItem {
  url: string;
  file?: File;
}

interface FileUploadFieldProps {
  label: string;
  hint?: string;
  initialPreviewUrl?: string;
  multiple?: boolean;
  initialPreviewUrls?: string[];
  onFileChange?: (file: File | null) => void;
  onItemsChange?: (items: GalleryItem[]) => void;
}

export function FileUploadField({
  label,
  hint,
  initialPreviewUrl,
  multiple = false,
  initialPreviewUrls,
  onFileChange,
  onItemsChange,
}: FileUploadFieldProps) {
  const [preview, setPreview] = useState<string | undefined>(initialPreviewUrl);
  const [items, setItems] = useState<GalleryItem[]>(
    (initialPreviewUrls ?? []).map((url) => ({ url }))
  );
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      const newItems: GalleryItem[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      const merged = [...items, ...newItems];
      setItems(merged);
      onItemsChange?.(merged);
    } else {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      onFileChange?.(file);
    }
    // Allow selecting the same file again later (e.g. after removing it).
    e.target.value = "";
  }

  function removeItem(idx: number) {
    const filtered = items.filter((_, i) => i !== idx);
    setItems(filtered);
    onItemsChange?.(filtered);
  }

  if (multiple) {
    return (
      <div className="flex flex-col gap-3">
        <span className={labelClass}>{label}</span>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((item, idx) => (
            <div key={item.url + idx} className="relative aspect-square overflow-hidden border border-hairline bg-charcoal/5">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview / remote asset, not optimizable here */}
              <img src={item.url} alt={`Gallery image ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-ink/80 text-paper"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 border border-dashed border-hairline text-stone transition-colors duration-300 hover:border-brass hover:text-brass"
          >
            <span className="text-xl leading-none">+</span>
            <span className="text-[10px] uppercase tracking-widest2">Add</span>
          </button>
        </div>
        {hint && <span className="text-xs text-charcoal/50">{hint}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className={labelClass}>{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex aspect-video w-full max-w-sm items-center justify-center overflow-hidden border border-dashed border-hairline bg-charcoal/[0.02] transition-colors duration-300 hover:border-brass"
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimizable remote asset */}
            <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-xs uppercase tracking-widest2 text-paper opacity-0 transition-all duration-300 group-hover:bg-ink/50 group-hover:opacity-100">
              Replace Image
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-stone">
              <path
                d="M12 15V5m0 0 4 4m-4-4-4 4M5 15v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs text-charcoal/60">Click to upload or drag and drop</span>
          </div>
        )}
      </button>
      {hint && <span className="text-xs text-charcoal/50">{hint}</span>}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  name?: string;
  defaultValue?: string;
}

export function ColorField({ label, name, defaultValue = "#000000" }: ColorFieldProps) {
  const [color, setColor] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <label className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden border border-hairline">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute -left-2 -top-2 h-16 w-16 cursor-pointer"
          />
        </label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className={`${inputClass} w-full`}
        />
        {name && <input type="hidden" name={name} value={color} />}
      </div>
    </div>
  );
}

interface FormActionsProps {
  cancelHref: string;
  saveLabel?: string;
  submitting?: boolean;
}

export function FormActions({ cancelHref, saveLabel = "Save", submitting = false }: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center">
      <Button href={cancelHref} variant="secondary">
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        className="disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Saving…" : saveLabel}
      </Button>
    </div>
  );
}
