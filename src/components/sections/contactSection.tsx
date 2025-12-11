"use client";

import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
    alert("Message sent! (This is a placeholder)");
  };

  return (
    <div className="space-y-4 font-document text-sm text-office-desk">
      <div>
        <h4 className="font-bold text-base mb-2">Get In Touch</h4>
        <p className="text-passport-tan text-xs mb-4">
          Have a project in mind? Let's work together!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold mb-1">NAME:</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-passport-paper border-2 border-passport-tan text-office-desk text-xs focus:border-stamp-approved outline-none"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">EMAIL:</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-passport-paper border-2 border-passport-tan text-office-desk text-xs focus:border-stamp-approved outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">MESSAGE:</label>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 bg-passport-paper border-2 border-passport-tan text-office-desk text-xs focus:border-stamp-approved outline-none resize-none"
            placeholder="Tell me about your project..."
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-stamp-approved text-passport-paper font-bold text-xs border-2 border-stamp-approved hover:bg-stamp-approved/90"
        >
          SEND MESSAGE
        </button>
      </form>

      <div className="border-t-2 border-passport-tan pt-3">
        <p className="text-xs font-bold mb-2">DIRECT CONTACT:</p>
        <div className="space-y-1 text-xs text-passport-tan">
          <p>📧 Email: caio@example.com</p>
          <p>💼 LinkedIn: /caio-marianni</p>
          <p>💬 WhatsApp: Available on request</p>
        </div>
      </div>
    </div>
  );
}
