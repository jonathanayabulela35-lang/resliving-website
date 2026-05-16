import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Messages() {
  const { user } = useAuth();

  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (user?.email) loadResidences();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
    } else {
      setMessages([]);
    }
  }, [selectedId]);

  const selectedResidence = useMemo(
    () => residences.find((item) => item.id === selectedId),
    [residences, selectedId]
  );

  const loadResidences = async () => {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select('*')
        .or(`owner_email.eq.${user.email},manager_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allResidences = (data || []).map((row) => ({
        ...row,
        building_name: row.name,
      }));

      setResidences(allResidences);
      setSelectedId(allResidences.length > 0 ? allResidences[0].id : null);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (residenceId) => {
    try {
      setMessagesLoading(true);
      const data = await api.entities.Message.filter(
        { residence_id: residenceId },
        '-created_date'
      );
      setMessages(data || []);
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!selectedId) {
        setNotice('Please select a building first.');
        return;
      }

      if (!subject.trim() || !body.trim()) {
        setNotice('Please enter both a subject and body.');
        return;
      }

      setSending(true);
      setNotice('');

      const createdMessage = await api.entities.Message.create({
        residence_id: selectedId,
        subject: subject.trim(),
        body: body.trim(),
        sent_by: user.email,
      });

      const { error: notificationError } = await supabase.functions.invoke(
        'send-message-notifications',
        {
          body: { message_id: createdMessage.id },
        }
      );

      if (notificationError) {
        throw notificationError;
      }

      setSubject('');
      setBody('');
      await loadMessages(selectedId);
      setNotice('Message sent successfully.');
    } catch (error) {
      setNotice(error.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Send building-wide messages and view sent message history.
          </p>
        </div>

        <ResidenceSelector
          residences={residences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          New Message
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Heading / Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message to students"
              rows={5}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          {selectedResidence ? (
            <p className="text-xs text-muted-foreground">
              Sending to students in{' '}
              <span className="font-medium text-foreground">
                {selectedResidence.building_name || selectedResidence.name}
              </span>
              .
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Select a building to send a message.
            </p>
          )}

          {notice ? (
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
              {notice}
            </div>
          ) : null}

          <div>
            <Button
              onClick={sendMessage}
              disabled={sending || !selectedId}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Sent Messages
        </h2>

        {messagesLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              No messages yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Sent messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground mt-3 leading-relaxed whitespace-pre-wrap">
                  {message.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
