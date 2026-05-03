import { LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-[#64748B]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#64748B] max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
