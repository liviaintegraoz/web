import React from 'react';
import { Scale, FileText, Gavel, Heart } from 'lucide-react';

export const LAW_TOPICS = [
  { id: 'residency', icon: React.createElement(Scale, { size: 20 }) },
  { id: 'labor', icon: React.createElement(FileText, { size: 20 }) },
  { id: 'civil-rights', icon: React.createElement(Gavel, { size: 20 }) },
  { id: 'human-rights', icon: React.createElement(Heart, { size: 20 }) },
];
