import AuthorSkeleton from "@/components/ui/author-skeleton";

export default function Loading() {
  return (
    <div className="w-screen px-fluid py-fluid flex flex-col md:flex-row">
      <AuthorSkeleton cardCount={6} searchBar={true} />;
    </div>
  );
}
