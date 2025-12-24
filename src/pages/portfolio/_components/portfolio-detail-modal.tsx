import LudiumBadgeLogo from "@/assets/icons/profile/ludium-badge.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Portfolio } from "@/types/portfolio";
import { ChevronLeft, ChevronRight, Pen, X } from "lucide-react";
import { useState } from "react";

interface PortfolioDetailModalProps {
  portfolio: Portfolio | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (portfolio: Portfolio) => void;
}

export function PortfolioDetailModal({
  portfolio,
  isOpen,
  onClose,
  onEdit,
}: PortfolioDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!portfolio) return null;

  const images = portfolio.images || [];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentImageIndex(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg font-semibold text-slate-800">
              {portfolio.title}
            </DialogTitle>
            {portfolio.isLudiumProject && (
              <img src={LudiumBadgeLogo} alt="Ludium Badge" className="h-5" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onEdit(portfolio)}
            >
              <Pen className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative bg-slate-100 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center min-h-[400px] p-4">
                <img
                  src={images[currentImageIndex]}
                  alt={`${portfolio.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[500px] object-contain rounded-lg"
                />
              </div>

              {/* Navigation arrows */}
              {hasMultipleImages && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Image indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-slate-800"
                          : "bg-slate-400"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Thumbnail strip */}
          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex
                      ? "border-slate-800"
                      : "border-transparent hover:border-slate-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Role */}
          {portfolio.role && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Role</h3>
              <p className="text-slate-800">{portfolio.role}</p>
            </div>
          )}

          {/* Description */}
          {portfolio.description && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">
                Description
              </h3>
              <p className="text-slate-700 whitespace-pre-wrap">
                {portfolio.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
