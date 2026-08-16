import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, Linkedin, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader, SectionHeading } from "@/components/campus/common";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CampusHub" },
      { name: "description", content: "Reach the student council desk, read FAQs and find campus office hours." },
      { property: "og:title", content: "Contact — CampusHub" },
      { property: "og:description", content: "Questions about events, clubs or certificates? Get in touch." },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  { q: "How do I register for an event?", a: "Open the event page and hit Register. You'll get a confirmation and the event appears on your dashboard immediately." },
  { q: "Where do I find my certificates?", a: "All certificates live under the Certificates tab on your dashboard and can be downloaded any time." },
  { q: "How are leaderboard points calculated?", a: "Attending an event gives +10, winning a hackathon +50, hosting or volunteering +20 and each certificate +15." },
  { q: "Can I start a new club?", a: "Yes. Submit a proposal with at least 15 founding members through this form and the student council reviews it monthly." },
  { q: "I registered but can't attend — what now?", a: "Cancel from the event page so your seat frees up for someone on the waitlist." },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent", { description: "The student council desk replies within 2 working days." });
    }, 700);
  };

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Say hello"
        title="Contact"
        subtitle="Questions about events, clubs, certificates or the app itself — this desk handles all of it."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="surface fade-up space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={6}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button type="submit" className="gradient-brand w-full border-0" disabled={sending}>
            <Send className="mr-2 size-4" /> {sending ? "Sending…" : "Send message"}
          </Button>
        </form>

        <div className="space-y-5">
          <div className="surface space-y-3 p-6">
            <h2 className="text-lg font-semibold">Student council desk</h2>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 text-primary" /> campushub@campus.edu
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-primary" /> Mon–Fri, 10:00 – 17:00
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" /> Admin Block, Room 112
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="icon" aria-label="Instagram">
                <Instagram className="size-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="LinkedIn">
                <Linkedin className="size-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Community chat">
                <MessageCircle className="size-4" />
              </Button>
            </div>
          </div>
          <div className="surface glow-bg flex h-56 items-center justify-center overflow-hidden">
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-primary" />
              <p className="mt-2 font-semibold">Campus map</p>
              <p className="text-sm text-muted-foreground">Admin Block, Gate 2</p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <SectionHeading title="Frequently asked" />
        <Accordion type="single" collapsible className="surface px-5">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
