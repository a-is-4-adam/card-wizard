export function Footer({ children }: React.PropsWithChildren) {
  return (
    <footer className="sticky  bottom-0 left-0 right-0 w-full bg-white border-t-2 border-gray-200 ">
      <div className="max-w-3xl mx-auto flex justify-between p-4">
        {children}
      </div>
    </footer>
  );
}
