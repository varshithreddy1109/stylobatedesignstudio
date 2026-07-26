export default function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink text-paper">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-brass" />
      <p className="label-tag text-stone">Verifying session…</p>
    </div>
  );
}
