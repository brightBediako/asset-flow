import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Input } from '@/components/ui/BaseComponents';
import toast from 'react-hot-toast';

export default function BookAsset() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('assetId');

  const [form, setForm] = useState({
    startTime: '',
    numberOfDays: 1,
  });

  const assetQuery = useQuery({
    queryKey: ['book-asset', assetId],
    queryFn: async () => {
      const resp = await apiClient.get(`/assets/${assetId}`);
      return resp.data;
    },
    enabled: Boolean(assetId),
  });

  const asset = assetQuery.data;

  const estimatedTotal = useMemo(() => {
    const days = Number(form.numberOfDays || 0);
    const price = Number(asset?.pricePerDayGhs || 0);
    return days > 0 ? days * price : 0;
  }, [form.numberOfDays, asset?.pricePerDayGhs]);

  const missingContact = useMemo(() => {
    const org = asset?.organization;
    return Boolean(org && !org.contactEmail && !org.contactPhoneNumber);
  }, [asset?.organization]);

  const createBooking = useMutation({
    mutationFn: async (payload) => {
      const resp = await apiClient.post('/bookings', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('Booking request submitted');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      navigate('/app/my-bookings', { replace: true });
    },
  });

  const validate = () => {
    if (!user?.id) return 'You must be logged in to book an asset';
    if (!asset?.id) return 'Asset not found';
    if (!asset?.organization?.id) return 'This asset has no organization; cannot be booked';
    if (!form.startTime) return 'Start date/time is required';
    const days = Number(form.numberOfDays);
    if (Number.isNaN(days) || days < 1) return 'Number of days must be at least 1';
    return null;
  };

  const submit = (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    const organizationId = asset.organization.id;
    const days = Number(form.numberOfDays);
    const start = new Date(form.startTime);
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    createBooking.mutate({
      organization: { id: Number(organizationId) },
      asset: { id: Number(asset.id) },
      user: { id: Number(user.id) },
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
  };

  const cancelBooking = () => navigate('/app/my-bookings');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Book Asset</h1>
          <p className="text-slate-600 mt-1">Select duration and submit your booking request.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/assets')}>
          Back to assets
        </Button>
      </div>

      <Card title="Asset & Payment Contact">
        {assetQuery.isLoading ? (
          <div className="text-sm text-slate-500">Loading asset…</div>
        ) : asset ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Asset</div>
                <div className="text-xl font-black text-slate-900">{asset.name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  Price/day:{' '}
                  <span className="font-bold">GHS {Number(asset.pricePerDayGhs || 0).toFixed(2)}</span>
                </div>
              </div>
              {asset.imageUrl ? (
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="h-20 w-28 rounded-xl object-cover border border-slate-200"
                />
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Organization contact (for payment)</div>
              <div className="mt-1 font-bold text-slate-900">
                {asset.organization?.name || '—'}
              </div>
              <div className="mt-1 text-sm text-slate-600 space-y-1">
                {asset.organization?.location ? <div>Location: {asset.organization.location}</div> : null}
                {asset.organization?.contactEmail ? <div>Email: {asset.organization.contactEmail}</div> : null}
                {asset.organization?.contactPhoneNumber ? <div>Phone: {asset.organization.contactPhoneNumber}</div> : null}
                {missingContact ? (
                  <div className="text-amber-700">
                    Contact details not set yet. Ask the organization admin to update them in Profile.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-rose-600">Asset not found.</div>
        )}
      </Card>

      <Card title="Booking Details">
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start"
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
            />
            <Input
              label="Number of days"
              type="number"
              min="1"
              step="1"
              value={form.numberOfDays}
              onChange={(e) => setForm((prev) => ({ ...prev, numberOfDays: e.target.value }))}
            />
          </div>

          <div className="text-sm text-slate-600">
            Estimated total: <span className="font-bold">GHS {estimatedTotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" isLoading={createBooking.isPending} disabled={!asset}>
              Submit booking request
            </Button>
            <Button type="button" variant="secondary" onClick={cancelBooking}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

