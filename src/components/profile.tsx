"use client";
import Star from "@/components/star";
import ProfileInfo from "@/components/profile-info";
import ProfileBanner from "@/components/profile-banner";

export default function Profile() {

  return (
    <section className="flex flex-col gap-4 mt-6">
      {/* top Part */}
      <div className="w-full">
        <ProfileBanner />
      </div>

      {/* bottom Part */}
      <div className="flex flex-col xl:flex-row gap-6 w-full">
        <div className="w-full xl:w-1/2">
          <ProfileInfo />
        </div>
        <div className="w-full xl:w-1/2">
          <Star />
        </div>
      </div>
    </section>
  );
}
