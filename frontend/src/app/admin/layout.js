export const metadata = {
  title: "Admin",
  description: "Admin section",
};

export default function AdminLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  );
}
