function ConditionCard() {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 bg-gray-200 rounded-full" />

          <p className="font-bold text-sm">BUILDER NAME</p>
        </div>

        <p className="text-xs text-muted-foreground">about 5 days ago</p>
      </header>
      <p className="text-xs text-muted-foreground">
        <span className="font-bold">Project name</span> has given you a tier
      </p>

      <div className="flex items-center justify-between px-2 py-1 bg-[#0000000A] rounded-md">
        <p className="text-xs text-neutral-400 font-medium">TIER</p>
        <span className=" block bg-[#FFDEA1] rounded-full px-2 py-0.5 text-xs text-[#CA8A04] font-bold">
          GOLD
        </span>
      </div>
    </div>
  );
}

export default ConditionCard;
