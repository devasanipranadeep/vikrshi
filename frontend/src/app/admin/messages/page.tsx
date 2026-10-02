'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { MessagesManager } from '@/components/admin/MessagesManager';
import { ContactMessageItem } from '@/types';
import { contactService } from '@/services/contacts';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);

  const loadData = async () => {
    try {
      const data = await contactService.getContactMessages();
      setMessages(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminWrapper activeTab="messages">
      <MessagesManager
        messages={messages}
        onMessageUpdated={loadData}
      />
    </AdminWrapper>
  );
}
