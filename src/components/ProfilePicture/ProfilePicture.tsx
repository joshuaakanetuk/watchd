import Image from "next/image";
import React from "react";

const SIZES = {
    tiny: 16,
    list: 32,
    profile: 200,
  };

interface ProfilePictureProps {
  size: keyof typeof SIZES;
  /**
   * Hosted url for the image.
   */
  url: string | undefined;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const ProfilePicture = ({
  url = "https://placehold.co/600x600/png",
  size = 'tiny',
  onClick,
}: ProfilePictureProps) => {
  return (
    <Image
      className="rounded-full inline-block border border-[404040]"
      width={SIZES[size]}
      height={SIZES[size]}
      src={url}
      alt={"Profile image for"}
    />
  );
};
