import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

type AuthorSkeletonProps = {
  cardCount: number;
  leftSide?: boolean;
  rightSide?: boolean;
  searchBar?: boolean;
};

const AuthorSkeleton = ({
  cardCount,
  leftSide = true,
  rightSide = true,
  searchBar = false,
}: AuthorSkeletonProps) => {
  return (
    <div className={cn("w-screen flex flex-col md:flex-row gap-4")}>
      {leftSide && (
        <div className="flex flex-col md:w-1/4 pb-6 gap-y-4">
          <Skeleton className="responsive-user" />
          <Skeleton className="responsive-h1 max-w-[15rem] h-[2.5rem]" />
          <Skeleton className="responsive-h1 max-w-[15rem] h-[2.5rem]" />
        </div>
      )}
      {rightSide && (
        <div className="md:w-3/4 flex flex-col gap-4">
          {searchBar && (
            <div className="flex flex-row gap-2">
              <Skeleton className="w-[20rem] h-[2.5rem] border-2" />
              <Skeleton className="w-[4rem] h-[2.5rem] border-2" />
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: cardCount }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[15rem] md:min-w-[18rem]">
                <Skeleton className="h-[30rem] w-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorSkeleton;
