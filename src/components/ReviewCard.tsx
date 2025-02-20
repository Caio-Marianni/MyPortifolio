import React from "react";
import { Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Review } from "@/core/types";
import { reviewsThumbs, reviewsWebDev } from "@/core/constants/index";

type ReviewCardProps = {
  context: "thumbs" | "webdev";
};

export default function ReviewCard({ context }: ReviewCardProps) {
  return (
    <div className="flex justify-center flex-wrap gap-2">
      {context === "webdev" ? (
        <>
          {reviewsWebDev.map((review: Review, index: number) => (
            <Card key={index}>
              <CardContent className="p-4 min-w-[200px]">
                <div className="flex items-center mb-2">{renderStars(review.rating)}</div>
                <p className="italic mb-2">&quot;{review.comment}&quot;</p>
                <p className="text-sm text-muted-foreground">
                  {review.name} - {review.channel}
                </p>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <>
          {reviewsThumbs.map((review: Review, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">{renderStars(review.rating)}</div>
                <p className="italic mb-2">&quot;{review.comment}&quot;</p>
                <p className="text-sm text-muted-foreground">
                  {review.name} - {review.channel}
                </p>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400 w-5 h-5" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className="text-yellow-400 fill-yellow-400 w-5 h-5" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="text-gray-300 w-5 h-5" />);
  }

  return stars;
}
