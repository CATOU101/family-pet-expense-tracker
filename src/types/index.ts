export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: 'Family' | 'Pet';
  subcategory: string;
  date: string;
  createdAt: number;
}

export interface Budget {
  id: string;
  userId: string;
  category: 'Family' | 'Pet';
  subcategory: string;
  limit: number;
  period: 'monthly' | 'yearly';
  createdAt: number;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: string;
  createdAt: number;
}
