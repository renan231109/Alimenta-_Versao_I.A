import { Link } from 'react-router-dom';
import { MapPin, Clock, Scale } from 'lucide-react';
import type { Donation, UrgencyLevel } from '../../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../types';

interface DonationCardProps {
  donation: Donation;
  showDistance?: boolean;
}

function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const classes = {
    ALTA: 'badge-urgency-alta',
    MEDIA: 'badge-urgency-media',
    BAIXA: 'badge-urgency-baixa',
  };
  const labels = {
    ALTA: 'Urgência Alta',
    MEDIA: 'Urgência Média',
    BAIXA: 'Urgência Baixa',
  };
  return <span className={classes[urgency]}>{labels[urgency]}</span>;
}

export function DonationCard({ donation, showDistance }: DonationCardProps) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(donation.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <Link to={`/doacoes/${donation.id}`} className="card block group hover:border-primary-200">
      <div className="flex gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-3xl">
          {donation.photo ? (
            <img src={donation.photo} alt={donation.name} className="h-full w-full rounded-xl object-cover" />
          ) : (
            '🥗'
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">{donation.name}</h3>
            <UrgencyBadge urgency={donation.urgency} />
          </div>

          <p className="mt-1 text-sm text-gray-500">{CATEGORY_LABELS[donation.category]}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Scale className="h-3.5 w-3.5" />
              {donation.weightKg} kg
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {daysLeft} dia{daysLeft !== 1 ? 's' : ''} restante{daysLeft !== 1 ? 's' : ''}
            </span>
            {showDistance && donation.distanceKm !== undefined && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {donation.distanceKm} km
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">{donation.donor?.name}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {STATUS_LABELS[donation.status]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
