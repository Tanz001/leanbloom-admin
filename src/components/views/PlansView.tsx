import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { adminApi, type SubscriptionPlan } from '../../lib/api';
import { useToast } from '../ui/Toast';

export const PlansView: React.FC = () => {
  const toast = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 199,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { plans: rows } = await adminApi.listPlans();
      setPlans(rows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({ name: '', description: '', price: 199, isActive: true });
  };

  const startEdit = (p: SubscriptionPlan) => {
    setCreating(false);
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      isActive: p.isActive,
    });
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingId(null);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Plan name is required');
      return;
    }
    setSaving(true);
    try {
      if (creating) {
        await adminApi.createPlan({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          isActive: form.isActive,
        });
        toast.success('Plan created');
      } else if (editingId) {
        await adminApi.updatePlan(editingId, {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          isActive: form.isActive,
        });
        toast.success('Plan updated');
      }
      cancelForm();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await adminApi.deletePlan(id);
      toast.success('Plan deleted');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Plans"
        description="Subscription plans affiliates pay monthly via PayPal."
        actions={
          !creating && !editingId ? (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#0B2440] hover:bg-[#12345F] rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add plan
            </button>
          ) : null
        }
      />

      {(creating || editingId) && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0B2440] font-display">
            {creating ? 'New plan' : 'Edit plan'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6B7C8F] mb-1.5">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl"
                placeholder="LeanBloom Partner"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6B7C8F] mb-1.5">
                Price (USD / month)
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#6B7C8F] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl resize-none"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-[#0F1C2E]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            Active (shown on signup)
          </label>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelForm}
              className="px-3 py-2 text-xs font-semibold text-[#5B6B7C] hover:bg-[#F5F8FB] rounded-xl inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] rounded-xl inline-flex items-center gap-1 disabled:opacity-60"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-[#6B7C8F]">Loading plans…</p>
        ) : plans.length === 0 ? (
          <p className="p-8 text-sm text-[#6B7C8F]">No plans yet. Add one to start.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-[#8A96A6] border-b border-[#EEF2F6] bg-[#FAFBFC]">
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3F7]">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#0B2440]">{p.name}</p>
                    <p className="text-[12px] text-[#6B7C8F] mt-0.5 line-clamp-2">
                      {p.description || '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums text-[#0B2440]">
                    ${p.price.toFixed(2)}
                    <span className="text-[12px] font-medium text-[#8A96A6]">
                      {' '}
                      / mo
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.isActive
                          ? 'bg-[#EAF6E7] text-[#2E9B4B]'
                          : 'bg-[#F2F4F7] text-[#667085]'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="p-2 text-[#5B6B7C] hover:text-[#173B72] hover:bg-[#EAF4FB] rounded-lg inline-flex"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="p-2 text-[#5B6B7C] hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
