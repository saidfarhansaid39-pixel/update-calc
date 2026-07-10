import { getAuthorForHub } from '@/lib/authors';
import { getReviewKind, type ReviewKind } from '@/lib/trust';

const COPY: Record<ReviewKind, { heading: string; sub: string }> = {
  medical: { heading: 'Medically reviewed', sub: 'Medically reviewed' },
  financial: { heading: 'Financially reviewed', sub: 'Financially reviewed' },
  expert: { heading: 'Expert reviewed', sub: 'Expert reviewed' },
};

export function ReviewedBadge({ hub, date, kind }: { hub: string; date: string; kind?: ReviewKind }) {
  const author = getAuthorForHub(hub);
  const reviewKind: ReviewKind = kind || getReviewKind(hub);
  const headingText =
    reviewKind === 'medical'
      ? 'Medically reviewed'
      : reviewKind === 'financial'
        ? 'Financially reviewed'
        : 'Expert reviewed';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-950/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" aria-hidden="true">
        ✓
      </div>
      <div className="text-sm">
        <p className="font-medium text-gray-900 dark:text-white">{headingText}</p>
        <p className="text-gray-600 dark:text-gray-400">
          by {author.name}, {author.credentials} · Last reviewed {date}
        </p>
      </div>
    </div>
  );
}
