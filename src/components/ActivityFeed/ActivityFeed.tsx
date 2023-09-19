import React from "react";

interface ActivityFeedObject {
  id: number;
  type: string;
  person: {
    name: string;
  }
  dateTime: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ActivityFeedProps {
  activity: ActivityFeedObject[];
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const ITEMS = [
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 2,
    type: "edited",
    person: { name: "Chelsea Hagon" },
    dateTime: "2023-01-23T11:03",
  },
  {
    id: 3,
    type: "sent",
    person: { name: "Chelsea Hagon" },
    dateTime: "2023-01-23T11:24",
  },
];

/**
 * Renders a vertical list of actions taken by
 * users.
 */
export const ActivityFeed = ({
  activity = ITEMS,
}: ActivityFeedProps) => {
  return (
    <>
      <ul role="list" className="space-y-3">
        {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === activity.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center"
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            <>
              <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
              </div>
              <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">
                  {activityItem.person.name}
                </span>{" "}
                {activityItem.type} the invoice.
              </p>
              <time
                dateTime={activityItem.dateTime}
                className="flex-none py-0.5 text-xs leading-5 text-gray-500"
              >
                {activityItem.dateTime}
              </time>
            </>
          </li>
        ))}
      </ul>
    </>
  );
};
