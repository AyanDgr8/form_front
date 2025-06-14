// src/components/Form.js

import React, { useState, useRef } from 'react';
import './Form.css';

const INIT = {
    company: '',
    name: '',
    phone: '',
    email: '',
    query: '',
    disposition: '',
};

const DISPOSITIONS = [
  'Application Support',
  'B2B Lead',
  'Concierge Services',
  'Consultant support',
  'Customer Support',
  'General Enquiry',
  'New Lead',
  'Renewals',
];

export default function Form() {
  const [values, setValues] = useState(INIT);
  const [status, setStatus] = useState('');
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contact_number') {
      // allow only + at first char and digits, limit 15 digits
      const allowed = /^\+?\d{0,15}$/;
      if (!allowed.test(value)) return; // ignore invalid keystroke
    }

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- simple validation ---
    const phoneRegex = /^\+?\d{1,15}$/; // optional + and up to 15 digits (16 chars max)
    const phone = values.contact_number.trim();
    if (phone && !phoneRegex.test(phone)) {
      setStatus('Invalid phone format');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setStatus('Invalid email');
      return;
    }

    setStatus('Submitting…');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, contact_number: phone }),
      });
      if (!res.ok) throw new Error('Request failed');
      setValues(INIT);
      setStatus('Submitted ✅');
      // Reset native form fields to ensure visual clear
      formRef.current?.reset();
      // Clear status message after 3 s
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setStatus('Error ❌');
    }
  };

  return (
    <div className="form-wrapper">
        <div className="header-logo">
            <img src="/uploads/logo.webp" alt="multyform logo" className="logooo"/>
        </div>
        <h2>Contact Form</h2>
        <form className="form-body" ref={formRef} onSubmit={handleSubmit}>

            <label>
            Company
            <input name="company" value={values.company} onChange={handleChange} required />
            </label>
            <label>
            Client Name
            <input name="name" value={values.name} onChange={handleChange} required />
            </label>
            <label>
            Email
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            </label>
            <label>
            Contact Number
            <input
              type="tel"
              name="contact_number"
              inputMode="numeric"
              value={values.contact_number}
              onChange={handleChange}
              required
              title="Digits only, optional leading +"
              maxLength={16}
            />
            </label>
            <label>
            Disposition
            <select name="disposition" value={values.disposition} onChange={handleChange} required>
                <option value="" disabled>Select disposition</option>
                {DISPOSITIONS.map((d) => (
                <option key={d} value={d}>{d} required</option>
                
                ))}
            </select>
            </label>
            <label>
            Query
            <textarea name="query" value={values.query} onChange={handleChange} />
            </label>
            {status && <p className="status">{status}</p>}
            <button type="submit" className="submit-btn">Submit</button>
        </form>
    </div>
  );
}
