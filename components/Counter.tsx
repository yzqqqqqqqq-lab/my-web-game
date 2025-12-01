'use client';

import { useCounterStore } from '@/stores/useCounterStore';
import {
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Counter Example
      </h2>
      
      <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
        {count}
      </div>

      <div className="flex gap-4">
        <button
          onClick={decrement}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          aria-label="Decrement"
        >
          <MinusIcon className="w-5 h-5" />
          Decrement
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          aria-label="Reset"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Reset
        </button>

        <button
          onClick={increment}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          aria-label="Increment"
        >
          <PlusIcon className="w-5 h-5" />
          Increment
        </button>
      </div>
    </div>
  );
}

