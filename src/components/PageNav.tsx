import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/orders', label: 'Đơn hàng' },
  { to: '/matches', label: 'Khớp lệnh' },
  { to: '/messages', label: 'Tin nhắn' },
];

export default function PageNav() {
  return (
    <nav className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex w-max min-w-full gap-2 pb-1 md:min-w-0">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
      </div>
    </nav>
  );
}
