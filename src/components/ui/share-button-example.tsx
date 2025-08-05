import { ShareButton } from './share-button';

export function ShareButtonExample() {
  const handleShare = (type: 'link' | 'farcaster') => {
    console.log(`Sharing via ${type}`);
    // Здесь будет логика шаринга
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Share Button Examples</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Default Share Button</h3>
          <ShareButton onShare={handleShare} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Text</h3>
          <ShareButton onShare={handleShare}>Share this content</ShareButton>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Small Size</h3>
          <ShareButton size="sm" onShare={handleShare} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Icon Only</h3>
          <ShareButton size="icon" onShare={handleShare} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Ghost Variant</h3>
          <ShareButton variant="ghost" onShare={handleShare} />
        </div>
      </div>
    </div>
  );
}
