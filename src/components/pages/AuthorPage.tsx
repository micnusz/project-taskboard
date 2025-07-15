"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthor } from "@/actions/actions";
import { AuthorWithTasks } from "@/lib/types";
import TaskCard from "../TaskCard";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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

  return (
    <main className="w-screen px-fluid py-fluid flex flex-col md:flex-row">
      <section className="md:w-1/3">
        <div>
          <h1>{authorData?.name}</h1>
          <h2>{authorData?.role}</h2>
          <h2>{authorData?.email}</h2>
        </div>
      </section>
      <section className="md:w-2/3">
        <div className="flex flex-row gap-x-2 pb-4">
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border xs:w-full sm:w-[20rem] md:w-[20rem] duration-200 ease-in-out rounded-md border-3 border-input transition-colors hover:border-chart-1"
          />
          {isSearched && (
            <Button variant="destructive" onClick={() => handleClear()}>
              Clear
            </Button>
          )}
        </div>
        <div className="flex flex-row flex-wrap gap-4">
          {authorData?.tasks && authorData.tasks.length > 0 ? (
            filteredTasks?.map((task) => <TaskCard task={task} key={task.id} />)
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default AuthorPage;
