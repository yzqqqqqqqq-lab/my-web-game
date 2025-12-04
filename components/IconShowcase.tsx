'use client';

import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  HeartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

export default function IconShowcase() {
  const outlineIcons = [
    { Icon: HomeIcon, name: 'Home' },
    { Icon: UserIcon, name: 'User' },
    { Icon: Cog6ToothIcon, name: 'Settings' },
    { Icon: BellIcon, name: 'Notifications' },
    { Icon: HeartIcon, name: 'Heart' },
    { Icon: StarIcon, name: 'Star' },
  ];

  const solidIcons = [
    { Icon: HomeIconSolid, name: 'Home' },
    { Icon: UserIconSolid, name: 'User' },
    { Icon: Cog6ToothIconSolid, name: 'Settings' },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Heroicons Showcase
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Outline Icons
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {outlineIcons.map(({ Icon, name }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg"
              >
                <Icon className="w-8 h-8 text-gray-700" />
                <span className="text-sm text-gray-600">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Solid Icons
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {solidIcons.map(({ Icon, name }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg"
              >
                <Icon className="w-8 h-8 text-gray-700" />
                <span className="text-sm text-gray-600">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

