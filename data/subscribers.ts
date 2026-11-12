export interface SubscriberItem {
  id: string;
  email: string;
  source: string;
  status: "Active" | "Unsubscribed";
  createdAt: string;
}

export const DEFAULT_SUBSCRIBERS: SubscriberItem[] = [
  {
    id: "sub-1",
    email: "mohit.verma@gmail.com",
    source: "Homepage Banner",
    status: "Active",
    createdAt: "2026-11-10T08:15:00.000Z",
  },
  {
    id: "sub-2",
    email: "priya.nair@fitnessclub.in",
    source: "Homepage Banner",
    status: "Active",
    createdAt: "2026-11-08T14:20:00.000Z",
  },
  {
    id: "sub-3",
    email: "kunal.sports99@outlook.com",
    source: "Homepage Banner",
    status: "Active",
    createdAt: "2026-11-05T19:40:00.000Z",
  },
  {
    id: "sub-4",
    email: "deepak.athletic@gmail.com",
    source: "Homepage Banner",
    status: "Active",
    createdAt: "2026-10-29T11:10:00.000Z",
  },
];
