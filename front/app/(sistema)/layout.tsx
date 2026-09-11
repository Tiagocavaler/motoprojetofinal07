export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-[#020617]">
      {children}
    </div>
  );
}