import { Badge } from "@/components/ui/badge";
import React from "react";

const formatRole = (role: string) => {
  const formatedRole = role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (role === "USER") return <Badge variant="user">{formatedRole}</Badge>;
  if (role === "ADMIN") return <Badge variant="admin">{formatedRole}</Badge>;
  if (role === "MANAGER")
    return <Badge variant="manager">{formatedRole}</Badge>;
  if (role === "DEVELOPER")
    return <Badge variant="developer">{formatedRole}</Badge>;
  else return { role };
};

export default formatRole;
