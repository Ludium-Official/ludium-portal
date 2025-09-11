import { useDeleteCarouselItemMutation } from "@/apollo/mutation/delete-carousel-item.generated";
import { useCarouselItemsQuery } from "@/apollo/queries/carousel-items.generated";
import { ProgramStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getCurrency, getCurrencyIcon } from "@/lib/utils";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { AgentBreadcrumbs } from "../_components/agent-breadcrumbs";

// Simple Switch component
const Switch = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-foreground" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
};

function BannerAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSwitchStates, setLocalSwitchStates] = useState<
    Record<string, boolean>
  >({});
  const [deleteCarouselItem] = useDeleteCarouselItemMutation();
  const {
    data: carouselData,
    loading,
    error,
    refetch,
  } = useCarouselItemsQuery();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getProgramDetailsUrl = (carouselItem: {
    itemId?: string | null;
    itemType?: string | null;
    data?: { __typename?: string; type?: string | null } | null;
  }) => {
    if (
      carouselItem.itemType === "program" &&
      carouselItem.data?.__typename === "Program"
    ) {
      // Check if it's a funding program
      if (carouselItem.data.type === "funding") {
        return `/investments/${carouselItem.itemId}`;
      }
      return `/programs/${carouselItem.itemId}`;
    }
    return `/programs/${carouselItem.itemId}`;
  };

  const getPostDetailsUrl = (carouselItem: { itemId?: string | null }) => {
    return `/community/posts/${carouselItem.itemId}`;
  };

  const handleSwitchChange = (carouselItemId: string, isActive: boolean) => {
    // Toggle the local state
    setLocalSwitchStates((prev) => ({
      ...prev,
      [carouselItemId]: !isActive,
    }));
    console.log(`Switch toggled for item ${carouselItemId}: ${!isActive}`);
  };

  const handleSaveChanges = async () => {
    if (!carouselData?.carouselItems) return;

    // Find all items that have been toggled to false in local state
    const itemsToDelete = carouselData.carouselItems.filter((item) => {
      const itemId = item.id || "";
      // If item has been toggled in local state and is now false, or if it was originally false and not toggled
      return (
        localSwitchStates[itemId] === false ||
        (!(itemId in localSwitchStates) && !item.isActive)
      );
    });

    if (itemsToDelete.length === 0) {
      console.log("No items to delete");
      return;
    }

    try {
      // Delete all items with disabled switches
      await Promise.all(
        itemsToDelete.map((item) =>
          deleteCarouselItem({
            variables: { id: item.id || "" },
          })
        )
      );

      console.log(`✅ Deleted ${itemsToDelete.length} carousel items`);
      // Clear local state after successful deletion
      setLocalSwitchStates({});
      refetch();
    } catch (error) {
      console.error("❌ Error deleting carousel items:", error);
    }
  };

  // Filter carousel items based on search query
  const filteredCarouselItems =
    carouselData?.carouselItems?.filter((item) => {
      if (!searchQuery.trim()) return true;

      const searchLower = searchQuery.toLowerCase();
      if (item.data?.__typename === "Program") {
        return (
          item.data.name?.toLowerCase().includes(searchLower) ||
          item.data.summary?.toLowerCase().includes(searchLower)
        );
      }
      if (item.data?.__typename === "Post") {
        return (
          item.data.title?.toLowerCase().includes(searchLower) ||
          item.data.summary?.toLowerCase().includes(searchLower)
        );
      }
      return false;
    }) || [];

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex h-12 items-center justify-between pl-4">
            <AgentBreadcrumbs myProfile={true} />
            <div className="relative w-[360px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading carousel items...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex h-12 items-center justify-between pl-4">
            <AgentBreadcrumbs myProfile={true} />
            <div className="relative w-[360px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">
              Error loading carousel items: {error.message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <AgentBreadcrumbs myProfile={true} />
          <div className="relative w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
            />
          </div>
        </div>

        {/* Carousel Items */}
        <div className="flex flex-col gap-3">
          {filteredCarouselItems.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                {searchQuery.trim()
                  ? "No carousel items found matching your search."
                  : "No carousel items available."}
              </div>
            </div>
          ) : (
            filteredCarouselItems.map((carouselItem) => {
              if (carouselItem.data?.__typename === "Program") {
                const program = carouselItem.data;
                return (
                  <div
                    key={carouselItem.id}
                    className="flex flex-col gap-3 p-3 border rounded-lg"
                  >
                    {/* Badge Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={
                            localSwitchStates[carouselItem.id || ""] ??
                            (carouselItem.isActive || false)
                          }
                          onChange={() =>
                            handleSwitchChange(
                              carouselItem.id || "",
                              localSwitchStates[carouselItem.id || ""] ??
                                (carouselItem.isActive || false)
                            )
                          }
                        />
                        {program.keywords?.map((keyword, index) => (
                          <Badge
                            key={`${keyword.name}-${index}`}
                            variant="secondary"
                            className="text-xs"
                          >
                            {keyword.name}
                          </Badge>
                        ))}
                      </div>
                      <ProgramStatusBadge program={program} />
                      {/* <div className="flex items-center gap-2 bg-[#18181B0A] rounded-full px-2 py-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-semibold text-[#18181B]">Program</span>
                      </div> */}
                    </div>

                    {/* Content Section */}
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                        {program.image && (
                          <img
                            src={program.image}
                            alt={program.name || "Program"}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-2 flex-1">
                        <Link
                          to={getProgramDetailsUrl(carouselItem)}
                          className="text-lg font-bold text-[#18181B] hover:text-primary transition-colors cursor-pointer"
                        >
                          {program.name}
                        </Link>

                        <div className="inline-flex self-start text-sm bg-secondary py-1 px-2 items-center rounded-md">
                          <span className="text-neutral-400 mr-3">PRICE</span>{" "}
                          <span className="flex items-center text-muted-foreground gap-1 font-medium">
                            {getCurrencyIcon(program?.currency)}{" "}
                            {program?.price} {program?.currency}
                          </span>
                          <span className="block ml-2 border-l pl-2 text-muted-foreground font-medium">
                            {getCurrency(program?.network)?.display}
                          </span>
                        </div>
                        <div className="inline-flex self-start text-sm bg-secondary py-1 px-2 items-center rounded-md">
                          <span className="text-neutral-400 mr-3">
                            DEADLINE
                          </span>
                          <span className="font-medium text-muted-foreground">
                            {format(
                              new Date(program?.deadline ?? new Date()),
                              "dd . MMM . yyyy"
                            ).toUpperCase()}
                          </span>
                          {program?.deadline &&
                            (() => {
                              const deadlineDate = new Date(program.deadline);
                              const today = new Date();
                              // Zero out the time for both dates to get full days difference
                              deadlineDate.setHours(0, 0, 0, 0);
                              today.setHours(0, 0, 0, 0);
                              const diffTime =
                                deadlineDate.getTime() - today.getTime();
                              const daysRemaining = Math.max(
                                0,
                                Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              );
                              return (
                                <Badge className="ml-2">
                                  D-{daysRemaining}
                                </Badge>
                              );
                            })()}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    {program.summary && (
                      <p className="text-sm text-[#64748B] line-clamp-2">
                        {program.summary}
                      </p>
                    )}
                  </div>
                );
              }
              if (carouselItem.data?.__typename === "Post") {
                const post = carouselItem.data;
                return (
                  <div
                    key={carouselItem.id}
                    className="flex flex-col gap-3 p-3 border rounded-lg bg-[#FAFAFA]"
                  >
                    {/* Switch */}
                    <div className="flex justify-start">
                      <Switch
                        checked={
                          localSwitchStates[carouselItem.id || ""] ??
                          (carouselItem.isActive || false)
                        }
                        onChange={() =>
                          handleSwitchChange(
                            carouselItem.id || "",
                            localSwitchStates[carouselItem.id || ""] ??
                              (carouselItem.isActive || false)
                          )
                        }
                      />
                    </div>

                    {/* Post Content */}
                    <div className="flex gap-5">
                      {/* Image */}
                      <div className="w-[356px] h-[242px] bg-gray-200 rounded-lg flex-shrink-0">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title || "Post"}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <Link
                            to={getPostDetailsUrl(carouselItem)}
                            className="text-base font-bold text-[#18181B] line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs font-bold text-muted-foreground">
                            {post.author?.firstName} {post.author?.lastName}
                          </p>
                          {post?.createdAt && (
                            <div className="flex gap-[6px] text-xs text-muted-foreground">
                              <span>
                                {format(new Date(post.createdAt), "dd.MM.yyyy")}
                              </span>
                              <span>•</span>
                              <span>Views {post.viewCount}</span>
                            </div>
                          )}
                          {post.summary && (
                            <p className="text-sm text-[#64748B] line-clamp-3">
                              {post.summary}
                            </p>
                          )}
                        </div>

                        <div className="mt-auto">
                          <Button
                            variant="secondary"
                            className="bg-[#F4F4F5] text-[#71717A] hover:bg-[#F4F4F5]"
                          >
                            Comments{" "}
                            <span className="font-bold text-primary ml-1">
                              {post.comments?.length}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>

        {/* Save Changes Button */}
        {filteredCarouselItems.length > 0 && (
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveChanges}
              className="bg-foreground hover:bg-foreground/90 text-white px-6 py-2 h-11"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BannerAdminPage;
