export function SidebarSkeleton() {
  return (
    <aside className="fixed top-0 left-0 h-full w-[60px] bg-grey-700 border-r border-grey-600 hidden md:block z-40" />
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-grey-600 border-b border-grey-400 h-15 w-full" />
  );
}

export function FooterSkeleton() {
  return (
    <div className="py-8 bg-grey-800 h-[400px] w-full" />
  );
}

