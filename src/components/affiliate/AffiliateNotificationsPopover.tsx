import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ShoppingBag,
  Percent,
  CreditCard,
  User,
  X
} from 'lucide-react';

export interface AffiliateNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'commission' | 'payout' | 'patient';
  read: boolean;
}

interface AffiliateNotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute?: (route: string) => void;
}

const INITIAL_NOTIFICATIONS: AffiliateNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New GLP-1 Patient Order',
    message: 'Sarah Johnson placed an order for Weight Management ($299.00). Commission +$44.85 logged.',
    time: '12m ago',
    type: 'order',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Commission Approved',
    message: 'Emily Davis order #LB-10481 cleared clinical review. $41.10 commission approved.',
    time: '2h ago',
    type: 'commission',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Bi-Monthly Payout Transmitted',
    message: 'ACH disbursement LB-PAYOUT-1038 of $2,480.00 was deposited to JPMorgan Chase.',
    time: 'Sep 15',
    type: 'payout',
    read: true
  },
  {
    id: 'notif-4',
    title: 'New Patient Intake Completed',
    message: 'Jonathan Hayes submitted baseline intake questionnaires for Longevity protocol.',
    time: 'Sep 15',
    type: 'patient',
    read: true
  }
];

export const AffiliateNotificationsPopover: React.FC<AffiliateNotificationsPopoverProps> = ({
  isOpen,
  onClose
}) => {
  const [items, setItems] = useState<AffiliateNotificationItem[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F7F9FC] border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-[#172033]">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#174A87] text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-semibold text-[#174A87] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#667085] hover:text-[#172033] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
        {items.map((item) => {
          const Icon =
            item.type === 'order'
              ? ShoppingBag
              : item.type === 'commission'
              ? Percent
              : item.type === 'payout'
              ? CreditCard
              : User;

          return (
            <div
              key={item.id}
              onClick={() => markSingleAsRead(item.id)}
              className={`p-3.5 flex items-start gap-3 hover:bg-[#F7F9FC] transition-colors cursor-pointer ${
                !item.read ? 'bg-[#EAF5EA]/25' : 'bg-white'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  item.type === 'commission'
                    ? 'bg-[#EAF5EA] text-[#4A9B52]'
                    : item.type === 'order'
                    ? 'bg-[#174A87]/10 text-[#174A87]'
                    : item.type === 'payout'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-xs ${
                      !item.read ? 'font-bold text-[#172033]' : 'font-medium text-[#172033]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#667085]">{item.time}</span>
                </div>
                <p className="text-[11px] text-[#667085] leading-snug line-clamp-2">
                  {item.message}
                </p>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-[#174A87] shrink-0 mt-1.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#F7F9FC] border-t border-[#E5E7EB] text-center">
        <span className="text-[11px] text-[#667085]">
          Real-time webhook notifications enabled for your tenant
        </span>
      </div>
    </div>
  );
};
