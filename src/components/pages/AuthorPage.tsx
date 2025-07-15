"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthor } from "@/actions/actions";
import { AuthorWithTasks, BadgeVariant } from "@/lib/types";
import TaskCard from "../TaskCard";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleUser, User } from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

type AuthorPageProps = {
  id: string;
};

const AuthorPage = ({ id }: AuthorPageProps) => {
  const [search, setSearch] = useState("");
  const { data: authorData } = useQuery<AuthorWithTasks>({
    queryKey: ["author", id],
    queryFn: () => getAuthor(id),
    enabled: !!id,
  });

  const filteredTasks = authorData?.tasks.filter((task) => {
    const query = search.toLowerCase();
    return (
      task.id.toLowerCase().includes(query) ||
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  //Clear filters
  const handleClear = () => {
    setSearch("");
  };

  const isSearched = search !== "";

  const formattedRole = authorData?.role
    ? authorData.role.toLowerCase().replace(/^./, (c) => c.toUpperCase())
    : "";

  const role = authorData?.role.toLowerCase() as BadgeVariant;

  return (
    <main className="w-screen px-fluid py-fluid flex flex-col md:flex-row">
      <section className="md:w-1/4 pb-6">
        <div className="flex flex-col gap-y-4">
          <span>
            <User className="flex-1 responsive-user rounded-full text-muted-foreground " />
          </span>
          <div className="flex flex-row gap-x-4 flex-wrap">
            <h1 className="responsive-h1">{authorData?.name}</h1>
            <h2>
              <Badge className="responsive-h1" variant={role ?? "default"}>
                {formattedRole}
              </Badge>
            </h2>
          </div>
          <h2 className="responsive-h2">
            <Label className="text-muted-foreground">Email:</Label>
            {authorData?.email}
          </h2>
        </div>
      </section>
      <section className="md:w-3/4">
        <div className="flex flex-row gap-x-2 pb-4">
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border xs:w-full sm:w-[20rem] md:w-[20rem] duration-200 ease-in-out rounded-md border-3 border-input transition-colors hover:border-chart-1"
          />

          <Button
            variant={isSearched ? "destructive" : "muted"}
            onClick={() => handleClear()}
          >
            Clear
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {authorData?.tasks && authorData.tasks.length > 0 ? (
            filteredTasks?.map((task) => (
              <div
                key={task.id}
                className="flex-1 sm:w-screen min-w-[15rem] md:min-w-[18rem]"
              >
                <TaskCard task={task} />
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default AuthorPage;
