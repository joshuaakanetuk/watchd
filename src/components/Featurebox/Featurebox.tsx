import React from "react";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid'

interface FeatureboxProps {
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const features = [
  {
    name: 'Lookup Movies & Shows',
    description: 'Effortlessly explore vast movie and TV collections. Find details, ratings, and cast info with a user-friendly search interface.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Create Lists',
    description: 'Curate themed collections of favorites. Organize films and shows by mood, genre, or personal preference.',
    icon: LockClosedIcon,
  },
  {
    name: 'Log Your Watches',
    description: 'Track your viewing history. Record dates, ratings, and remember what you\'ve watched.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Import from Letterboxd',
    description: 'Transfer data seamlessly from Letterboxd. Migrate watch history and lists hassle-free.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Customize Your Profile',
    description: 'Express yourself. Add a profile picture, bio, and theme to connect with others.',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Review Your Watches',
    description: 'Share insights on movies and shows. Write reviews, engage with others, and contribute to discussions.',
    icon: ServerIcon,
  },
]

/**
 * Primary UI component for user interaction
 */
export const Featurebox = ({
  onClick,
}: FeatureboxProps) => {
  return (
    <div className="mx-auto my-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-white">
                <feature.icon className="absolute left-1 top-1 h-5 w-5 text-white" aria-hidden="true" />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
  );
};
