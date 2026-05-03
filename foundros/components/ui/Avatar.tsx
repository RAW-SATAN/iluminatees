import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
};

export default function Avatar({ name, photoUrl, size = "md" }: Props) {
  const initials = getInitials(name);
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className={cn("rounded-full object-cover shrink-0", sizes[size])}
      />
    );
  }
  return (
    <div className={cn("rounded-full bg-[#1A1A2E] text-white flex items-center justify-center font-semibold shrink-0", sizes[size])}>
      {initials}
    </div>
  );
}
