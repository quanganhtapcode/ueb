import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/orders', label: 'Đơn hàng' },
  { to: '/matches', label: 'Khớp lệnh' },
  { to: '/messages', label: 'Tin nhắn' },
];

export default function PageNav() {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `rounded-md border px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
